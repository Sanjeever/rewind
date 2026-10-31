import PlayerPresentation from './PlayerPresentation';
import {subscribePlaybackEvent} from './commands';
import {collectTracks, showTrackDetails, choosePlaylist} from '../modals/commands';
import type {
  PlayerProps,
  PlayerState,
  QueueSnapshot,
  PlaybackCommand,
  InsertCommand,
} from './types';
import type {TrackFields, TrackId} from '../services/track';
import type {Provider} from '../services/providers';
import type {LyricRow} from '../utils/parseLyric';
import type {PlayerError} from '../native/audioPlayer';
import type {Subscription} from '../events/Emitter';
import type {AppStateStatus} from 'react-native';
import {errorMessage, hasErrorCode} from '../utils/types';
import {isActiveQueue} from './types';
import {toast} from '../native/toast';
import React from 'react';
import {AppState, BackHandler, DeviceEventEmitter} from 'react-native';
import providers from '../services/providers';
import names from '../events/names';
import keys from '../storage/keys';
import locales from '../locales';
import {Netease} from '../services';
import {extractFullInfo, getTrackKey} from '../services/trackInfo';
import parseArtist from '../utils/parseArtist';
import universalNavigator from '../utils/universalNavigator';
import stopTimer from '../utils/stopTimer';
import AudioPlayer from '../native/audioPlayer';
import timer from '../native/timer';
import mediaStore from '../native/mediaStore';
import shutdown from '../native/shutdown';
import wakeLock from '../native/wakeLock';
import {storage} from '../storage';
import {isUsableFile} from '../storage/files';
import lastSong from '../storage/lastSong';
import lastTime from '../storage/lastTime';
import lastQueue from '../storage/lastQueue';
import {musicHistory} from '../storage/history';
import cache from './cache';
import lyricPreferences from './lyricPreferences';
import {selectQueue, insertNext, removeFromQueue} from './queue';
import playModeActions from './playMode';
import lyrics from './lyrics';
import trackUrl from './trackUrl';
import notification from './notification';
import {createPlayOrder, reconcilePlayOrder, getNextPlayIndex, getRandomIndex} from './playOrder';
import {subscribePlaybackCommands} from './commands';
const PROGRESS_INTERVAL = 600;
export default class PlayerController extends React.PureComponent<PlayerProps, PlayerState> {
  presentation = new PlayerPresentation({
    getState: () => this.state,
    getSong: () => this.activeQueue.songItem,
    update: (update, onCommitted) =>
      this.setState(
        (state) => ({...state, ...(typeof update === 'function' ? update(state) : update)}),
        onCommitted,
      ),
    togglePlay: () => this.togglePlay(),
    seek: (seconds) => this.seekTo(seconds),
    refreshTime: () => this.getMusicTimeInfo('currentTime'),
  });
  get activeQueue() {
    if (!isActiveQueue(this.props)) throw new Error('播放队列尚未选中歌曲');
    return this.props;
  }
  audio: AudioPlayer | null = null;
  mounted = false;
  playbackStateSubscription!: Subscription;
  backSubscription!: Subscription;
  appStateSubscription!: Subscription;
  subscriptions: Subscription[] = [];
  notificationCleanup!: () => void;
  unsubscribeCommands!: () => void;
  currentTimeTimer: number | null = null;
  closeTimer: number | null = null;
  restoreRequest: number | null = null;
  resumeAfterFocus = false;
  playbackRequest = 0;
  lyricRequest = 0;
  queueKeys: string[] = [];
  savedFMQueue: Pick<QueueSnapshot, 'tracks' | 'playingIndex' | 'songItem' | 'api'> | null = null;
  audioFocusType: string | null = null;
  cachedGetWebMusicUrl = cache((request, api) =>
    trackUrl.getUrl(api, request, this.props.settings.defaultHighQuality),
  );
  state: PlayerState = {
    url: '',
    playState: 'paused',
    currentTime: 0,
    duration: 0,
    expanded: false,
    playMode: 'list',
    showLyric: false,
    loaded: false,
    showTool: true,
    isLike: false,
    volume: 1,
    color: '#fff',
    showSlider: false,
    showTrans: true,
    showCoverElevation: true,
    randomArray: [],
    isFM: false,
    lyricFontSize: 15,
    retriedTimes: 0,
    currentMiniLyric: '',
    pid: undefined,
    playingSongUID: undefined,
    lastPlayedTracksLoaded: false,
    isBackground: false,
  };
  componentDidMount() {
    this.mounted = true;
    this.playbackStateSubscription = DeviceEventEmitter.addListener(
      'rewind.playbackState',
      this.handlePlaybackState,
    );
    lyricPreferences
      .loadAll()
      .then((preferences) => {
        if (!this.mounted) return;
        this.setState((state) => ({
          ...state,
          ...preferences,
          randomArray: createPlayOrder(this.props.tracks.length),
        }));
      })
      .catch((error) => toast('读取播放设置失败：' + error.message));
    this.notificationCleanup = notification.init({
      previous: () => this.changeSong('pre'),
      next: () => this.changeSong('next'),
      play: this.playSound,
      pause: this.pauseSound,
      stop: this.exit,
    });
    AudioPlayer.setHandleAudioFocus(!this.props.settings.playWithOthers);
    this.backSubscription = BackHandler.addEventListener(
      'hardwareBackPress',
      this.presentation.onBackPress,
    );
    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange);
    this.unsubscribeCommands = subscribePlaybackCommands({
      play: this.handlePlayCommand,
      insert: this.insertIntoQueue,
      remove: this.removeTrack,
    });
    this.subscriptions = [
      subscribePlaybackEvent('HidePlayer', (event) =>
        this.setState({
          hidePlayer: !!event?.hide,
        }),
      ),
      subscribePlaybackEvent('PlayerClose', () => {
        if (this.state.expanded) this.presentation.close(true);
      }),
      subscribePlaybackEvent('FM_MODE', this.onFmMode),
      subscribePlaybackEvent('AUDIO_NOISY', this.pauseSound),
      subscribePlaybackEvent('CloseTimerEvent', this.setCloseTimer),
      DeviceEventEmitter.addListener(names.NATIVE_AUDIO_FOCUS, this.handleAudioFocus),
    ];
    this.presentation.initialize();
  }
  componentDidUpdate(previous: PlayerProps) {
    if (previous.settings.playWithOthers !== this.props.settings.playWithOthers) {
      AudioPlayer.setHandleAudioFocus(!this.props.settings.playWithOthers);
    }
  }
  componentWillUnmount() {
    this.mounted = false;
    this.playbackRequest++;
    this.lyricRequest++;
    this.unsubscribeCommands();
    this.subscriptions.forEach((subscription) => subscription.remove());
    this.playbackStateSubscription.remove();
    this.backSubscription.remove();
    this.appStateSubscription.remove();
    this.notificationCleanup();
    this.clearTimers();
    this.audio?.release();
    this.audio = null;
    this.presentation.dispose();
  }
  clearTimers = () => {
    for (const name of ['currentTimeTimer', 'closeTimer'] as const) {
      const id = this[name];
      if (id) timer.clearTimeout(id);
      this[name] = null;
    }
  };
  handlePlaybackState = ({playing}: {playing: boolean}) => {
    const playState = playing ? 'playing' : 'paused';
    if (playState !== this.state.playState)
      this.setState(
        {
          playState,
        },
        this.intervalCurrentTimeGetter,
      );
  };
  handlePlayCommand = (command: PlaybackCommand) => {
    if (command.type === 'clearPlayingList') return this.clearPlayingList();
    if (!command.song || !Array.isArray(command.data) || !command.data[command.index]) {
      toast('播放指令缺少歌曲或有效队列位置');
      return;
    }
    const request = ++this.playbackRequest;
    this.restoreRequest = command.restore ? request : null;
    this.switchSong();
    this.props.setPlayerData(
      (current) => {
        const selected = selectQueue(current, command, this.state.playMode);
        const info = extractFullInfo(selected.songItem);
        return {
          ...selected,
          songItemInfo: {
            song: info.song,
            singer: info.singer,
            uid: info.uid,
          },
        };
      },
      (selected) => {
        if (request !== this.playbackRequest) return;
        this.syncPlayOrder(selected.tracks);
        this.loadPlayerResource(selected, command.pid, request);
      },
    );
  };
  syncPlayOrder = (tracks: readonly TrackFields[], playNext: string[] = []) => {
    const keys = tracks.map((song) => getTrackKey(song));
    if (
      playNext.length ||
      keys.length !== this.queueKeys.length ||
      keys.some((key, index) => key !== this.queueKeys[index])
    ) {
      const randomArray = reconcilePlayOrder(
        this.queueKeys,
        keys,
        this.state.randomArray,
        getTrackKey(this.activeQueue.songItem, this.activeQueue.api),
        playNext,
      );
      this.setState({
        randomArray,
      });
      this.queueKeys = keys;
    }
  };
  insertIntoQueue = ({data, type, api}: InsertCommand) => {
    const songs = type === 'array' ? data : [data];
    if (!songs.length) return;
    if (!this.props.tracks.length) {
      this.handlePlayCommand({
        song: songs[0],
        data: songs,
        index: 0,
        api,
      });
      return;
    }
    this.props.setPlayerData(
      (current) => {
        const next = isActiveQueue(current)
          ? insertNext(current, songs, api)
          : selectQueue(
              current,
              {
                song: songs[0],
                data: songs,
                index: 0,
                api,
              },
              this.state.playMode,
            );
        return {
          tracks: next.tracks,
          playingIndex: next.playingIndex,
        };
      },
      (selected) =>
        this.syncPlayOrder(
          selected.tracks,
          songs.map((song) => getTrackKey(song, api)),
        ),
    );
  };
  removeTrack = ({item}: {item: TrackFields}) => {
    this.props.setPlayerData(
      (current) => {
        if (!isActiveQueue(current)) return {};
        const next = removeFromQueue(current, item);
        return {
          tracks: next.tracks,
          playingIndex: next.playingIndex,
        };
      },
      (selected) => this.syncPlayOrder(selected.tracks),
    );
  };
  switchSong = () => {
    this.lyricRequest++;
    this.audio?.release();
    this.audio = null;
    if (this.currentTimeTimer) timer.clearTimeout(this.currentTimeTimer);
    this.props.setLyric(null, false);
    this.setState({
      playState: 'paused',
      duration: 0,
      currentTime: 0,
      loaded: false,
      currentMiniLyric: '',
    });
  };
  clearPlayingList = () => {
    this.playbackRequest++;
    this.switchSong();
    this.queueKeys = [];
    this.setState({
      url: '',
      expanded: false,
      playerStyle: null,
      imgStyle: null,
      showLyric: false,
      showSlider: false,
      randomArray: [],
    });
    this.props.setPlayerData({
      tracks: [],
      songItem: null,
      songItemInfo: {
        singer: null,
        song: null,
      },
      playingIndex: null,
      api: null,
    });
    wakeLock.deactivate();
  };
  loadPlayerResource = (selected: QueueSnapshot, pid: TrackId | undefined, request: number) => {
    if (!isActiveQueue(selected)) return;
    const {songItem: song, api} = selected;
    const info = extractFullInfo(song, this.state.expanded ? 'big' : 'small');
    musicHistory(song, api);
    this.setState(
      {
        url: info.img,
        playingSongUID: info.uid,
        pid,
        isFM: Boolean(song.isFM),
      },
      () => {
        if (request !== this.playbackRequest) return;
        AudioPlayer.setNowPlaying({
          title: info.song,
          artwork: api === providers.local ? null : info.img,
          album: info.album,
          artist: parseArtist(info.singer),
        });
        this.prepareMusic(
          {
            song,
          },
          info,
          api,
          request,
        );
      },
    );
    this.loadLikelist(song, api, request);
    this.getLyric(api, info, song);
  };
  prepareMusic = async (
    command: {
      song: TrackFields;
    },
    info: ReturnType<typeof extractFullInfo>,
    api: Provider,
    request = this.playbackRequest,
  ) => {
    try {
      let source;
      const local = command.song.localPath;
      if (local?.length && (await isUsableFile(local))) source = local;
      else if (api === providers.local) {
        source = command.song.path;
        this.setLocalArtWork(info.localAlbumId, command.song, request);
      } else source = await this.cachedGetWebMusicUrl(command, api);
      if (request !== this.playbackRequest) return;
      if (typeof source !== 'string' || !source) throw new Error('未取得可播放地址');
      this.preparePlay(source, request);
    } catch (error) {
      if (request !== this.playbackRequest) return;
      this.pauseSound();
      toast('音源加载失败：' + errorMessage(error));
    }
  };
  preparePlay = (source: string, request = this.playbackRequest) => {
    this.audio = new AudioPlayer(source, (error) => {
      if (request !== this.playbackRequest) return;
      if (error) return this.errorWhenPlay(error);
      this.setState(
        {
          duration: this.audio!.getDuration(),
          loaded: true,
          retriedTimes: 0,
        },
        () => {
          if (request !== this.playbackRequest) return;
          if (
            this.restoreRequest === request &&
            this.activeQueue.settings.autoLoadLastPlayedTracks
          ) {
            this.setState({
              lastPlayedTracksLoaded: true,
            });
            this.seekToLastPlayedTime(request);
          } else {
            if (this.activeQueue.settings.autoLoadLastPlayedTracks)
              lastTime.save(0).catch((error) => toast('保存进度失败：' + error.message));
            this.playSound();
          }
        },
      );
    });
    lastSong
      .save(this.activeQueue.api, this.activeQueue.songItem)
      .catch((error) => toast('保存播放记录失败：' + error.message));
    this.saveLastPlayedTracks();
  };
  errorWhenPlay = (error: PlayerError) => {
    toast('播放失败：' + (error.message || error.type));
    const retries = this.state.retriedTimes;
    if (this.activeQueue.settings.autoErrorNext || retries >= 5) {
      this.setState({
        retriedTimes: 0,
      });
      this.changeSong('next');
    } else {
      this.setState({
        retriedTimes: retries + 1,
      });
      const {tracks, playingIndex: index, api} = this.activeQueue;
      this.handlePlayCommand({
        song: tracks[index],
        data: tracks,
        index,
        api,
      });
    }
  };
  saveLastPlayedTracks = () => {
    if (!this.activeQueue.settings.autoLoadLastPlayedTracks) return;
    const {tracks, playingIndex: index, api} = this.activeQueue;
    return lastQueue
      .save({
        tracks,
        index,
        api,
      })
      .catch((error) => toast('保存队列失败：' + error.message));
  };
  playSound = () => {
    const request = this.playbackRequest;
    this.audio?.play((finished) => {
      if (request !== this.playbackRequest) return;
      if (finished) this.finishPlay();
      else toast('音频播放中断');
    });
  };
  pauseSound = () => this.audio?.pause();
  setVolume = (volume: number) => this.audio?.setVolume(volume);
  seekTo = (seconds: number, play = true) => {
    this.audio?.setCurrentTime(seconds, play);
    if (play) this.playSound();
  };
  togglePlay = () => (this.state.playState === 'playing' ? this.pauseSound() : this.playSound());
  seekToLastPlayedTime = async (request: number) => {
    try {
      const seconds = await lastTime.get();
      if (request !== this.playbackRequest) return;
      this.seekTo(seconds, false);
    } catch (error) {
      if (request === this.playbackRequest) toast('恢复进度失败：' + errorMessage(error));
    }
  };
  exit = async () => {
    try {
      if (this.props.settings.autoLoadLastPlayedTracks) {
        const seconds = this.audio?.isLoaded()
          ? await new Promise<number>((resolve) => this.audio!.getCurrentTime(resolve))
          : this.state.currentTime;
        await lastTime.save(seconds);
      }
      shutdown.fire();
    } catch (error) {
      toast('保存进度失败：' + errorMessage(error));
    }
  };
  changeSong = (type: 'pre' | 'next') => {
    const {tracks, playingIndex, api} = this.activeQueue;
    if (!tracks.length) return;
    if (type === 'next' && this.state.isFM && playingIndex === tracks.length - 1)
      return this.startFM();
    const index =
      this.state.playMode === 'random'
        ? getRandomIndex({
            type,
            playingIndex,
            randomArray: this.state.randomArray,
          })
        : getNextPlayIndex({
            type,
            playingIndex,
            tracks,
          });
    this.handlePlayCommand({
      song: tracks[index],
      data: tracks,
      index,
      api,
      pid: this.state.pid,
    });
  };
  finishPlay = () => {
    const finishedSong = this.activeQueue.songItem;
    if (this.state.playMode === 'circulate') this.seekTo(0);
    else this.changeSong('next');
    this.recordPlayed(finishedSong);
  };
  recordPlayed = async (song: TrackFields) => {
    if (song.api !== providers.netEase || !this.props.settings.recordPlayCount) return;
    try {
      const response = await Netease.play_count(
        song.id!,
        (typeof song.album === 'object' ? song.album?.id : undefined) ||
          (!Array.isArray(song.al) ? song.al?.id : undefined),
        Math.floor(song.dt! / 1000),
      );
      if (response?.code !== 200) throw new Error('播放记录响应无效');
    } catch (error) {
      toast('记录播放次数失败：' + errorMessage(error));
    }
  };
  intervalCurrentTimeGetter = () => {
    if (this.currentTimeTimer) timer.clearTimeout(this.currentTimeTimer);
    this.currentTimeTimer = null;
    if (this.state.isBackground || this.state.playState !== 'playing' || !this.audio) return;
    this.getMusicTimeInfo('currentTime');
    this.currentTimeTimer = timer.setTimeout(this.intervalCurrentTimeGetter, PROGRESS_INTERVAL);
    if (!this.state.expanded && !this.props.settings.hideMiniLyric) this.getCurrentMiniLyric();
  };
  getMusicTimeInfo = (type: 'duration' | 'currentTime') => {
    const request = this.playbackRequest;
    if (type === 'duration' && this.audio)
      this.setState({
        duration: this.audio.getDuration(),
      });
    else if (type === 'currentTime')
      this.audio?.getCurrentTime((currentTime) => {
        if (request === this.playbackRequest)
          this.setState({
            currentTime,
          });
      });
  };
  handleAppStateChange = (state: AppStateStatus) => {
    if (state !== 'background' && state !== 'active') return;
    const isBackground = state === 'background';
    this.setState(
      {
        isBackground,
      },
      this.intervalCurrentTimeGetter,
    );
    if (isBackground && this.props.settings.autoLoadLastPlayedTracks) {
      lastTime
        .save(this.state.currentTime)
        .catch((error) => toast('保存进度失败：' + error.message));
    }
  };
  handleAudioFocus = ({type}: {type: string}) => {
    if (type === 'HeadSetReceiver') return this.pauseSound();
    if (this.props.settings.playWithOthers) return;
    if (type === 'AUDIOFOCUS_LOSS_TRANSIENT') {
      this.resumeAfterFocus = this.state.playState === 'playing';
      this.pauseSound();
    } else if (type === 'AUDIOFOCUS_LOSS') {
      this.resumeAfterFocus = false;
      this.pauseSound();
    } else if (type === 'AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK') this.setVolume(0.4);
    else if (type === 'AUDIOFOCUS_GAIN') {
      if (this.resumeAfterFocus) this.playSound();
      this.resumeAfterFocus = false;
      this.setVolume(this.state.volume);
    }
    this.audioFocusType = type;
  };
  setCloseTimer = (minutes: number) => {
    if (this.closeTimer) timer.clearTimeout(this.closeTimer);
    this.closeTimer = null;
    if (minutes < 1) return toast(locales.COUNTDOWN_CANCELED);
    if (!this.state.url) return toast(locales.NOT_PLAYED);
    const hours = Math.floor(minutes / 60);
    toast((hours ? hours + '小时' : '') + (minutes % 60) + '分钟后停止');
    this.closeTimer = timer.setTimeout(() => {
      this.closeTimer = null;
      if (this.state.isBackground) this.exit();
      else this.pauseSound();
      toast(locales.PLAY_STOPPED);
    }, minutes * 60000);
  };
  getLyric = async (
    api: Provider,
    info: ReturnType<typeof extractFullInfo>,
    songItem: TrackFields,
  ) => {
    const request = ++this.lyricRequest;
    try {
      const result = await lyrics.getLyric({
        api,
        obj: info,
        songItem,
      });
      if (request === this.lyricRequest) this.props.setLyric(result.lyric, result.hasTrans);
    } catch (error) {
      if (request !== this.lyricRequest || hasErrorCode(error, 'ERR_CANCELED')) return;
      this.props.setLyric(null, false);
      toast('歌词加载失败：' + errorMessage(error));
    }
  };
  loadLikelist = async (song: TrackFields, api: Provider, request: number) => {
    try {
      const likes = await storage.load<Partial<Record<Provider, TrackId[]>>>({
        key: keys.likelist,
      });
      if (request === this.playbackRequest)
        this.setState({
          isLike: (likes[api] || []).includes(
            (api === providers.qqMusic ? song.mid || song.songmid : song.id)!,
          ),
        });
    } catch (error) {
      if (request !== this.playbackRequest) return;
      if (!(error instanceof Error && error.name === 'NotFoundError'))
        toast('读取收藏失败：' + errorMessage(error));
      this.setState({
        isLike: false,
      });
    }
  };
  setLocalArtWork = async (albumId: TrackId | undefined, song: TrackFields, request: number) => {
    if (albumId == null) return;
    try {
      const image = await mediaStore.getArtWork(albumId);
      if (request !== this.playbackRequest) return;
      if (image) {
        const info = extractFullInfo({
          ...song,
          img: image,
        });
        this.setState({
          url: info.img,
        });
        AudioPlayer.updatePlayback({
          title: info.song,
          artwork: info.img,
          artist: parseArtist(info.singer),
        });
      }
    } catch (error) {
      if (request === this.playbackRequest) toast('本地封面加载失败：' + errorMessage(error));
    }
  };
  getLyricIndex = (lines: readonly LyricRow[] | null, seconds: number) => {
    if (!lines?.length) return null;
    if (lines[0].total != null && seconds < lines[0].total) return 0;
    let selected: number | null = null;
    for (let index = 0; index < lines.length; index++) {
      const total = lines[index].total;
      if (total != null && Number.isFinite(total) && seconds + 0.3 >= total) selected = index;
    }
    return selected;
  };
  getCurrentMiniLyric = () => {
    const lines = this.props.lyric;
    const index = this.getLyricIndex(lines, this.state.currentTime + 0.2);
    const line = index == null ? undefined : lines?.[index];
    if (!line || /词|曲|音|：|:/.test(line.txt)) return;
    const currentMiniLyric =
      !this.props.settings.hideMiniLyricTrans && line.trans
        ? line.trans.txt + ' / ' + line.txt
        : line.txt;
    this.setState({
      currentMiniLyric,
    });
  };
  onLike = async () => {
    const {songItem, api} = this.activeQueue;
    try {
      await playModeActions.onLike(songItem, api, this.state.isLike);
      this.loadLikelist(songItem, api, this.playbackRequest);
    } catch (error) {
      toast('更新收藏失败：' + errorMessage(error));
    }
  };
  onCollect = () =>
    collectTracks({
      api: this.activeQueue.api,
      song: this.activeQueue.songItem,
    });
  onDetail = () =>
    showTrackDetails({
      api: this.activeQueue.api,
      song: this.activeQueue.songItem,
      index: this.activeQueue.playingIndex,
    });
  onChangePlaylist = () => choosePlaylist();
  onNowPlaying = () => this.props.setDisplayNowPlaying(true);
  onTimer = () => stopTimer.open();
  onCheck = () => {
    if (this.activeQueue.api === providers.netEase)
      return this.recordPlayed(this.activeQueue.songItem);
    toast(locales.PLAY_COUNT_ONLY_SUPPORT_NETEASE);
  };
  onComment = () => {
    if (this.activeQueue.api === providers.local) return toast(locales.COMMENT_LOCAL_CAN_NOT);
    universalNavigator.navigate('CommentPage', {
      api: this.activeQueue.api,
      song: this.activeQueue.songItem,
    });
    this.presentation.close();
  };
  onFmMode = () => {
    if (this.state.isFM) this.stopFM();
    else {
      const {tracks, playingIndex, songItem, api} = this.props;
      this.savedFMQueue = {
        tracks,
        playingIndex,
        songItem,
        api,
      };
      this.startFM();
    }
  };
  startFM = async () => {
    const request = this.playbackRequest;
    try {
      const response = await Netease.personal_fm();
      if (request !== this.playbackRequest) return;
      if (response?.code === 405) {
        toast(locales.NETEASE_NOT_LOGIN);
        universalNavigator.navigate('NeteaseLogin');
        return;
      }
      if (!Array.isArray(response?.data) || !response.data.length)
        throw new Error('私人电台未返回歌曲');
      const tracks = response.data.map((song) => ({
        ...song,
        isFM: true,
      }));
      this.handlePlayCommand({
        song: tracks[0],
        data: tracks,
        index: 0,
        api: providers.netEase,
      });
    } catch (error) {
      if (request === this.playbackRequest) toast('私人电台加载失败：' + errorMessage(error));
    }
  };
  stopFM = () => {
    const saved = this.savedFMQueue;
    this.savedFMQueue = null;
    if (saved?.songItem && saved.api != null && saved.playingIndex != null)
      this.handlePlayCommand({
        song: saved.songItem,
        data: saved.tracks,
        index: saved.playingIndex,
        api: saved.api,
      });
    else this.clearPlayingList();
  };
  onChangePlayStatus = () => {
    const playMode = (
      {
        circulate: 'list',
        list: 'random',
        random: 'circulate',
      } as const
    )[this.state.playMode];
    this.setState({
      playMode,
      randomArray:
        playMode === 'random' ? createPlayOrder(this.props.tracks.length) : this.state.randomArray,
    } as const);
    lyricPreferences.save(keys.lastPlayMode, playMode);
  };
}
