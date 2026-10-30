Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  buttons = babelHelpers.interopRequireDefault(require("./buttons")),
  styles = babelHelpers.interopRequireDefault(require("./styles")),
  module752 = babelHelpers.interopRequireDefault(require("./module-752")),
  module761 = babelHelpers.interopRequireDefault(require("./module-761")),
  module763 = babelHelpers.interopRequireDefault(require("./module-763")),
  f = function (e) {
    function t() {
      babelHelpers.classCallCheck(this, t);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(t).apply(this, arguments));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        var e = this.props,
          t = e.animatedOpacity,
          l = e.playMode,
          a = e.onChangePlayStatus,
          r = e.showLyric,
          f = e.changeSong,
          c = e.togglePlay,
          y = e.onNowPlaying,
          b = e.color,
          m = e.playState,
          P = e.loaded;
        return React.default.createElement(ReactNative.Animated.View, {
          style: [styles.default.footer, {
            opacity: t
          }, r && {
            paddingBottom: 0
          }]
        }, React.default.createElement(ReactNative.View, {
          style: styles.default.toolBar
        }, React.default.createElement(module763.default, {
          playMode: l,
          onPress: a,
          color: b,
          size: 25,
          style: {
            padding: 5
          }
        }), React.default.createElement(module752.default, {
          name: buttons.default.PREV.name,
          type: buttons.default.PREV.type,
          onPress: function () {
            return f('pre');
          },
          color: b,
          style: {
            padding: 5
          }
        }), React.default.createElement(module761.default, {
          playState: m,
          onPress: c,
          color: b,
          loaded: P
        }), React.default.createElement(module752.default, {
          name: buttons.default.NEXT.name,
          type: buttons.default.NEXT.type,
          onPress: function () {
            return f('next');
          },
          color: b,
          style: {
            padding: 5
          }
        }), React.default.createElement(module752.default, {
          onPress: y,
          name: buttons.default.LIST.name,
          type: buttons.default.LIST.type,
          color: b,
          style: {
            padding: 5
          },
          size: 25
        })));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = f;
