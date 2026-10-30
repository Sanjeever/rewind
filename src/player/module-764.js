Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  s = function (e) {
    function t() {
      babelHelpers.classCallCheck(this, t);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(t).apply(this, arguments));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        var e = this.props,
          t = e.extraBottomValue,
          r = e.animtedOpacity,
          l = e.currentIndex,
          a = e.tracksLength;
        return React.default.createElement(ReactNative.Animated.View, {
          accessible: false,
          style: [{
            position: 'absolute',
            padding: 10,
            alignSelf: 'center',
            bottom: 5 + t,
            opacity: r
          }]
        }, React.default.createElement(ReactNative.Text, {
          style: [{
            fontSize: 11,
            textAlign: 'center',
            opacity: .5
          }]
        }, l, " / ", a));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = s;
