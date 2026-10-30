Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  utils = require("../utils/index"),
  styles = babelHelpers.interopRequireDefault(require("./styles")),
  u = function (e) {
    function t() {
      babelHelpers.classCallCheck(this, t);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(t).apply(this, arguments));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        var e = this.props,
          t = e.color,
          r = e.duration,
          l = e.currentTime,
          a = e.showLyric;
        return React.default.createElement(ReactNative.View, {
          style: [styles.default.progressBar, a && styles.default.sliderHide, {
            marginTop: -5,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
          }, styles.default.timeSoftPadding]
        }, React.default.createElement(ReactNative.Text, {
          style: [styles.default.text, {
            opacity: .7,
            color: t
          }, a && {
            fontSize: 12
          }]
        }, utils.timeFormatter.parseTime(l) + "  \t/\t  " + utils.timeFormatter.parseTime(r)));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = u;
