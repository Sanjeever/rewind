Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireDefault(require("react")),
  ReactNative = require("react-native"),
  components = require("../components/index"),
  PlayerView = require("./PlayerView"),
  module769 = babelHelpers.interopRequireDefault(require("./module-769")),
  PlayerController = babelHelpers.interopRequireDefault(require("./PlayerController")),
  styles = babelHelpers.interopRequireWildcard(require("./styles")),
  b = function (e) {
    function t() {
      babelHelpers.classCallCheck(this, t);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(t).apply(this, arguments));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        var e = this,
          t = this.state,
          l = t.expanded,
          r = t.url,
          a = t.playerStyle,
          s = t.hidePlayer,
          b = this.props,
          f = b.settings,
          c = f.navbarPadding,
          h = f.bottomBlur,
          H = b.bottomPaddingValue,
          y = void 0 === H ? 0 : H;
        return s ? null : r && !l ? React.default.createElement(ReactNative.View, {
          style: [styles.default.container, a && a, c ? {
            height: styles.BOTTOM_BAR_HEIGHT + styles.SOFT_MENU_HEIGHT + y
          } : {
            height: styles.BOTTOM_BAR_HEIGHT + y
          }]
        }, React.default.createElement(ReactNative.View, {
          style: [{
            height: '100%',
            width: '100%'
          }, c ? {
            paddingBottom: styles.SOFT_MENU_HEIGHT + y
          } : {
            paddingBottom: y
          }]
        }, React.default.createElement(components.Background, {
          blur: h,
          bgStyle: {
            top: null,
            bottom: 0
          }
        }), React.default.createElement(PlayerView.MiniPlayerWrapper, {
          that: this
        }))) : r && l ? React.default.createElement(ReactNative.View, {
          style: [styles.default.container, a && a]
        }, module769.default.map(function (t) {
          return (0, PlayerView.renderPlayerComponent)(e, t);
        })) : null;
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(PlayerController.default);
exports.default = b;
