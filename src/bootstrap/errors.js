Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = function () {
  (0, reactNativeExceptionHandler.setJSExceptionHandler)(function (e, t) {
    t && ReactNative.Alert.alert(locales.default.ERROR, [{
      text: locales.default.RESTART_APP,
      onPress: function () {
        restart.default.restart();
      }
    }, {
      text: locales.default.CONFIRM,
      onPress: function () {}
    }]);
  }, true);
  (0, reactNativeExceptionHandler.setNativeExceptionHandler)(function () {
    toast('setNativeExceptionHandler');
  });
};
var ReactNative = require("react-native"),
  reactNativeExceptionHandler = require("react-native-exception-handler"),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  restart = babelHelpers.interopRequireDefault(require("../native/restart"));
