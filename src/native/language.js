Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var t = require("react-native").NativeModules.RNLanguage,
  d = {
    language: t.language,
    setLanguageCode: function (e) {
      return t.setLanguageCode(e);
    }
  };
exports.default = d;
