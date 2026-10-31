import * as constants from '../theme/constants';
const u = constants.STATUS_BAR_HEIGHT + 40;
const p = {
  forHeader: function (e) {
    if (e) {
      return {
        opacity: e.interpolate({
          inputRange: [0, constants.DEVICE_WIDTH - u - 30],
          outputRange: [0, 1],
          extrapolate: 'clamp',
        }),
        transform: [
          {
            translateY: e.interpolate({
              inputRange: [120, constants.DEVICE_WIDTH - u - 30],
              outputRange: [-30, 0],
              extrapolate: 'clamp',
            }),
          },
        ],
      };
    }
    return {};
  },
};
export default p;
