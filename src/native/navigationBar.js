Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var u = require("react-native").NativeModules.RNHideNavbar,
  d = {
    transparentStatusBar: function () {
      u.transparentStatusBar();
    }
  };
exports.default = d;
