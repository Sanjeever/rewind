Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.STATUS_BAR_HEIGHT =
  exports.SPINKIT_SIZE =
  exports.ITEM_HEIGHT =
  exports.DEVICE_WIDTH =
  exports.DEVICE_HEIGHT =
  exports.COLORS =
    void 0;
var ReactNative = require('react-native'),
  _ = ReactNative.Dimensions.get('screen'),
  H = _.width,
  i = _.height;
exports.DEVICE_HEIGHT = i;
exports.DEVICE_WIDTH = H;
var S = ReactNative.StatusBar.currentHeight;
exports.STATUS_BAR_HEIGHT = S;
exports.ITEM_HEIGHT = 70;
exports.SPINKIT_SIZE = 60;
exports.COLORS = {
  primary: '#fff',
  primaryAlpha70: 'rgba(255,255,255,0.7)',
  primaryAlpha50: 'rgba(255,255,255,0.5)',
  primaryAlpha20: 'rgba(255,255,255,0.2)',
  primaryAlpha10: 'rgba(255,255,255,0.1)',
  secondary: '#e0e0e0',
};
