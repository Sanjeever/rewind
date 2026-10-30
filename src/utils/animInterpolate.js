Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var constants = require("../theme/constants"),
  u = constants.STATUS_BAR_HEIGHT + 40,
  p = {
    forHeader: function (e) {
      return e ? {
        opacity: e.interpolate({
          inputRange: [0, constants.DEVICE_WIDTH - u - 30],
          outputRange: [0, 1],
          extrapolate: 'clamp'
        }),
        transform: [{
          translateY: e.interpolate({
            inputRange: [120, constants.DEVICE_WIDTH - u - 30],
            outputRange: [-30, 0],
            extrapolate: 'clamp'
          })
        }]
      } : {};
    }
  };
exports.default = p;
