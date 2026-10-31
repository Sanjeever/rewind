Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var u = require('react-native').NativeModules.RNCrypto,
  a = {
    weapi: function (e) {
      var t = JSON.stringify(e);
      return u.weapi(t);
    },
    tencentSignature: function (e) {
      return u.tencentSignature(e);
    },
  };
exports.default = a;
