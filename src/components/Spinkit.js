const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var lottieReactNative = _interopRequireDefault(require('lottie-react-native')),
  React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  constants = require('../theme/constants'),
  loading = require('../../assets/animations/loading'),
  p = class t extends React.PureComponent {
    constructor() {
      return super(...arguments);
    }
    render() {
      var e = this.props,
        t = e.size,
        l = void 0 === t ? constants.SPINKIT_SIZE : t,
        r = e.style;
      return React.default.createElement(
        ReactNative.View,
        {
          style: [
            {
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
            },
            r,
          ],
        },
        React.default.createElement(lottieReactNative.default, {
          loop: true,
          autoPlay: true,
          source: loading,
          style: {
            height: l,
            width: l,
            alignItems: 'center',
          },
          duration: 2e3,
        }),
      );
    }
  };
exports.default = p;
