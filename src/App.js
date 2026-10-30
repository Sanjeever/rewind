const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _objectSpread = require("@babel/runtime/helpers/objectSpread2");
const _appStorage = require("./storage/index.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("./bootstrap/globals");
require("./storage/index");
var immer = require("immer"),
  React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativePopupMenu = require("react-native-popup-menu"),
  modals = require("./modals/index"),
  defaults = require("./settings/defaults"),
  names = _interopRequireDefault(require("./events/names")),
  keys = _interopRequireDefault(require("./storage/keys")),
  player = _interopRequireDefault(require("./player/index")),
  errors = _interopRequireDefault(require("./bootstrap/errors")),
  utils = require("./utils/index"),
  navigationBar = _interopRequireDefault(require("./native/navigationBar")),
  orientation = _interopRequireDefault(require("./native/orientation")),
  permissions = _interopRequireDefault(require("./native/permissions")),
  lastQueue = _interopRequireDefault(require("./storage/lastQueue")),
  update = _interopRequireDefault(require("./services/update")),
  navigation = _interopRequireDefault(require("./navigation/index")),
  events = require("./events/index"),
  k = class t extends React.PureComponent {
    constructor() {
      var e, a, n;
      for (var l = arguments.length, r = new Array(l), o = 0; o < l; o++) r[o] = arguments[o];
      return a = n = super(...r), n.state = {
        displayNowPlaying: false,
        playerInfo: {
          tracks: [],
          songItem: null,
          songItemInfo: {
            singer: null,
            song: null
          },
          playingIndex: null,
          api: null
        },
        lyric: null,
        hasTrans: false,
        checkPermissionDone: false,
        settings: (0, utils.extractKeyValue)(defaults.defaultSettings, 'on'),
        bottomPaddingValue: 0
      }, n.initLoad = function () {
        orientation.default.lockToPortrait();
        navigationBar.default.transparentStatusBar();
        n.loadSettings();
      }, n.setPlayerData = function (e) {
        var t = _objectSpread({}, n.state.playerInfo, e);
        n.setState({
          playerInfo: t
        });
      }, n.loadSettings = async function () {
        let e;
        try {
          e = await _appStorage.storage.load({key: keys.default.settings});
        } catch (error) {
          if (error.name !== 'NotFoundError') throw error;
          e = defaults.defaultSettings;
          await _appStorage.storage.save({key: keys.default.settings, data: e});
        }
          e.autoLoadLastPlayedTracks.on && lastQueue.default.emit();
          n.setState((0, immer.produce)(function (t) {
            t.settings = (0, utils.extractKeyValue)(e, 'on');
            t.bottomPaddingValue = e.bottomPadding.subtitle;
          }));
          events.emitter.emit(names.default.SetHomeState, {
            autoSetPlaylistOrder: e.autoSetPlaylistOrder.on
          });
      }, n.setDisplayNowPlaying = function (e) {
        n.setState({
          displayNowPlaying: e
        });
      }, n.setLyric = function (e, t) {
        n.setState({
          lyric: e,
          hasTrans: t
        });
      }, a;
    }
    "UNSAFE_componentWillMount"() {
      var e = this;
      permissions.default.checkPermission().then(function () {
        e.setState({
          checkPermissionDone: true
        });
        e.initLoad();
        update.default.onlyCheck();
      });
    }
    "componentDidMount"() {
      var e = this;
      this.bottomPaddingValueListener = events.emitter.addListener(names.default.BottomPaddingChange, function (t) {
        e.setState((0, immer.produce)(function (e) {
          e.bottomPaddingValue = t;
        }));
      });
      this.settingsChangedListener = events.emitter.addListener(names.default.SettingsChanged, function () {
        e.loadSettings();
      });
      (0, errors.default)();
    }
    "componentWillUnmount"() {
      this.bottomPaddingValueListener.remove();
      this.settingsChangedListener.remove();
    }
    "render"() {
      var e = this.state,
        t = e.settings,
        a = e.displayNowPlaying,
        n = e.playerInfo,
        l = e.lyric,
        i = e.hasTrans,
        d = e.checkPermissionDone,
        c = e.bottomPaddingValue;
      if (true !== d) return null;
      var f = t.hideStatusBar,
        g = t.cloneThroughLinking,
        y = t.isRound,
        m = t.disabledRouterTransition;
      return React.default.createElement(reactNativePopupMenu.MenuProvider, null, React.default.createElement(ReactNative.View, {
        style: {
          flex: 1
        }
      }, React.default.createElement(ReactNative.StatusBar, {
        backgroundColor: 0,
        translucent: true,
        hidden: f
      }), React.default.createElement(navigation.default, {
        animationEnabled: !m
      }), React.default.createElement(player.default, {
        setDisplayNowPlaying: this.setDisplayNowPlaying,
        setPlayerData: this.setPlayerData,
        tracks: n.tracks,
        songItem: n.songItem,
        songItemInfo: n.songItemInfo,
        playingIndex: n.playingIndex,
        api: n.api,
        lyric: l,
        hasTrans: i,
        setLyric: this.setLyric,
        settings: t,
        bottomPaddingValue: c
      }), React.default.createElement(modals.LongPressModal, null), React.default.createElement(modals.DetailModal, {
        cloneThroughLinking: g,
        isRound: y
      }), React.default.createElement(modals.CollectModal, null), React.default.createElement(modals.NowPlayingModal, {
        api: n.api,
        data: n.tracks,
        songItem: n.songItem,
        index: n.playingIndex,
        setDisplayNowPlaying: this.setDisplayNowPlaying,
        show: a,
        isRound: y
      }), React.default.createElement(modals.SavePicModal, null), React.default.createElement(modals.ChangePlaylistModal, {
        songItem: n.songItem
      })));
    }
  };
exports.default = k;
