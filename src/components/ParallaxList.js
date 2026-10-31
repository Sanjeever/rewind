const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var lottieReactNative = _interopRequireDefault(require('lottie-react-native')),
  React = _interopRequireDefault(require('react')),
  ReactNative = require('react-native'),
  reactNativeSpringScrollview = require('./Scrolling.js'),
  components = require('./index'),
  constants = require('../theme/constants'),
  p = {
    flex: 1,
    justifyContent: 'center',
  },
  b = class l extends reactNativeSpringScrollview.RefreshHeader {
    constructor() {
      return super(...arguments);
    }
    render() {
      var e = this.state.status;
      if ('allLoaded' === e) return null;
      if ('loading' === e)
        return React.default.createElement(
          ReactNative.View,
          {
            style: p,
          },
          React.default.createElement(components.Spinkit, null),
        );
      var l = this.props,
        r = l.offset,
        i = l.bottomOffset,
        b = r.interpolate({
          inputRange: [i + 50, i + 100],
          outputRange: [0, 1],
        });
      return React.default.createElement(
        ReactNative.View,
        {
          style: p,
        },
        React.default.createElement(lottieReactNative.default, {
          source: require('../theme/layout'),
          progress: b,
          style: {
            height: constants.SPINKIT_SIZE,
            width: constants.SPINKIT_SIZE,
            alignSelf: 'center',
          },
        }),
      );
    }
  };
exports.default = b;
b.height = constants.SPINKIT_SIZE + 80;
