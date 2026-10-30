const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _objectWithoutProperties = require("@babel/runtime/helpers/objectWithoutProperties");
const _extends = require("@babel/runtime/helpers/extends");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  o = 1e3,
  s = 500,
  u = class t extends React.PureComponent {
    constructor() {
      var e, a, n;
      for (var i = arguments.length, l = new Array(i), u = 0; u < i; u++) l[u] = arguments[u];
      return a = n = super(...l), n._animValue = new ReactNative.Animated.Value(.3), n.start = function () {
        n._animation = ReactNative.Animated.timing(n._animValue, {
          toValue: 1,
          easing: ReactNative.Easing.easeIn,
          useNativeDriver: true,
          duration: o
        });
        n._animation.start(function () {
          n._animation = ReactNative.Animated.timing(n._animValue, {
            toValue: .3,
            useNativeDriver: true,
            duration: s
          });
          n._animation.start(n.start);
        });
      }, a;
    }
    "componentDidMount"() {
      this.start();
    }
    "componentWillUnmount"() {
      var e, t;
      null === (e = (t = this._animation).stop) || void 0 === e || e.call(t);
    }
    "render"() {
      var e = this.props,
        t = e.style,
        a = e.textMode,
        n = _objectWithoutProperties(e, ["style", "textMode"]);
      return a ? React.default.createElement(ReactNative.Animated.Text, _extends({
        style: [{
          opacity: this._animValue
        }, t]
      }, n)) : React.default.createElement(ReactNative.Animated.View, _extends({
        style: [{
          backgroundColor: "#eee",
          opacity: this._animValue
        }, t]
      }, n));
    }
  };
exports.default = u;
