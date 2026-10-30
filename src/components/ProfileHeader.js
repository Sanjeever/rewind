Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  components = require("./index"),
  constants = require("../theme/constants"),
  names = babelHelpers.interopRequireDefault(require("../events/names")),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  events = require("../events/index"),
  types = babelHelpers.interopRequireWildcard(require("../utils/types")),
  users = babelHelpers.interopRequireDefault(require("../storage/users")),
  g = function (e) {
    function t() {
      var e, a, n;
      babelHelpers.classCallCheck(this, t);
      for (var r = arguments.length, o = new Array(r), u = 0; u < r; u++) o[u] = arguments[u];
      return babelHelpers.possibleConstructorReturn(n, (a = n = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(o))), n.state = {
        data: []
      }, n.getUserInfo = function () {
        var e, t, a, r;
        return regeneratorRuntime.async(function (i) {
          for (;;) switch (i.prev = i.next) {
            case 0:
              i.next = 2;
              return regeneratorRuntime.awrap(users.default.getUserInfo());
            case 2:
              if (e = i.sent, types.isObject(e)) {
                i.next = 6;
                break;
              }
              n.setState({
                data: []
              });
              return i.abrupt("return");
            case 6:
              t = e.netEase;
              a = e.qqMusic;
              r = [];
              types.isObject(t) && types.isString(t.avatarUrl) && r.push({
                avatarUrl: t.avatarUrl + '?param=200y200',
                nickname: t.nickname,
                page: 'NeteaseLogin'
              });
              types.isObject(a) && types.isString(a.avatarUrl) && r.push({
                avatarUrl: a.avatarUrl,
                nickname: a.nickname,
                page: 'QQMusicLogin'
              });
              n.setState({
                data: r
              });
            case 11:
            case "end":
              return i.stop();
          }
        }, null, this);
      }, n.easterEgg = function (e) {
        toast("\u4f60\u597d\u554a\uff0c" + e);
      }, n.renderAvatars = function () {
        var e = n.props,
          t = e.onNavigate,
          a = e.nativeOffset;
        return n.state.data.map(function (e, r) {
          if (e) return React.default.createElement(ReactNative.TouchableNativeFeedback, {
            key: r,
            onPress: function () {
              return t(e.page);
            },
            onLongPress: function () {
              return n.easterEgg(e.nickname);
            }
          }, React.default.createElement(ReactNative.View, {
            style: m.con
          }, e.avatarUrl && React.default.createElement(ReactNative.Animated.Image, {
            style: [m.avatar, {
              transform: [{
                translateY: a.y.interpolate({
                  inputRange: [-constants.DEVICE_WIDTH, 0],
                  outputRange: [-constants.DEVICE_WIDTH / 2 + 100 * r, 0],
                  extrapolate: 'clamp'
                }),
                translateX: a.y.interpolate({
                  inputRange: [-constants.DEVICE_WIDTH, 0],
                  outputRange: [.35 * constants.DEVICE_WIDTH - 30, 0],
                  extrapolate: 'clamp'
                }),
                scale: a.y.interpolate({
                  inputRange: [-constants.DEVICE_WIDTH, 0],
                  outputRange: [2, 1],
                  extrapolate: 'clamp'
                })
              }]
            }],
            source: {
              uri: e.avatarUrl
            }
          }), Boolean(e.nickname) && React.default.createElement(ReactNative.Animated.Text, {
            style: [m.nickname, {
              opacity: a.y.interpolate({
                inputRange: [-60, 0],
                outputRange: [0, 1],
                extrapolate: 'clamp'
              })
            }]
          }, e.nickname)));
        });
      }, a));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        var e = this;
        this.getUserInfo();
        this.sub = events.emitter.addListener(names.default.UserLogined, function () {
          setTimeout(function () {
            e.getUserInfo();
          }, 500);
        });
      }
    }, {
      key: "componentWillUnmount",
      value: function () {
        var e, t;
        null === (e = (t = this.sub).remove) || void 0 === e || e.call(t);
      }
    }, {
      key: "render",
      value: function () {
        var e = this.props.onNavigate,
          t = this.state.data;
        return React.default.createElement(ReactNative.Animated.View, {
          style: m.container
        }, t.length > 0 ? this.renderAvatars() : React.default.createElement(ReactNative.View, {
          style: m.con
        }, React.default.createElement(components.Icon, {
          name: icons.default.ACCOUNT,
          size: 40,
          onPress: function () {
            return e('InitialLogin');
          },
          style: {
            marginLeft: 10
          }
        })));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent),
  m = ReactNative.StyleSheet.create({
    container: {
      width: '100%',
      marginTop: 50,
      marginBottom: 15,
      alignItems: 'flex-start'
    },
    con: {
      width: '100%',
      paddingHorizontal: 20,
      paddingVertical: 15,
      flexDirection: 'row',
      alignItems: 'center'
    },
    nickname: {
      marginLeft: 10,
      fontSize: 16,
      fontWeight: 'bold'
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30
    }
  }),
  b = g;
exports.default = b;
