import {saveSelection, restoreProgress, recordPlayed} from './playbackHistory';
import PlaybackQueue from './PlaybackQueue';
import PersonalRadio from './PersonalRadio';
import TrackResources from './TrackResources';
import {getMiniLyric} from './lyricPosition';
import PlayerPresentation from './PlayerPresentation';
import {subscribePlaybackEvent} from './commands';
import type {PlayerProps, PlayerState, QueueSnapshot, PlaybackCommand} from './types';
import type {TrackFields, TrackId} from '../services/track';
import type {Provider} from '../services/providers';
import type {PlayerError} from '../native/audioPlayer';
import type {Subscription} from '../events/Emitter';
import type {AppStateStatus} from 'react-native';
import {errorMessage} from '../utils/types';
import {isActiveQueue} from './types';
import {toast} from '../native/toast';
import React from 'react';
import {AppState, BackHandler, DeviceEventEmitter} from 'react-native';
import providers from '../services/providers';
import names from '../events/names';
import locales from '../locales';
import {extractFullInfo} from '../services/trackInfo';
import parseArtist from '../utils/parseArtist';
import AudioPlayer from '../native/audioPlayer';
import timer from '../native/timer';
import shutdown from '../native/shutdown';
import wakeLock from '../native/wakeLock';
import {isUsableFile} from '../storage/files';
import lastTime from '../storage/lastTime';
import {musicHistory} from '../storage/history';
import cache from './cache';
import lyricPreferences from './lyricPreferences';
import {selectQueue} from './queue';
import trackUrl from './trackUrl';
import notification from './notification';
import {createPlayOrder, getNextPlayIndex, getRandomIndex} from './playOrder';
import {subscribePlaybackCommands} from './commands';
const PROGRESS_INTERVAL = 600;
export default class PlayerController extends React.PureComponent<PlayerProps, PlayerState> {
  queue = new PlaybackQueue({
    getQueue: () => this.props,
    getState: () => this.state,
    commit: (update, onCommitted) => this.props.setPlayerData(update, onCommitted),
    setOrder: (randomArray) => this.setState({randomArray}),
    setMode: (playMode, randomArray) => this.setState({playMode, randomArray}),
    play: (command) => this.handlePlayCommand(command),
  });
  radio = new PersonalRadio({
    getQueue: () => this.props,
    getRequest: () => this.playbackRequest,
    isPlayingRadio: () => this.state.isFM,
    play: (command) => this.handlePlayCommand(command),
    clearQueue: () => this.clearPlayingList(),
  });
  resources = new TrackResources({
    isCurrent: (request) => request === this.playbackRequest,
    setLyric: (lyric, hasTrans) => this.props.setLyric(lyric, hasTrans),
    setLiked: (isLike) => this.setState({isLike}),
    setArtwork: (url) => this.setState({url}),
  });
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
      insert: this.queue.insert,
      remove: this.queue.remove,
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
      subscribePlaybackEvent('FM_MODE', this.radio.toggle),
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
    this.resources.cancelLyrics();
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
        this.queue.sync(selected.tracks);
        this.loadPlayerResource(selected, command.pid, request);
      },
    );
  };
  switchSong = () => {
    this.resources.cancelLyrics();
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
    this.queue.reset();
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
    this.resources.loadLikes(song, api, request);
    this.resources.loadLyrics(api, info, song);
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
        this.resources.loadArtwork(info.localAlbumId, command.song, request);
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
            restoreProgress(
              request,
              (current) => current === this.playbackRequest,
              (seconds) => this.seekTo(seconds, false),
            );
          } else {
            if (this.activeQueue.settings.autoLoadLastPlayedTracks)
              lastTime.save(0).catch((error) => toast('保存进度失败：' + error.message));
            this.playSound();
          }
        },
      );
    });
    saveSelection(this.activeQueue, this.props.settings.autoLoadLastPlayedTracks);
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
      return this.radio.load();
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
    recordPlayed(finishedSong, this.props.settings.recordPlayCount);
  };
  intervalCurrentTimeGetter = () => {
    if (this.currentTimeTimer) timer.clearTimeout(this.currentTimeTimer);
    this.currentTimeTimer = null;
    if (this.state.isBackground || this.state.playState !== 'playing' || !this.audio) return;
    this.getMusicTimeInfo('currentTime');
    this.currentTimeTimer = timer.setTimeout(this.intervalCurrentTimeGetter, PROGRESS_INTERVAL);
    if (!this.state.expanded && !this.props.settings.hideMiniLyric) {
      const currentMiniLyric = getMiniLyric(
        this.props.lyric,
        this.state.currentTime,
        !this.props.settings.hideMiniLyricTrans,
      );
      if (currentMiniLyric !== undefined) this.setState({currentMiniLyric});
    }
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
}
