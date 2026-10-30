Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  FadingEdge = babelHelpers.interopRequireDefault(require("../components/FadingEdge")),
  styles = babelHelpers.interopRequireDefault(require("./styles")),
  module755 = babelHelpers.interopRequireDefault(require("./module-755")),
  p = function (e) {
    function t() {
      babelHelpers.classCallCheck(this, t);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(t).apply(this, arguments));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        var e = this.props,
          t = e.showTool,
          a = e.animatedOpacity,
          r = e.hidePlayingTime,
          l = e.lyric,
          p = e.hasTrans,
          c = e.currentTime,
          d = e.onTap,
          f = e.playSound,
          b = e.seekTo,
          h = e.lrcText,
          T = e.showTrans,
          y = e.changeShowTrans,
          g = e.changeFontSize,
          m = e.lyricFontSize,
          H = e.getLyricIndex,
          S = e.playState;
        return React.default.createElement(ReactNative.Animated.View, {
          style: [styles.default.lyric, false === t && styles.default.toolHide, {
            opacity: a
          }, false === r && styles.default.softPadding, {
            paddingTop: 70
          }]
        }, React.default.createElement(FadingEdge.default, {
          bottom: 128,
          top: 128
        }, React.default.createElement(module755.default, {
          playState: S,
          lyric: l,
          hasTrans: p,
          currentTime: c,
          onTap: d,
          seekTo: function (e) {
            f();
            b(e);
          },
          lrcText: h,
          showTool: t,
          showTrans: T,
          changeShowTrans: y,
          changeFontSize: function (e) {
            return g(e);
          },
          fontSize: m,
          getIndex: H
        })));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = p;
