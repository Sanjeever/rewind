const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var lottieReactNative = _interopRequireDefault(require('lottie-react-native')),
  React = _interopRequireDefault(require('react')),
  reactNativeSpringScrollview = require('./Scrolling.js'),
  components = require('./index'),
  constants = require('../theme/constants'),
  layout = require('../theme/layout'),
  f = class t extends reactNativeSpringScrollview.RefreshHeader {
    constructor() {
      return super(...arguments);
    }
    render() {
      if ('refreshing' === this.state.status)
        return React.default.createElement(components.Spinkit, null);
      var e = this.props.offset.interpolate({
        inputRange: [-120, -60],
        outputRange: [1, 0],
      });
      return React.default.createElement(lottieReactNative.default, {
        source: layout,
        progress: e,
        style: {
          height: constants.SPINKIT_SIZE,
          width: constants.SPINKIT_SIZE,
          alignSelf: 'center',
        },
      });
    }
  };
exports.default = f;
