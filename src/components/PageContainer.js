const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _objectWithoutProperties = require("@babel/runtime/helpers/objectWithoutProperties");
const _extends = require("@babel/runtime/helpers/extends");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireDefault(require("react")),
  ReactNative = require("react-native"),
  Background = _interopRequireDefault(require("./Background")),
  HeaderBar = _interopRequireDefault(require("./HeaderBar")),
  f = function (e) {
    var l = e.style,
      t = e.children,
      r = e.blur,
      a = e.headerBlur,
      f = _objectWithoutProperties(e, ["style", "children", "blur", "headerBlur"]);
    return React.default.createElement(ReactNative.View, {
      style: [{
        flex: 1
      }, ReactNative.StyleSheet.flatten(l)]
    }, React.default.createElement(Background.default, {
      blur: r
    }), React.default.createElement(HeaderBar.default, _extends({
      headerBlur: a
    }, f)), t);
  };
exports.default = f;
