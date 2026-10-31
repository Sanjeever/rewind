const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireDefault(require('react')),
  ReactNative = require('react-native'),
  constants = require('../../theme/constants'),
  o = function (e) {
    var t = e.imgUrl,
      a = e.style,
      r = e.nativeOffset;
    return t
      ? React.default.createElement(ReactNative.Animated.Image, {
          style: [
            {
              height: 150,
              width: 150,
              borderRadius: 75,
              borderWidth: 1,
              borderColor: '#fff',
              marginTop: 20,
            },
            r && {
              transform: [
                {
                  scale: r.y.interpolate({
                    inputRange: [-constants.DEVICE_WIDTH, 0],
                    outputRange: [2, 1],
                    extrapolate: 'clamp',
                  }),
                  translateY: r.y.interpolate({
                    inputRange: [-constants.DEVICE_WIDTH, 0, constants.DEVICE_WIDTH],
                    outputRange: [-constants.DEVICE_WIDTH / 5, 0, constants.DEVICE_WIDTH / 4],
                  }),
                },
              ],
            },
            a,
          ],
          source: {
            uri: t,
          },
        })
      : null;
  };
exports.default = o;
