Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.storage = void 0;
var ReactNative = require("react-native"),
  n = new (babelHelpers.interopRequireDefault(require("react-native-storage")).default)({
    size: 2048,
    storageBackend: ReactNative.AsyncStorage,
    defaultExpires: null,
    enableCache: false
  });
exports.storage = n;
global.storage = n;
