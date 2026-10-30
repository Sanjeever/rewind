Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var lottieReactNative = babelHelpers.interopRequireDefault(require("lottie-react-native")),
  React = babelHelpers.interopRequireDefault(require("react")),
  ReactNative = require("react-native"),
  reactNativeSpringScrollview = require("react-native-spring-scrollview"),
  components = require("./index"),
  constants = require("../theme/constants"),
  p = {
    flex: 1,
    justifyContent: 'center'
  },
  b = function (e) {
    function l() {
      babelHelpers.classCallCheck(this, l);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(l).apply(this, arguments));
    }
    babelHelpers.createClass(l, [{
      key: "render",
      value: function () {
        var e = this.state.status;
        if ('allLoaded' === e) return null;
        if ('loading' === e) return React.default.createElement(ReactNative.View, {
          style: p
        }, React.default.createElement(components.Spinkit, null));
        var l = this.props,
          r = l.offset,
          i = l.bottomOffset,
          b = r.interpolate({
            inputRange: [i + 50, i + 100],
            outputRange: [0, 1]
          });
        return React.default.createElement(ReactNative.View, {
          style: p
        }, React.default.createElement(lottieReactNative.default, {
          source: require("../theme/layout"),
          progress: b,
          style: {
            height: constants.SPINKIT_SIZE,
            width: constants.SPINKIT_SIZE,
            alignSelf: 'center'
          }
        }));
      }
    }]);
    babelHelpers.inherits(l, e);
    return l;
  }(reactNativeSpringScrollview.RefreshHeader);
exports.default = b;
b.height = constants.SPINKIT_SIZE + 80;
