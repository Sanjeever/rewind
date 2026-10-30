Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireDefault(require("react")),
  ReactNative = require("react-native"),
  module884 = require("./module-884"),
  c = ReactNative.StyleSheet.create({
    container: {
      marginHorizontal: 3
    },
    item: {
      alignItems: 'center',
      color: module884.defaultColor,
      textAlignVertical: 'center'
    },
    highlight: {
      color: module884.highlightColor,
      fontWeight: 'bold'
    }
  }),
  h = function (e) {
    var t = e.name,
      l = e.onPress,
      i = e.highlight,
      r = e.textStyle;
    return React.default.createElement(ReactNative.TouchableOpacity, {
      onPress: l
    }, React.default.createElement(ReactNative.View, {
      style: c.container
    }, React.default.createElement(ReactNative.Text, {
      style: [c.item, i && c.highlight, r]
    }, t)));
  };
exports.default = h;
