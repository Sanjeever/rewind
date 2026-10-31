Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var ReactNative = require('react-native'),
  constants = require('../../theme/constants'),
  a = ReactNative.StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      position: 'absolute',
      top: 0,
      paddingRight: 20,
    },
    spin: {
      height: '100%',
    },
    btnCon: {
      width: 100,
    },
    strong: {
      opacity: 1,
      fontWeight: 'bold',
    },
    dotContainer: {
      flexDirection: 'row',
      position: 'absolute',
      bottom: -12,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: constants.COLORS.primary,
      margin: 3,
    },
  });
exports.default = a;
