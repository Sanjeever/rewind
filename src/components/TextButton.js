const _default = require("./Text.js").default;
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireDefault(require("react")),
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
    }, React.default.createElement(_default, {
      style: [c.text, c.textBtnText, a]
    }, n)));
  };
exports.default = i;
