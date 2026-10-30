Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireDefault(require("react")),
  ReactNative = require("react-native"),
  u = function (e) {
    var t = e.children,
      l = e.style;
    return React.default.createElement(ReactNative.Text, {
      style: [{
        fontSize: 16,
        fontWeight: 'bold'
      }, ReactNative.StyleSheet.flatten(l)]
    }, t);
  };
exports.default = u;
