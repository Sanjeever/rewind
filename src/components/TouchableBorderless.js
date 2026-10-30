Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireDefault(require("react")),
  ReactNative = require("react-native"),
  utils = require("../utils/index"),
  u = function (e) {
    var t = e.style,
      r = e.size,
      l = void 0 === r ? 40 : r,
      n = e.children,
      u = e.touchableBackground,
      d = void 0 === u ? 'rgba(255,255,255,0.3)' : u,
      s = e.onPress,
      c = babelHelpers.objectWithoutProperties(e, ["style", "size", "children", "touchableBackground", "onPress"]);
    return React.default.createElement(ReactNative.View, {
      style: [{
        height: l,
        width: l,
        borderRadius: l / 2,
        backgroundColor: 'rgba(0,0,0,0)',
        alignItems: 'center',
        justifyContent: 'center'
      }, ReactNative.StyleSheet.flatten(t)]
    }, React.default.createElement(ReactNative.TouchableNativeFeedback, babelHelpers.extends({
      background: (0, utils.getRipple)(d, true),
      onPress: function () {
        return null === s || void 0 === s ? void 0 : s();
      }
    }, c), n));
  };
exports.default = u;
