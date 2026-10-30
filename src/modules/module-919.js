Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  components = require("../components/index"),
  constants = require("../theme/constants"),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  styles = babelHelpers.interopRequireDefault(require("../screens/users/styles")),
  p = function (e) {
    function t() {
      babelHelpers.classCallCheck(this, t);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(t).apply(this, arguments));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        var e = this.props,
          t = e.profile,
          l = e.followed,
          a = e.nativeOffset,
          n = e.onHeart,
          p = t.avatarUrl,
          m = t.nickname,
          b = t.signature,
          y = t.follows,
          E = t.followeds,
          g = t.backgroundUrl,
          H = [{
            translateY: a.y.interpolate({
              inputRange: [-constants.DEVICE_WIDTH, 0],
              outputRange: [-constants.DEVICE_WIDTH / 2, 0],
              extrapolate: 'clamp'
            })
          }, {
            scale: a.y.interpolate({
              inputRange: [-constants.DEVICE_WIDTH, 0],
              outputRange: [2, 1],
              extrapolate: 'clamp'
            })
          }];
        return React.default.createElement(ReactNative.View, {
          style: d.avatarCon
        }, React.default.createElement(ReactNative.Animated.View, {
          style: [ReactNative.StyleSheet.absoluteFill, {
            transform: H
          }]
        }, React.default.createElement(ReactNative.Image, {
          source: {
            uri: g
          },
          style: ReactNative.StyleSheet.absoluteFill
        }), React.default.createElement(ReactNative.View, {
          style: [ReactNative.StyleSheet.absoluteFill, {
            backgroundColor: 'rgba(0,0,0,0.5)'
          }]
        })), React.default.createElement(styles.default, {
          imgUrl: p,
          nativeOffset: a
        }), React.default.createElement(ReactNative.Animated.View, {
          style: {
            opacity: a.y.interpolate({
              inputRange: [-constants.DEVICE_WIDTH / 2, 0],
              outputRange: [0, 1],
              extrapolate: 'clamp'
            })
          }
        }, m ? React.default.createElement(ReactNative.TouchableOpacity, {
          onPress: n
        }, React.default.createElement(ReactNative.View, {
          style: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 15
          }
        }, React.default.createElement(ReactNative.Text, {
          style: [d.text, d.title]
        }, m), React.default.createElement(components.Icon, {
          iconStyle: {
            marginLeft: 5
          },
          size: 16,
          name: true === l ? icons.default.HEART : icons.default.HEART_OUTLINE
        }))) : null, b ? React.default.createElement(ReactNative.Text, {
          numberOfLines: 2,
          style: [d.text]
        }, b) : null, React.default.createElement(ReactNative.View, {
          style: {
            marginTop: 15,
            alignItems: 'center',
            opcity: .7
          }
        }, y ? React.default.createElement(ReactNative.Text, {
          style: [d.text]
        }, locales.default.FOLLOWS, " ", y) : null, E ? React.default.createElement(ReactNative.Text, {
          style: [d.text]
        }, locales.default.FOLLOWER, " ", E) : null)));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = p;
var d = ReactNative.StyleSheet.create({
  text: {
    textAlign: 'center'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18
  },
  avatarCon: {
    height: constants.DEVICE_WIDTH,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  }
});
