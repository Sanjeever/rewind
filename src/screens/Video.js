Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativePopupMenu = require("react-native-popup-menu"),
  components = require("../components/index"),
  VideoPlayer = babelHelpers.interopRequireDefault(require("../player/VideoPlayer")),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  names = babelHelpers.interopRequireDefault(require("../events/names")),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  services = require("../services/index"),
  events = require("../events/index"),
  intentVideo = babelHelpers.interopRequireDefault(require("../native/intentVideo")),
  orientation = babelHelpers.interopRequireDefault(require("../native/orientation")),
  y = function (e) {
    return e[1080] || e[720] || e[480] || e[240];
  },
  R = function (e) {
    function t() {
      var e, n, r;
      babelHelpers.classCallCheck(this, t);
      for (var a = arguments.length, l = new Array(a), i = 0; i < a; i++) l[i] = arguments[i];
      return babelHelpers.possibleConstructorReturn(r, (n = r = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(l))), r.state = {
        isFullscreen: false,
        hideStatus: false,
        url: void 0,
        title: void 0
      }, r.onBackPress = function () {
        if (r.state.isFullscreen) {
          r.exitFullscreen();
          return true;
        }
      }, r.getMVUrl = function (e, t) {
        var n, a, l, i, o, u, s;
        return regeneratorRuntime.async(function (d) {
          for (;;) switch (d.prev = d.next) {
            case 0:
              d.t0 = t;
              d.next = d.t0 === providers.default.netEase ? 3 : d.t0 === providers.default.qqMusic ? 11 : 15;
              break;
            case 3:
              d.next = 5;
              return regeneratorRuntime.awrap(services.Netease.mv(e));
            case 5:
              l = d.sent;
              i = l.data;
              o = i.brs;
              u = i.name;
              s = i.artistName;
              n = y(o);
              a = u + " - " + s;
              return d.abrupt("break", 15);
            case 11:
              d.next = 13;
              return regeneratorRuntime.awrap(services.QQMusic.getMV(e));
            case 13:
              n = d.sent;
              return d.abrupt("break", 15);
            case 15:
              n ? r.setState({
                url: n,
                title: a
              }) : toast(locales.default.MV_PLAYER_ERROR);
            case 16:
            case "end":
              return d.stop();
          }
        }, null, this);
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
      }, n));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        ReactNative.BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
        var e = (this.props.navigation.state || {}).params || {},
          t = e.mvid,
          n = e.api;
        this.getMVUrl(t, n);
        events.emitter.emit(names.default.HidePlayer, {
          hide: true
        });
      }
    }, {
      key: "componentWillUnmount",
      value: function () {
        this.exitFullscreen();
        ReactNative.BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
        events.emitter.emit(names.default.HidePlayer, {
          hide: false
        });
      }
    }, {
      key: "render",
      value: function () {
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
              ReactNative.Clipboard.setString(n);
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
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.Component),
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
