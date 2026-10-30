Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireDefault(require("react")),
  ReactNative = require("react-native"),
  c = ReactNative.StyleSheet.create({
    textBtn: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    text: {
      opacity: .6
    }
  }),
  i = function (e) {
    var t = e.onPress,
      l = e.style,
      n = e.text,
      a = e.textStyle;
    return React.default.createElement(ReactNative.TouchableOpacity, {
      onPress: t
    }, React.default.createElement(ReactNative.View, {
      style: [c.textBtn, l]
    }, React.default.createElement(ReactNative.Text, {
      style: [c.text, c.textBtnText, a]
    }, n)));
  };
exports.default = i;
