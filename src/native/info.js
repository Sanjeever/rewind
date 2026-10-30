Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.versionName = exports.versionCode = exports.isDebug = void 0;
var v = require("react-native").NativeModules.RNInfo,
  r = v.versionCode,
  d = v.versionName,
  u = v.isDebug;
exports.isDebug = u;
exports.versionName = d;
exports.versionCode = r;
