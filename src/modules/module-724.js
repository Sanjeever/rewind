Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireDefault(require("react")),
  ReactNative = require("react-native"),
  components = require("../components/index"),
  constants = require("../theme/constants"),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  s = function (e) {
    var t = e.onPress,
      r = e.isRound;
    return React.default.createElement(ReactNative.View, {
      style: {
        height: 150,
        width: 150,
        position: 'absolute',
        top: 0
      }
    }, React.default.createElement(ReactNative.TouchableOpacity, {
      onPress: t,
      style: [{
        position: 'absolute',
        right: 10,
        bottom: 10,
        height: 15,
        width: 20,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: constants.COLORS.secondary,
        backgroundColor: '#111'
      }, r && {
        backgroundColor: 'transparent',
        right: 15
      }]
    }, React.default.createElement(components.Icon, {
      name: icons.default.PLAY,
      size: 12
    })));
  };
exports.default = s;
