Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var language = babelHelpers.interopRequireDefault(require("../native/language")),
  en_US = babelHelpers.interopRequireDefault(require("./en_US")),
  zh_CN = babelHelpers.interopRequireDefault(require("./zh_CN")),
  zh_HK = babelHelpers.interopRequireDefault(require("./zh_HK")),
  zh_TW = babelHelpers.interopRequireDefault(require("./zh_TW")),
  p = {
    zh_CN: zh_CN.default,
    zh_TW: zh_TW.default,
    zh_HK: zh_HK.default,
    en_US: en_US.default
  }[language.default.language] || zh_CN.default;
exports.default = p;
