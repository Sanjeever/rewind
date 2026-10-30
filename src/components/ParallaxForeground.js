const _default = require("./Text.js").default;
const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeAnimatable = _interopRequireWildcard(require("react-native-animatable")),
  constants = require("../theme/constants"),
  icons = _interopRequireDefault(require("../theme/icons")),
  components = require("./index"),
  d = class t extends React.PureComponent {
    constructor() {
      var e, a, n;
      for (var o = arguments.length, i = new Array(o), u = 0; u < o; u++) i[u] = arguments[u];
      return a = n = super(...i), n.renderBottomMask = function () {
        var e = n.props.animOffsetY;
        return React.default.createElement(ReactNative.Animated.View, {
          style: {
            position: 'absolute',
            width: '100%',
            height: 150,
            bottom: 0,
            opacity: e.interpolate({
              inputRange: [-50, 0],
              outputRange: [0, 1],
              extrapolate: 'clamp'
            })
          }
        }, React.default.createElement(components.GradientMask, {
          from: "bottom",
          style: {
            width: '100%',
            height: '100%'
          }
        }));
      }, a;
    }
    "render"() {
      var e = this.props,
        t = e.img,
        a = e.subtitle,
        n = e.title,
        o = e.animOffsetY,
        d = e.alias,
        c = e.onInfo,
        g = constants.STATUS_BAR_HEIGHT + 40,
        m = 'string' == typeof a ? [a] : a,
        b = [{
          translateY: o.interpolate({
            inputRange: [-constants.DEVICE_WIDTH, 0],
            outputRange: [-constants.DEVICE_WIDTH / 2, 0],
            extrapolate: 'clamp'
          })
        }, {
          scale: o.interpolate({
            inputRange: [-constants.DEVICE_WIDTH, 0],
            outputRange: [2, 1],
            extrapolate: 'clamp'
          })
        }];
      return React.default.createElement(ReactNative.Animated.View, {
        style: [f.foreground, {
          opacity: o.interpolate({
            inputRange: [100, constants.DEVICE_WIDTH - g - 30],
            outputRange: [1, 0],
            extrapolate: 'clamp'
          })
        }]
      }, 'string' == typeof t && t ? React.default.createElement(reactNativeAnimatable.Image, {
        animation: 'fadeIn',
        useNativeDriver: true,
        source: {
          uri: t
        },
        style: [f.foregroundImg, {
          transform: b
        }]
      }) : React.default.createElement(ReactNative.View, {
        style: [f.foregroundImg, f.foregroundIconCon]
      }, React.default.createElement(components.Icon, {
        name: icons.default.ACCOUNT_MUSIC,
        size: 70
      })), this.renderBottomMask(), React.default.createElement(ReactNative.Animated.View, {
        style: [f.textCon, {
          opacity: o.interpolate({
            inputRange: [-constants.DEVICE_WIDTH / 3, 0],
            outputRange: [0, 1],
            extrapolate: 'clamp'
          })
        }]
      }, React.default.createElement(components.Selectable, {
        style: [f.bold]
      }, n, Boolean(d) && React.default.createElement(_default, {
        style: f.alias
      }, ' / ', d)), (null === m || void 0 === m ? void 0 : m.length) > 0 && m.map(function (e, t) {
        return 'string' == typeof e && React.default.createElement(_default, {
          key: t,
          style: f.subtitle
        }, e);
      }), Boolean(c) && React.default.createElement(components.Icon, {
        name: icons.default.INFORMATION_OUTLINE,
        style: f.info,
        onPress: c
      })));
    }
  };
exports.default = d;
var f = ReactNative.StyleSheet.create({
  foreground: {
    height: constants.DEVICE_WIDTH,
    width: '100%',
    justifyContent: 'center'
  },
  foregroundImg: {
    width: '100%',
    height: '100%'
  },
  foregroundIconCon: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111'
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 21
  },
  textCon: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20
  },
  alias: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)'
  },
  subtitle: {
    opacity: .7
  },
  info: {
    position: 'absolute',
    alignSelf: 'center',
    right: 20
  }
});
