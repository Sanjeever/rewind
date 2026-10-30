Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var n = require("react-native").NativeModules.RNSplashScreen,
  u = {
    hide: function () {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 500;
      return n.hide(e);
    },
    show: n.show
  };
exports.default = u;
