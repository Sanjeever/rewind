const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _extends = require("@babel/runtime/helpers/extends");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireDefault(require("react")),
  ReactNative = require("react-native"),
  constants = require("../theme/constants"),
  u = function (e) {
    return React.default.createElement(ReactNative.Switch, _extends({
      onTintColor: constants.COLORS.primaryAlpha50,
      tintColor: constants.COLORS.primaryAlpha20,
      thumbTintColor: constants.COLORS.secondary
    }, e));
  };
exports.default = u;
