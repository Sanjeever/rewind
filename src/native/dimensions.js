Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var i = require("react-native").NativeModules.ExtraDimensions,
  o = {
    get: function (e) {
      return i[e];
    }
  };
exports.default = o;
