Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireDefault(require("react")),
  ReactNative = require("react-native"),
  Background = babelHelpers.interopRequireDefault(require("./Background")),
  HeaderBar = babelHelpers.interopRequireDefault(require("./HeaderBar")),
  f = function (e) {
    var l = e.style,
      t = e.children,
      r = e.blur,
      a = e.headerBlur,
      f = babelHelpers.objectWithoutProperties(e, ["style", "children", "blur", "headerBlur"]);
    return React.default.createElement(ReactNative.View, {
      style: [{
        flex: 1
      }, ReactNative.StyleSheet.flatten(l)]
    }, React.default.createElement(Background.default, {
      blur: r
    }), React.default.createElement(HeaderBar.default, babelHelpers.extends({
      headerBlur: a
    }, f)), t);
  };
exports.default = f;
