Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireDefault(require("react")),
  ReactNative = require("react-native"),
  constants = require("../theme/constants"),
  u = function (e) {
    return React.default.createElement(ReactNative.Switch, babelHelpers.extends({
      onTintColor: constants.COLORS.primaryAlpha50,
      tintColor: constants.COLORS.primaryAlpha20,
      thumbTintColor: constants.COLORS.secondary
    }, e));
  };
exports.default = u;
