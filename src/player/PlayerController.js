const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _assertThisInitialized = require("@babel/runtime/helpers/assertThisInitialized");
const _appStorage = require("./../storage/index.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = require("react"),
  ReactNative = require("react-native"),
  providers = _interopRequireDefault(require("../services/providers")),
  constants = require("../theme/constants"),
  names = _interopRequireDefault(require("../events/names")),
  keys = _interopRequireDefault(require("../storage/keys")),
  locales = _interopRequireDefault(require("../locales/index")),
  services = require("../services/index"),
  events = require("../events/index"),
  utils = require("../utils/index"),
  types = _interopRequireWildcard(require("../utils/types")),
  trackInfo = require("../services/trackInfo"),
  audioPlayer = _interopRequireDefault(require("../native/audioPlayer")),
  timer = _interopRequireDefault(require("../native/timer")),
  mediaStore = _interopRequireDefault(require("../native/mediaStore")),
  shutdown = _interopRequireDefault(require("../native/shutdown")),
  wakeLock = _interopRequireDefault(require("../native/wakeLock")),
  files = require("../storage/files"),
  lastSong = _interopRequireDefault(require("../storage/lastSong")),
  lastTime = _interopRequireDefault(require("../storage/lastTime")),
  lastQueue = _interopRequireDefault(require("../storage/lastQueue")),
  history = require("../storage/history"),
  cache = _interopRequireDefault(require("./cache")),
  lyricPreferences = _interopRequireDefault(require("./lyricPreferences")),
  queue = _interopRequireDefault(require("./queue")),
  playModeModule = _interopRequireDefault(require("./playMode")),
  lyrics = _interopRequireDefault(require("./lyrics")),
  trackUrl = _interopRequireDefault(require("./trackUrl")),
  notification = _interopRequireDefault(require("./notification")),
  queueActions = _interopRequireDefault(require("./queueActions")),
  gestures = _interopRequireDefault(require("./gestures")),
  playOrder = require("./playOrder"),
  F = null,
  H = 600,
  U = class a extends React.PureComponent {
    lyricRequest = 0;
    constructor() {
      var e, t, n;
      for (var r = arguments.length, i = new Array(r), M = 0; M < r; M++) i[M] = arguments[M];
      return t = n = super(...i), n.ANIMATION_CONFIG = ReactNative.LayoutAnimation.create(400, ReactNative.LayoutAnimation.Types.easeOut, ReactNative.LayoutAnimation.Properties.opacity), n.TEMP_DATA = {}, n.animatedOpacity = new ReactNative.Animated.Value(1), n.AUDIO_FOCUS_TYPE = null, n.state = {
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
        pid: void 0,
        playingSongUID: void 0,
        lastPlayedTracksLoaded: false,
        isBackground: false
      }, n.handleAppStateChange = function (e) {
        'background' === e ? (n.backgroundStatusChanged(true), n.setState({
          isBackground: true
        })) : 'active' === e && (n.backgroundStatusChanged(false), n.setState({
          isBackground: false
        }));
      }, n.backgroundStatusChanged = function (e) {
        if (false === e) timer.default.setTimeout(function () {
          n.intervalCurrentTimeGetter();
        }, H);else {
          var t,
            a = n.state.currentTime;
          (null === (t = n.props.settings) || void 0 === t ? void 0 : t.autoLoadLastPlayedTracks) && lastTime.default.save(a);
        }
      }, n.preparePlay = function (url) {
        if (!types.isString(url)) {
          n.errorWhenPlay();
          return;
        }
        n.initialPlay(url);
        lastSong.default.save(n.props.api, n.props.songItem).catch(error => toast('保存播放记录失败：' + error.message));
        n.saveLastPlayedTracks();
      }, n.saveLastPlayedTracks = function () {
        if (n.props.settings?.autoLoadLastPlayedTracks) {
          const {
            api,
            tracks,
            playingIndex
          } = n.props;
          return lastQueue.default.save({
            tracks,
            index: playingIndex,
            api
          }).catch(error => toast('保存队列失败：' + error.message));
        }
      }, n.recordPlayed = async function (song) {
        if (n.props.api !== providers.default.netEase || !n.props.settings.recordPlayCount) return;
        const result = await services.Netease.play_count(song.id, song.album?.id || song.al?.id, Math.floor(song.dt / 1000));
        if (result?.code !== 200) toast(locales.default.ERROR);
      }, n.errorWhenPlay = function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
          t = n.state.retriedTimes;
        if ((true === n.props.settings.autoErrorNext || t >= 5) && !e) {
          n.changeSong('next');
          return void n.setState({
            retriedTimes: 0
          });
        }
        var a = n.props,
          r = a.tracks,
          i = a.playingIndex,
          s = a.api,
          o = r[i];
        n.musicPlayerEmitter({
          song: o,
          data: r,
          index: i,
          api: s
        });
        n.setState({
          retriedTimes: t + 1
        });
      }, n.initialPlay = function (e) {
        try {
          F = new audioPlayer.default(e, function (e) {
            e ? n.errorWhenPlay(4 === e.type) : n.playSound(true);
          });
        } catch (e) {
          return null;
        }
      }, n.playSound = function () {
        var e,
          t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
        null === (e = F) || void 0 === e || e.play(function (e) {
          e && n.finishPlay();
        });
        n.updatePlayType('PLAYING');
        t && n.lastPlayedTracksCheck();
      }, n.lastPlayedTracksCheck = function () {
        var e;
        !n.state.lastPlayedTracksLoaded && (null === (e = n.props.settings) || void 0 === e ? void 0 : e.autoLoadLastPlayedTracks) ? (n.seekToLastPlayedTime(), n.setState({
          lastPlayedTracksLoaded: true
        })) : n.playSound();
      }, n.seekToLastPlayedTime = async function () {
        try {
          const seconds = await lastTime.default.get();
          n.seekTo(seconds, false);
          n.pauseSound();
          await lastTime.default.save(0);
        } catch (error) {
          n.pauseSound();
          toast('恢复进度失败：' + error.message);
        }
      }, n.onlyPause = function () {
        try {
          var e;
          null === (e = F) || void 0 === e || e.pause();
        } catch (e) {
          return null;
        }
      }, n.pauseSound = function () {
        n.onlyPause();
        'paused' !== n.state.playState && n.updatePlayType('PAUSED');
      }, n.switchSong = function () {
        n.onlyPause();
        n.setLyric(null, false);
        n.setState({
          duration: 0,
          currentTime: 0,
          loaded: false,
          currentMiniLyric: ''
        });
      }, n.exit = async function () {
        try {
          if (n.props.settings?.autoLoadLastPlayedTracks) {
            const seconds = F?.isLoaded() ? await new Promise(resolve => F.getCurrentTime(resolve)) : n.state.currentTime;
            await lastTime.default.save(seconds);
          }
          shutdown.default.fire();
        } catch (error) {
          toast('保存进度失败：' + error.message);
        }
      }, n.setVolume = function (e) {
        var t;
        null === (t = F) || void 0 === t || t.setVolume(e);
      }, n.seekTo = function (e) {
        var t,
          a = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
        null === (t = F) || void 0 === t || t.setCurrentTime(e, a);
        a && n.playSound();
      }, n.onBackPress = function () {
        return true === n.state.showLyric ? (n.onTap(), true) : true === n.state.expanded && (n._playerClose(), true);
      }, n.musicControlLoad = function () {
        var e = n.props.api,
          t = n.props.songItem,
          a = (0, trackInfo.extractFullInfo)(t, 'big');
        if (a.song && null != a.img) {
          var r = 'local' === e ? null : a.img;
          audioPlayer.default.setNowPlaying({
            title: a.song,
            artwork: r,
            album: a.album,
            artist: (0, utils.parseArtist)(a.singer)
          });
        }
      }, n.musicPlayerEmitter = function (e) {
        if (e) {
          if ('clearPlayingList' === e.type) return void n.clearPlayingList();
          if (n.switchSong(), !types.isObject(e.song) || !types.isArray(e.data)) return void n.setState({
            url: null
          });
          var t = new queue.default(n.props, n.state.playMode),
            a = t.api(e),
            r = t.index(e),
            i = t.songItem(e, e.data),
            s = t.data(e, e.data, i),
            o = (0, trackInfo.extractFullInfo)(i, true === n.state.expanded ? 'big' : 'small');
          'random' === n.state.playMode && s.length !== n.props.tracks.length && (0, playOrder.getRandomArray)(_assertThisInitialized(_assertThisInitialized(n)), s.length);
          n.loadPlayerResource({
            api: a,
            obj: o,
            songItem: i,
            index: r,
            data: s,
            pid: e.pid
          });
        }
      }, n.clearPlayingList = function () {
        n.setState({
          url: '',
          expanded: false,
          duration: 0,
          currentTime: 0,
          loaded: false,
          currentMiniLyric: '',
          playerStyle: null,
          imgStyle: null,
          expanded: false,
          showLyric: false,
          showSlider: false
        });
        n.setLyric(null, false);
        n.props.setPlayerData({
          tracks: [],
          songItem: null,
          songItemInfo: {
            singer: null,
            song: null
          },
          playingIndex: null,
          api: null
        });
        n.pauseSound();
      }, n.saveDataBeforeIsFM = function (e) {
        true !== e || n.TEMP_DATA.tracks ? e || (n.TEMP_DATA = {}) : n.TEMP_DATA = {
          tracks: n.props.tracks,
          playingIndex: n.props.playingIndex,
          songItem: n.props.songItem
        };
      }, n.loadPlayerResource = function (e) {
        var t = e.api,
          a = e.obj,
          r = e.songItem,
          i = e.index,
          s = e.data,
          o = e.pid;
        (0, history.musicHistory)(r, t);
        n.props.setPlayerData({
          tracks: s,
          songItem: r,
          songItemInfo: {
            song: a.song,
            singer: a.singer,
            uid: a.uid
          },
          playingIndex: i,
          api: t
        });
        n.setLyric(null, false);
        n.setState({
          url: a.img,
          playingSongUID: a.uid,
          pid: o,
          isFM: Boolean(r.isFM)
        }, function () {
          n.musicControlLoad();
          n.prepareMusic({
            data: s,
            song: r,
            index: i
          }, a, t);
        });
        n.loadLikelist(r, t);
        n.getLyric(t, a, r);
      }, n.getLyric = async function (api, obj, songItem) {
        const request = ++n.lyricRequest;
        try {
          const result = await lyrics.default.getLyric({
            api,
            obj,
            songItem
          });
          if (request === n.lyricRequest) n.setLyric(result.lyric, result.hasTrans);
        } catch (error) {
          if (request !== n.lyricRequest || error.code === 'ERR_CANCELED') return;
          n.setLyric(null, false);
          toast('歌词加载失败：' + error.message);
        }
      }, n.setLyric = function (e, t) {
        n.props.setLyric(e, t);
      }, n._volumeOnPanResponderRelease = function (e, t) {
        var a = t.dy;
        Math.abs(a) > 20 && audioPlayer.default.showSystemStreamVolumeUI();
      }, n._sliderOnPanResponderMove = function (e, t) {
        var a = n.state,
          r = a.currentTime,
          i = a.duration;
        if (!(t.x0 < 15 || t.x0 > constants.DEVICE_WIDTH - 15)) {
          var s = t.moveY - n.y0,
            o = gestures.default.stepMap(s),
            u = Math.floor(o / 200 * i);
          n.y0 = t.moveY;
          var d = r + u;
          d = (d = d >= i ? i : d) <= 0 ? 0 : d;
          n.onSliderValueChange(d);
        }
      }, n._sliderOnPanResponderRelease = function (e, t) {
        var a = n.state.currentTime;
        gestures.default.isOverEdge({
          gestureState: t,
          DEVICE_WIDTH: constants.DEVICE_WIDTH
        }) ? n.fallBackPlayType && n.setState({
          playState: n.fallBackPlayType
        }, function () {
          n.getMusicTimeInfo('currentTime');
          n.intervalCurrentTimeGetter();
        }) : n.slidingEnd(a);
        n.y0 = null;
        n.sliding = null;
        n.fallBackPlayType = null;
      }, n.loadLikelist = function (e, t) {
        e && _appStorage.storage.load({
          key: keys.default.likelist
        }).then(function (a) {
          var r,
            i = false,
            s = a.netEase;
          switch (t) {
            case providers.default.netEase:
              r = e.id;
              s.filter(function (e) {
                e === r && (i = true);
              });
              break;
            case providers.default.qqMusic:
              r = e.mid || e.songmid;
              a.qqMusic.filter(function (e) {
                e === r && (i = true);
              });
          }
          n.setState({
            isLike: i
          });
        }).catch(function () {
          n.setState({
            isLike: false
          });
        });
      }, n.matchLocalImg = async function (song) {
        const keywords = song.title + ' ' + song.singer;
        const response = await services.Netease.search({
          keywords
        });
        if (!types.isObject(response)) return;
        let match = response.result?.songs?.[0];
        if (!response.result?.songs) {
          const songs = await services.QQMusic.searchSong(keywords);
          match = songs?.find(item => item.interval === Math.floor(song.duration / 1000));
        }
        if (!match) return;
        const info = trackInfo.extractFullInfo(match);
        n.setState({
          url: info.img
        });
        audioPlayer.default.updatePlayback({
          title: info.song,
          artwork: info.img,
          artist: utils.parseArtist(info.singer)
        });
      }, n.prepareMusic = async function (request, info, api) {
        const uid = n.state.playingSongUID;
        try {
          const local = request.song.localPath;
          if (local?.length && (await files.isUsableFile(local))) {
            n.preparePlay(local);
            return;
          }
          if (api === 'local') {
            n.setLocalArtWork(info.localAlbumId, request.song);
            n.preparePlay(request.song.path);
            return;
          }
          const url = await n.cachedGetWebMusicUrl(request, api);
          if (uid !== n.props.songItemInfo.uid) return;
          if (!url) throw new Error('未取得可播放地址');
          n.preparePlay(url);
        } catch (error) {
          if (uid !== n.props.songItemInfo.uid) return;
          n.pauseSound();
          toast('音源加载失败：' + error.message);
        }
      }, n.getWebMusicUrl = async function (request, api) {
        return trackUrl.default.getUrl(api, request, n.props.settings.defaultHighQuality);
      }, n.setLocalArtWork = function (e, t) {
        e && mediaStore.default.getArtWork(e).then(function (e) {
          if (e) {
            var a = t;
            a.img = e;
            var r = (0, trackInfo.extractFullInfo)(a);
            r.img ? (n.setState({
              url: r.img
            }), audioPlayer.default.updatePlayback({
              title: r.song,
              artwork: e,
              base64: false,
              artist: (0, utils.parseArtist)(r.singer)
            })) : n.matchLocalImg(t);
          }
        });
      }, n.updatePlayType = function (e) {
        switch (e) {
          case 'PLAYING':
            n.setState({
              playState: 'playing'
            }, function () {
              n.intervalCurrentTimeGetter();
            });
            n.getMusicTimeInfo('duration');
            false === n.state.loaded && (false === n.state.isBackground && ReactNative.LayoutAnimation.linear(), n.setState({
              loaded: true
            }));
            break;
          case 'PAUSED':
            n.setState({
              playState: 'paused'
            });
            break;
          case 'FINISHED':
            n.finishPlay();
        }
      }, n.finishPlay = function () {
        switch (n.state.playMode) {
          case 'circulate':
            n.seekTo(0);
            break;
          case 'list':
            n.changeSong('next');
            break;
          case 'random':
            n.changeSong('random');
        }
        n.recordPlayed(n.props.songItem);
      }, n.intervalCurrentTimeGetter = function () {
        if (n.currentTimeTimer) {
          timer.default.clearTimeout(n.currentTimeTimer);
          n.currentTimeTimer = null;
        }
        const {
          playState,
          expanded,
          isBackground
        } = n.state;
        if (!isBackground && playState === 'playing' && F) {
          n.getMusicTimeInfo('currentTime');
          n.currentTimeTimer = timer.default.setTimeout(n.intervalCurrentTimeGetter, H);
          if (!expanded && !n.props.settings.hideMiniLyric) n.getCurrentMiniLyric();
        }
      }, n.getMusicTimeInfo = function (type) {
        if (type === 'currentTime') F?.getCurrentTime(seconds => n.setState({
          currentTime: seconds
        }));else if (type === 'duration' && F) n.setState({
          duration: F.getDuration()
        });
      }, n.getLyricIndex = function (e, t) {
        if (e && !(e.length < 1)) {
          if (t < e[0].total) return 0;
          var a = null,
            n = t + .3;
          try {
            var r = e.length,
              i = e[r - 1].total > 0 ? r - 1 : r - 2;
            e.map(function (t, i) {
              var s,
                o = i + 1 >= r ? i : i + 1;
              n >= t.total && (null === (s = e[o]) || void 0 === s ? void 0 : s.total) > n && (a = i);
            });
            n >= e[i].total && (a = i);
          } catch (e) {
            return null;
          }
          return a;
        }
      }, n.getCurrentMiniLyric = function () {
        var e = n.props,
          t = e.lyric,
          a = e.settings.hideMiniLyricTrans;
        if (t) {
          var r = n.state.currentTime,
            i = n.getLyricIndex(t, r + .2);
          if (t[i]) {
            if (t[i].txt.match(/\u8bcd|\u66f2|\u97f3|\uff1a|:/g)) return;
            var s = t[i].txt;
            !a && t[i].trans && (s = t[i].trans.txt + ' / ' + s);
            n.setState({
              currentMiniLyric: s
            });
          }
        }
      }, n.togglePlay = function () {
        switch (n.state.playState) {
          case 'paused':
            n.playSound();
            break;
          case 'playing':
            n.pauseSound();
        }
      }, n.changeSong = function (e) {
        var t = n.props,
          a = t.tracks,
          r = t.api,
          i = t.playingIndex;
        if (a) {
          var s = n.state,
            o = s.isFM,
            l = s.playMode,
            u = s.randomArray;
          if ('next' === e && o && i === a.length - 1) n.startFM();else {
            var d = 'random' === l ? (0, playOrder.getRandomIndex)({
              type: e,
              playingIndex: i,
              randomArray: u
            }) : (0, playOrder.getNextPlayIndex)({
              type: e,
              tracks: a,
              playingIndex: i
            });
            n.musicPlayerEmitter({
              song: a[d],
              data: a,
              index: d,
              api: r,
              pid: n.state.pid
            });
          }
        }
      }, n.onLike = function () {
        var e = n.props,
          t = e.api,
          a = e.songItem,
          r = n.state.isLike;
        true == !r ? toast(locales.default.MUSIC_LIKE) : toast(locales.default.MUSIC_DIS_LIKE);
        n.setState({
          isLike: !r
        });
        playModeModule.default.onLike(a, t, r);
      }, n.onCollect = function () {
        var e = n.props,
          t = e.api,
          a = e.songItem;
        events.emitter.emit(names.default.CollectModal, {
          api: t,
          song: a
        });
      }, n.onComment = function () {
        var e = n.props,
          t = e.api,
          a = e.songItem;
        'local' !== t ? (utils.universalNavigator.navigate('CommentPage', {
          api: t,
          song: a
        }), n._playerClose()) : toast(locales.default.COMMENT_LOCAL_CAN_NOT);
      }, n.onDetail = function () {
        var e = n.props,
          t = e.api,
          a = e.songItem,
          r = e.playingIndex;
        events.emitter.emit(names.default.DetailModal, {
          song: a,
          index: r,
          api: t
        });
      }, n.onChangePlaylist = function () {
        events.emitter.emit(names.default.ChangePlaylist);
      }, n.showSlider = function () {
        setTimeout(function () {
          n.setState({
            showSlider: true
          });
        }, 300);
      }, n._playerOpen = function () {
        var e = (0, trackInfo.extractFullInfo)(n.props.songItem, 'big');
        events.emitter.emit(names.default.PlayerShow, true);
        n.showSlider();
        ReactNative.LayoutAnimation.configureNext(n.ANIMATION_CONFIG);
        n.setState({
          url: e.img,
          playerStyle: {
            width: constants.DEVICE_WIDTH,
            height: constants.DEVICE_HEIGHT,
            top: 0,
            left: 0,
            position: 'absolute',
            marginBottom: 0
          },
          expanded: true
        });
        wakeLock.default.activate();
      }, n._playerClose = function (e) {
        var t = (0, trackInfo.extractFullInfo)(n.props.songItem, 'small');
        events.emitter.emit(names.default.PlayerShow, false);
        e || ReactNative.LayoutAnimation.configureNext(n.ANIMATION_CONFIG);
        n.setState({
          url: t.img,
          playerStyle: null,
          imgStyle: null,
          expanded: false,
          showLyric: false,
          showSlider: false
        });
        wakeLock.default.deactivate();
      }, n.onFmMode = function () {
        events.emitter.emit(names.default.FM_MODE);
      }, n.startFM = async function () {
        const response = await services.Netease.personal_fm();
        if (!response) return;
        if (response.code === 405) {
          toast(locales.default.NETEASE_NOT_LOGIN);
          utils.universalNavigator.navigate('NeteaseLogin');
          return;
        }
        if (!Array.isArray(response.data) || !response.data.length) return;
        const tracks = response.data.map(song => ({
          ...song,
          isFM: true
        }));
        n.musicPlayerEmitter({
          song: tracks[0],
          data: tracks,
          index: 0,
          api: providers.default.netEase
        });
      }, n.stopFM = function () {
        if (n.TEMP_DATA) {
          var e = n.TEMP_DATA,
            t = e.tracks,
            a = e.songItem,
            r = e.playingIndex;
          types.isObject(a) ? (n.musicPlayerEmitter({
            song: a,
            data: t,
            index: r,
            api: providers.default.netEase
          }), n.TEMP_DATA = {}) : n.clearPlayingList();
        }
      }, n.onTimer = function () {
        utils.stopTimer.open();
      }, n.onCheck = function () {
        if (n.props.api === providers.default.netEase) {
          toast(locales.default.LIFE_PLUS_ONE);
          return n.recordPlayed(n.props.songItem);
        }
        toast(locales.default.PLAY_COUNT_ONLY_SUPPORT_NETEASE);
      }, n.onTap = function () {
        var e = n.state.showLyric;
        n.setState({
          showSlider: false,
          showCoverElevation: false
        });
        ReactNative.Animated.timing(n.animatedOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        }).start(function () {
          n.setState({
            showLyric: !e,
            showSlider: true
          });
          ReactNative.Animated.timing(n.animatedOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true
          }).start(function () {
            n.setState({
              showCoverElevation: true
            });
          });
        });
      }, n.saveShowToolStatus = function () {
        _appStorage.storage.save({
          key: keys.default.showToolBtnStatus,
          data: n.state.showTool
        }).then(function (e) {
          return e;
        });
      }, n.showToolBtn = function () {
        var e = n.state.showTool;
        ReactNative.LayoutAnimation.configureNext(n.ANIMATION_CONFIG);
        n.setState({
          showTool: !e
        }, function () {
          n.saveShowToolStatus();
        });
      }, n.onChangeLyricFontSize = function (e) {
        n.setState({
          lyricFontSize: e
        });
        _appStorage.storage.save({
          key: keys.default.lyricFontSize,
          data: e
        }).then(function (e) {
          return e;
        });
      }, n.onChangeShowTrans = function () {
        var e = !n.state.showTrans;
        n.setState({
          showTrans: e
        });
        _appStorage.storage.save({
          key: keys.default.showTrans,
          data: e
        }).then(function (e) {
          return e;
        });
      }, n.onChangePlayStatus = function () {
        var e;
        switch (n.state.playMode) {
          case 'circulate':
            e = 'list';
            break;
          case 'random':
            e = 'circulate';
            break;
          case 'list':
            e = 'random';
        }
        'random' === e && (0, playOrder.getRandomArray)(_assertThisInitialized(_assertThisInitialized(n)), n.props.tracks.length || 0);
        n.setState({
          playMode: e
        });
        _appStorage.storage.save({
          key: keys.default.lastPlayMode,
          data: e
        }).then(function (e) {
          return e;
        });
      }, n.onNowPlaying = function () {
        n.props.setDisplayNowPlaying(true);
      }, n.slidingStart = function (e) {
        false === n.state.showTool && (n.sliderValue0 = e);
      }, n.onSliderValueChange = function (e) {
        n.updatePlayType('PAUSED');
        n.setState({
          currentTime: e
        });
        n.sliding = true;
      }, n.slidingEnd = function (e) {
        var t;
        true === n.state.showTool ? n.seekTo(e) : Math.abs(e - n.sliderValue0) < 5 ? n.togglePlay() : n.seekTo(e);
        null === (t = n.slidingTimeText) || void 0 === t || t.fadeOut(500);
        setTimeout(function () {
          n.sliding = null;
        }, 500);
      }, t;
    }
    "componentDidMount"() {
      var t = this;
      this.playbackStateListener = ReactNative.DeviceEventEmitter.addListener('rewind.playbackState', event => {
        const playState = event.playing ? 'playing' : 'paused';
        if (playState !== this.state.playState) this.setState({playState}, this.intervalCurrentTimeGetter);
      });
      lyricPreferences.default.loadAll(this);
      notification.default.init(this);
      audioPlayer.default.setHandleAudioFocus(!this.props.settings.playWithOthers);
      this.backSubscription = ReactNative.BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
      this.appStateSubscription = ReactNative.AppState.addEventListener('change', this.handleAppStateChange);
      this._sliderPanResponder = ReactNative.PanResponder.create({
        onStartShouldSetPanResponder: function () {
          return true;
        },
        onMoveShouldSetPanResponder: function () {
          return false;
        },
        onPanResponderGrant: function (e, a) {
          t.y0 = a.moveY;
          t.fallBackPlayType = t.state.playState;
        },
        onPanResponderMove: this._sliderOnPanResponderMove,
        onPanResponderRelease: this._sliderOnPanResponderRelease,
        onPanResponderTerminationRequest: function () {
          return false;
        }
      });
      this._volumePanResponder = ReactNative.PanResponder.create({
        onStartShouldSetPanResponder: function () {
          return true;
        },
        onMoveShouldSetPanResponder: function () {
          return false;
        },
        onPanResponderGrant: function () {
          return null;
        },
        onPanResponderMove: function () {
          return null;
        },
        onPanResponderRelease: this._volumeOnPanResponderRelease,
        onPanResponderTerminationRequest: function () {
          return false;
        }
      });
      events.emitter.on(names.default.Player, this.musicPlayerEmitter);
      this.hidePlayerListener = events.emitter.addListener(names.default.HidePlayer, function (e) {
        var a = (e || {}).hide;
        t.setState({
          hidePlayer: !!a
        });
      });
      this.playerCloseListener = events.emitter.addListener(names.default.PlayerClose, function () {
        true === t.state.expanded && t._playerClose(true);
      });
      this.pushToQueueListener = events.emitter.addListener(names.default.InsertToList, function (e) {
        return (0, queueActions.default)(t, e);
      });
      this.deleteFromQueueListener = events.emitter.addListener(names.default.DeleteFromQueue, function (e) {
        var a = e.item,
          n = t.props.tracks.filter(function (e) {
            return (0, trackInfo.extractFullInfo)(e).song !== (0, trackInfo.extractFullInfo)(a).song;
          }),
          r = n.findIndex(function (e) {
            return (0, trackInfo.extractFullInfo)(e).song === (0, trackInfo.extractFullInfo)(t.props.songItem).song;
          });
        t.props.setPlayerData({
          tracks: n,
          playingIndex: r
        });
      });
      this.fmModeListener = events.emitter.addListener(names.default.FM_MODE, function () {
        var a = t.state.isFM;
        false === a ? (global.toast(locales.default.FM_MODE_ENTER), t.saveDataBeforeIsFM(!a), t.startFM()) : (global.toast(locales.default.FM_MODE_QUIT), t.stopFM());
        t.setState({
          isFM: !a
        });
      });
      this.audioNoisyListener = events.emitter.addListener(names.default.AUDIO_NOISY, function () {
        t.pauseSound();
      });
      this.audioFocusListener = ReactNative.DeviceEventEmitter.addListener(names.default.NATIVE_AUDIO_FOCUS, function (e) {
        var a = true;
        'HeadSetReceiver' === e.type && t.pauseSound();
        true !== t.props.settings.playWithOthers && ('AUDIOFOCUS_LOSS' === e.type && t.pauseSound(), 'AUDIOFOCUS_LOSS_TRANSIENT' === e.type && ('paused' === t.state.playState && (a = false), t.pauseSound()), 'AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK' === e.type && t.setVolume(.4), 'AUDIOFOCUS_GAIN' === e.type && ('AUDIOFOCUS_LOSS_TRANSIENT' === t.AUDIO_FOCUS_TYPE && t.playSound(), t.setVolume(t.state.volume)), true === a && (t.AUDIO_FOCUS_TYPE = e.type));
      });
      this.closeTimerListener = events.emitter.addListener(names.default.CloseTimerEvent, function (e) {
        if (e < 1) {
          t.closeTimer && timer.default.clearTimeout(t.closeTimer);
          return void toast(locales.default.COUNTDOWN_CANCELED);
        }
        if (t.state.url) {
          var a = 60 * e * 1e3,
            n = Math.floor(e / 60),
            r = e - 60 * n;
          toast(n > 0 ? n + "\u5c0f\u65f6" + r + "\u5206\u949f\u540e\u505c\u6b62" : r + "\u5206\u949f\u540e\u505c\u6b62");
          t.closeTimer && timer.default.clearTimeout(t.closeTimer);
          t.closeTimer = timer.default.setTimeout(function () {
            true === t.state.isBackground ? t.exit() : t.pauseSound();
            toast(locales.default.PLAY_STOPPED);
          }, a);
        } else toast(locales.default.NOT_PLAYED);
      });
      this.cachedGetWebMusicUrl = (0, cache.default)(this.getWebMusicUrl);
    }
    componentDidUpdate(previous) {
      if (previous.settings.playWithOthers !== this.props.settings.playWithOthers) {
        audioPlayer.default.setHandleAudioFocus(!this.props.settings.playWithOthers);
      }
    }
    "componentWillUnmount"() {
      this.lyricRequest++;
      this.playbackStateListener.remove();
      if (this.currentTimeTimer) timer.default.clearTimeout(this.currentTimeTimer);
      var e;
      events.emitter.off(names.default.Player, this.musicPlayerEmitter);
      this.playerCloseListener.remove();
      this.pushToQueueListener.remove();
      this.fmModeListener.remove();
      this.audioFocusListener.remove();
      this.audioNoisyListener.remove();
      this.closeTimerListener.remove();
      this.deleteFromQueueListener.remove();
      this.hidePlayerListener.remove();
      this.backSubscription?.remove();
      this.appStateSubscription?.remove();
      null === (e = F) || void 0 === e || e.release();
    }
  };
exports.default = U;
