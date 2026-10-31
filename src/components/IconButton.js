const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  components = require('./index'),
  o = class t extends React.PureComponent {
    constructor() {
      return super(...arguments);
    }
    render() {
      var e = this.props,
        t = e.onPress,
        r = e.name,
        l = e.size,
        n = e.disabled;
      return React.default.createElement(
        ReactNative.View,
        {
          style: {
            alignItems: 'center',
            justifyContent: 'center',
            height: 80,
            width: 80,
          },
        },
        React.default.createElement(
          ReactNative.TouchableOpacity,
          {
            onPress: t,
            disabled: n,
          },
          React.default.createElement(components.Icon, {
            name: r,
            size: l || 20,
          }),
        ),
      );
    }
  };
exports.default = o;
