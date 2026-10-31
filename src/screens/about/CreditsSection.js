const _default = require('./../../components/Text.js').default;
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireDefault(require('react')),
  ReactNative = require('react-native'),
  styles = _interopRequireDefault(require('./styles')),
  n = function (e) {
    var t = e.onPress,
      l = e.renderAvatar,
      a = e.title,
      r = e.subtitle;
    return React.default.createElement(
      ReactNative.TouchableNativeFeedback,
      {
        onPress: t,
      },
      React.default.createElement(
        ReactNative.View,
        {
          style: styles.default.itemStyle,
        },
        l(),
        React.default.createElement(
          ReactNative.View,
          {
            style: {
              paddingHorizontal: 10,
              flex: 1,
            },
          },
          React.default.createElement(
            _default,
            {
              style: [
                styles.default.text,
                {
                  opacity: 0.8,
                  fontWeight: 'bold',
                },
              ],
            },
            a,
          ),
          React.default.createElement(
            _default,
            {
              style: [
                styles.default.text,
                {
                  opacity: 0.6,
                },
              ],
            },
            '/ ',
            r,
            ' /',
          ),
        ),
      ),
    );
  };
exports.default = n;
