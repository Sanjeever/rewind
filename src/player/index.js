const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireDefault(require("react")),
  ReactNative = require("react-native"),
  components = require("../components/index"),
  PlayerView = require("./PlayerView"),
  playerLayers = _interopRequireDefault(require("./playerLayers.js")),
  PlayerController = _interopRequireDefault(require("./PlayerController")),
  styles = _interopRequireWildcard(require("./styles")),
  b = class t extends PlayerController.default {
    constructor() {
      return super(...arguments);
    }
    "render"() {
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
        style: [styles.default.container, a && a, {overflow: 'hidden'}, c ? {
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
      }, playerLayers.default.map(function (t) {
        return React.default.createElement(React.default.Fragment, {key: t}, (0, PlayerView.renderPlayerComponent)(e, t));
      })) : null;
    }
  };
exports.default = b;
