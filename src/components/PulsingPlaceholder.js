Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  o = 1e3,
  s = 500,
  u = function (e) {
    function t() {
      var e, a, n;
      babelHelpers.classCallCheck(this, t);
      for (var i = arguments.length, l = new Array(i), u = 0; u < i; u++) l[u] = arguments[u];
      return babelHelpers.possibleConstructorReturn(n, (a = n = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(l))), n._animValue = new ReactNative.Animated.Value(.3), n.start = function () {
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
      }, a));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        this.start();
      }
    }, {
      key: "componentWillUnmount",
      value: function () {
        var e, t;
        null === (e = (t = this._animation).stop) || void 0 === e || e.call(t);
      }
    }, {
      key: "render",
      value: function () {
        var e = this.props,
          t = e.style,
          a = e.textMode,
          n = babelHelpers.objectWithoutProperties(e, ["style", "textMode"]);
        return a ? React.default.createElement(ReactNative.Animated.Text, babelHelpers.extends({
          style: [{
            opacity: this._animValue
          }, t]
        }, n)) : React.default.createElement(ReactNative.Animated.View, babelHelpers.extends({
          style: [{
            backgroundColor: "#eee",
            opacity: this._animValue
          }, t]
        }, n));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = u;
