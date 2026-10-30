Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeAnimatable = babelHelpers.interopRequireWildcard(require("react-native-animatable")),
  utils = require("../utils/index"),
  p = function (e) {
    function t() {
      babelHelpers.classCallCheck(this, t);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(t).apply(this, arguments));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        var e = this.props,
          t = e.width,
          r = e.animatedOpacity,
          i = e.color,
          a = e.duration,
          p = e.currentTime,
          u = utils.timeFormatter.parseTime(p) + ' / ' + utils.timeFormatter.parseTime(a);
        return React.default.createElement(reactNativeAnimatable.View, {
          pointerEvents: 'none',
          ref: "slidingTimeText",
          animation: "fadeIn",
          useNativeDriver: true,
          style: [{
            width: t,
            position: 'absolute',
            top: t,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: .5
          }]
        }, React.default.createElement(ReactNative.Animated.Text, {
          style: [{
            color: i,
            opacity: r
          }]
        }, u));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = p;
