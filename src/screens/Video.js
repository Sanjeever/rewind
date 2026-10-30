const _default = require("@react-native-clipboard/clipboard").default;
const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativePopupMenu = require("react-native-popup-menu"),
  components = require("../components/index"),
  VideoPlayer = _interopRequireDefault(require("../player/VideoPlayer")),
  providers = _interopRequireDefault(require("../services/providers")),
  names = _interopRequireDefault(require("../events/names")),
  icons = _interopRequireDefault(require("../theme/icons")),
  locales = _interopRequireDefault(require("../locales/index")),
  services = require("../services/index"),
  events = require("../events/index"),
  intentVideo = _interopRequireDefault(require("../native/intentVideo")),
  orientation = _interopRequireDefault(require("../native/orientation")),
  y = function (e) {
    return e[1080] || e[720] || e[480] || e[240];
  },
  R = class t extends React.Component {
    constructor() {
      var e, n, r;
      for (var a = arguments.length, l = new Array(a), i = 0; i < a; i++) l[i] = arguments[i];
      return n = r = super(...l), r.state = {
        isFullscreen: false,
        hideStatus: false,
        url: void 0,
        title: void 0
      }, r.onBackPress = function () {
        if (r.state.isFullscreen) {
          r.exitFullscreen();
          return true;
        }
      }, r.getMVUrl = async function (id, api) {
        try {
          let url, title;
          if (api === providers.default.netEase) {
            const response = await services.Netease.mv(id);
            if (response?.data) {
              url = y(response.data.brs);
              title = response.data.name + ' - ' + response.data.artistName;
            }
          } else if (api === providers.default.qqMusic) url = await services.QQMusic.getMV(id);
          if (!url) throw new Error(locales.default.MV_PLAYER_ERROR);
          r.setState({
            url,
            title
          });
        } catch (error) {
          toast(error.message);
        }
      }, r.fullscreen = function () {
        orientation.default.lockToLandscape();
        r.setState({
          isFullscreen: true
        });
      }, r.exitFullscreen = function () {
        r.setState({
          isFullscreen: false
        });
        orientation.default.lockToPortrait();
      }, n;
    }
    "componentDidMount"() {
      this.backSubscription = ReactNative.BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
      var e = (this.props.route || {}).params || {},
        t = e.mvid,
        n = e.api;
      this.getMVUrl(t, n);
      events.emitter.emit(names.default.HidePlayer, {
        hide: true
      });
    }
    "componentWillUnmount"() {
      this.exitFullscreen();
      this.backSubscription?.remove();
      events.emitter.emit(names.default.HidePlayer, {
        hide: false
      });
    }
    "render"() {
      var e = this,
        t = this.state,
        n = t.url,
        r = t.title,
        a = t.isFullscreen,
        o = t.hideStatus;
      return React.default.createElement(ReactNative.View, {
        style: [C.container, a && {
          paddingTop: 0
        }]
      }, React.default.createElement(VideoPlayer.default, {
        title: r,
        source: {
          uri: n
        },
        onBack: this.props.navigation.goBack,
        onEnterFullscreen: this.fullscreen,
        onExitFullscreen: this.exitFullscreen,
        onShowControls: function () {
          e.setState({
            hideStatus: false
          });
        },
        onHideControls: function () {
          e.setState({
            hideStatus: true
          });
        },
        toggleResizeModeOnFullscreen: false,
        TopRight: React.default.createElement(E, {
          onCopy: function () {
            toast(locales.default.MV_URL_CLIPBOARD);
            _default.setString(n);
          },
          onOpenUrl: function () {
            ReactNative.Linking.openURL(n);
          },
          onIntentVideo: function () {
            intentVideo.default.playVideo(n);
          }
        }),
        isFullscreen: a,
        doubleTapTime: 200,
        playInBackground: true
      }), React.default.createElement(ReactNative.StatusBar, {
        hidden: o
      }));
    }
  },
  E = function (e) {
    var t = e.onCopy,
      n = e.onOpenUrl,
      r = e.onIntentVideo;
    return React.default.createElement(reactNativePopupMenu.Menu, {
      style: {
        width: '100%'
      }
    }, React.default.createElement(reactNativePopupMenu.MenuTrigger, {
      customStyles: {
        triggerWrapper: {
          alignItems: 'center',
          justifyContent: 'center'
        },
        TriggerTouchableComponent: ReactNative.TouchableOpacity
      }
    }, React.default.createElement(components.Icon, {
      name: icons.default.DOTS_VERTICAL
    })), React.default.createElement(reactNativePopupMenu.MenuOptions, {
      style: {
        color: '#000',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 16,
        padding: 8,
        flex: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      },
      optionsContainerStyle: {
        elevation: 0,
        borderRadius: 16,
        flex: 0,
        width: 'auto'
      },
      customStyles: {
        OptionTouchableComponent: ReactNative.TouchableOpacity
      }
    }, React.default.createElement(reactNativePopupMenu.MenuOption, {
      onSelect: t
    }, React.default.createElement(components.Icon, {
      name: icons.default.CONTENT_COPY,
      style: {
        margin: 2
      },
      size: 20
    })), React.default.createElement(reactNativePopupMenu.MenuOption, {
      onSelect: n
    }, React.default.createElement(components.Icon, {
      name: icons.default.LINK_VARIANT,
      style: {
        margin: 2
      }
    })), React.default.createElement(reactNativePopupMenu.MenuOption, {
      onSelect: r
    }, React.default.createElement(components.Icon, {
      name: icons.default.VIDEO_OUTLINE,
      style: {
        margin: 2
      }
    }))));
  },
  C = ReactNative.StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 8,
      backgroundColor: '#000'
    }
  }),
  v = R;
exports.default = v;
