Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var c = require("react-native").NativeModules.Orientation,
  i = {
    lockToPortrait: function () {
      c.lockToPortrait();
    },
    lockToLandscape: function () {
      c.lockToLandscape();
    }
  };
exports.default = i;
