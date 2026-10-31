const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
var ReactNative = require('react-native'),
  logger = _interopRequireDefault(require('../services/logger')),
  toastModule = _interopRequireDefault(require('../native/toast'));
global.toast = function (e) {
  var a =
    arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : ReactNative.ToastAndroid.SHORT;
  e && toastModule.default.show(String(e), a);
};
global.log = logger.default;
