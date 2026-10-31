const _default = require('./Text.js').default;
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireDefault(require('react')),
  ReactNative = require('react-native'),
  filterColors = require('./filterColors'),
  c = ReactNative.StyleSheet.create({
    container: {
      marginHorizontal: 3,
    },
    item: {
      alignItems: 'center',
      color: filterColors.defaultColor,
      textAlignVertical: 'center',
    },
    highlight: {
      color: filterColors.highlightColor,
      fontWeight: 'bold',
    },
  }),
  h = function (e) {
    var t = e.name,
      l = e.onPress,
      i = e.highlight,
      r = e.textStyle;
    return React.default.createElement(
      ReactNative.TouchableOpacity,
      {
        onPress: l,
      },
      React.default.createElement(
        ReactNative.View,
        {
          style: c.container,
        },
        React.default.createElement(
          _default,
          {
            style: [c.item, i && c.highlight, r],
          },
          t,
        ),
      ),
    );
  };
exports.default = h;
