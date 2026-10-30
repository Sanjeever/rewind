var ReactNative = require("react-native"),
  logger = babelHelpers.interopRequireDefault(require("../services/logger")),
  toast = babelHelpers.interopRequireDefault(require("../native/toast"));
null === ReactNative.UIManager || void 0 === ReactNative.UIManager || ReactNative.UIManager.setLayoutAnimationEnabledExperimental(true);
global.toast = function (e) {
  var a = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : ReactNative.ToastAndroid.SHORT;
  e && toast.default.show(String(e), a);
};
global.log = logger.default;
