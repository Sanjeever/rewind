Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireDefault(require("react")),
  ReactNative = require("react-native"),
  reactNativeLinearGradient = babelHelpers.interopRequireDefault(require("react-native-linear-gradient"));
exports.default = function (e) {
  var t = e.colors,
    r = e.from,
    o = void 0 === r ? 'top' : r,
    a = e.style,
    n = t || function () {
      switch (o) {
        case 'top':
          return ['rgba(0,0,0,0.5)', 'rgba(0,0,0,0)'];
        case 'bottom':
          return ['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)'];
      }
    }();
  return React.default.createElement(reactNativeLinearGradient.default, {
    colors: n,
    style: [{
      position: 'absolute',
      height: 80,
      width: '100%'
    }, ReactNative.StyleSheet.flatten(a)]
  });
};
