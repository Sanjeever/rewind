Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireDefault(require("react")),
  ReactNative = require("react-native"),
  TouchableScale = babelHelpers.interopRequireDefault(require("../components/TouchableScale")),
  f = function (e) {
    var t = e.onPress,
      n = e.content;
    return React.default.createElement(TouchableScale.default, {
      onPress: t
    }, React.default.createElement(ReactNative.Text, {
      style: {
        fontSize: 18,
        marginTop: '15%',
        marginBottom: 10,
        fontWeight: 'bold'
      }
    }, n));
  };
exports.default = f;
