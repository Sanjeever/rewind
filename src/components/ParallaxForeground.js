Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeAnimatable = babelHelpers.interopRequireWildcard(require("react-native-animatable")),
  constants = require("../theme/constants"),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  _ = require("./index"),
  d = function (e) {
    function t() {
      var e, a, n;
      babelHelpers.classCallCheck(this, t);
      for (var o = arguments.length, i = new Array(o), u = 0; u < o; u++) i[u] = arguments[u];
      return babelHelpers.possibleConstructorReturn(n, (a = n = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(i))), n.renderBottomMask = function () {
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
        }, React.default.createElement(_.GradientMask, {
          from: "bottom",
          style: {
            width: '100%',
            height: '100%'
          }
        }));
      }, a));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
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
        }, React.default.createElement(_.Icon, {
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
        }, React.default.createElement(_.Selectable, {
          style: [f.bold]
        }, n, Boolean(d) && React.default.createElement(ReactNative.Text, {
          style: f.alias
        }, ' / ', d)), (null === m || void 0 === m ? void 0 : m.length) > 0 && m.map(function (e, t) {
          return 'string' == typeof e && React.default.createElement(ReactNative.Text, {
            key: t,
            style: f.subtitle
          }, e);
        }), Boolean(c) && React.default.createElement(_.Icon, {
          name: icons.default.INFORMATION_OUTLINE,
          style: f.info,
          onPress: c
        })));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
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
