Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var languageModule = babelHelpers.interopRequireDefault(require("../native/language")),
  en_USModule = babelHelpers.interopRequireDefault(require("./en_US")),
  zh_CNModule = babelHelpers.interopRequireDefault(require("./zh_CN")),
  zh_HKModule = babelHelpers.interopRequireDefault(require("./zh_HK")),
  zh_TWModule = babelHelpers.interopRequireDefault(require("./zh_TW")),
  p = {
    zh_CN: zh_CNModule.default,
    zh_TW: zh_TWModule.default,
    zh_HK: zh_HKModule.default,
    en_US: en_USModule.default
  }[languageModule.default.language] || zh_CNModule.default;
exports.default = p;
