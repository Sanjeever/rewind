const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireDefault(require('react')),
  ReactNative = require('react-native'),
  components = require('../components/index'),
  c = function (e) {
    var t = e.name,
      a = e.switched,
      l = e.onSwitch;
    return React.default.createElement(
      ReactNative.TouchableNativeFeedback,
      {
        onPress: l,
      },
      React.default.createElement(
        ReactNative.View,
        {
          style: {
            flex: 1,
            height: 60,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 12,
          },
        },
        React.default.createElement(components.Title, null, t),
        React.default.createElement(components.Switch, {
          value: a,
          onValueChange: l,
        }),
      ),
    );
  };
exports.default = c;
