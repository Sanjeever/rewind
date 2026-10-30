Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = function () {
  (0, reactNativeExceptionHandler.setJSExceptionHandler)(function (e, t) {
    t && ReactNative.Alert.alert(locales.default.ERROR, String(e), [{
      text: locales.default.RESTART_APP,
      onPress: function () {
        restartModule.default.restart();
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
  restartModule = babelHelpers.interopRequireDefault(require("../native/restart"));
