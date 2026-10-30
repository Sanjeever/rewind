Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeAnimatable = babelHelpers.interopRequireWildcard(require("react-native-animatable")),
  styles = babelHelpers.interopRequireDefault(require("./styles")),
  o = function (e) {
    return e.replace(/&apos;/gm, "'").replace(/\/\//g, '').replace(/&quot;/g, '"').replace(/\[.+\]/gi, '');
  },
  c = function (e) {
    function t() {
      babelHelpers.classCallCheck(this, t);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(t).apply(this, arguments));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        var e = this.props,
          t = e.currentTime,
          i = e.getLyricIndex,
          r = e.lyric,
          n = e.showTrans,
          c = e.animatedOpacity,
          p = e.SOFT_MENU_HEIGHT,
          d = e.width,
          f = e.isRound,
          m = i(r, t + .3);
        m > this.miniLyricIndex ? this.miniLyric = false : this.miniLyric = true;
        this.miniLyricIndex = m;
        var y = m + 1 >= r.length ? m : y;
        if (!m) return null;
        var b = o(r[m].txt),
          h = r[m].trans,
          g = n && h ? o(h.txt) : null;
        return React.default.createElement(ReactNative.Animated.View, {
          style: [styles.default.progressBar, {
            height: null,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            opacity: c,
            top: d,
            paddingHorizontal: 30
          }, !f && {
            top: null,
            bottom: 35 + p
          }]
        }, b && true === this.miniLyric ? React.default.createElement(ReactNative.View, {
          style: {
            opacity: .8
          }
        }, g && n ? React.default.createElement(reactNativeAnimatable.Text, {
          style: [styles.default.text, {
            textAlign: 'center',
            fontSize: 15
          }],
          useNativeDriver: true,
          animation: 'fadeIn'
        }, g, '\n', React.default.createElement(ReactNative.Text, {
          style: {
            fontSize: 13
          }
        }, b)) : React.default.createElement(reactNativeAnimatable.Text, {
          useNativeDriver: true,
          style: [styles.default.text, {
            textAlign: 'center',
            fontSize: 14
          }, !n && !g && {
            fontSize: 15
          }],
          animation: 'fadeIn'
        }, b)) : null);
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = c;
