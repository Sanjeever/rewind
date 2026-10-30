Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("./bootstrap/defaultProps");
require("./bootstrap/globals");
require("./storage/index");
require("./bootstrap/collections");
var immer = require("immer"),
  React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativePopupMenu = require("react-native-popup-menu"),
  modals = require("./modals/index"),
  defaults = require("./settings/defaults"),
  names = babelHelpers.interopRequireDefault(require("./events/names")),
  keys = babelHelpers.interopRequireDefault(require("./storage/keys")),
  player = babelHelpers.interopRequireDefault(require("./player/index")),
  errors = babelHelpers.interopRequireDefault(require("./bootstrap/errors")),
  utils = require("./utils/index"),
  navigationBar = babelHelpers.interopRequireDefault(require("./native/navigationBar")),
  orientation = babelHelpers.interopRequireDefault(require("./native/orientation")),
  splash = babelHelpers.interopRequireDefault(require("./native/splash")),
  permissions = babelHelpers.interopRequireDefault(require("./native/permissions")),
  transition = babelHelpers.interopRequireDefault(require("./navigation/transition")),
  lastQueue = babelHelpers.interopRequireDefault(require("./storage/lastQueue")),
  update = babelHelpers.interopRequireDefault(require("./services/update")),
  navigation = babelHelpers.interopRequireDefault(require("./navigation/index")),
  events = require("./events/index"),
  k = function (e) {
    function t() {
      var e, a, n;
      babelHelpers.classCallCheck(this, t);
      for (var l = arguments.length, r = new Array(l), o = 0; o < l; o++) r[o] = arguments[o];
      return babelHelpers.possibleConstructorReturn(n, (a = n = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(r))), n.state = {
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
        var t = babelHelpers.objectSpread({}, n.state.playerInfo, e);
        n.setState({
          playerInfo: t
        });
      }, n.loadSettings = function () {
        storage.load({
          key: keys.default.settings
        }).then(function (e) {
          e.autoLoadLastPlayedTracks.on && lastQueue.default.emit();
          n.setState((0, immer.produce)(function (t) {
            t.settings = (0, utils.extractKeyValue)(e, 'on');
            t.bottomPaddingValue = e.bottomPadding.subtitle;
          }));
          events.emitter.emit(names.default.SetHomeState, {
            autoSetPlaylistOrder: e.autoSetPlaylistOrder.on
          });
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
      }, a));
    }
    babelHelpers.createClass(t, [{
      key: "UNSAFE_componentWillMount",
      value: function () {
        var e = this;
        permissions.default.checkPermission().then(function () {
          e.setState({
            checkPermissionDone: true
          });
          e.initLoad();
          update.default.onlyCheck();
        });
      }
    }, {
      key: "componentDidMount",
      value: function () {
        var e = this;
        splash.default.hide();
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
    }, {
      key: "componentWillUnmount",
      value: function () {
        this.bottomPaddingValueListener.remove();
        this.settingsChangedListener.remove();
      }
    }, {
      key: "render",
      value: function () {
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
          ref: function (e) {
            utils.universalNavigator.setTopLevelNavigator(e);
          },
          transitionConfig: function () {
            return (0, transition.default)(m);
          }
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
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = k;
