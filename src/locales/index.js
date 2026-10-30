const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var languageModule = _interopRequireDefault(require("../native/language")),
  en_USModule = _interopRequireDefault(require("./en_US")),
  zh_CNModule = _interopRequireDefault(require("./zh_CN")),
  zh_HKModule = _interopRequireDefault(require("./zh_HK")),
  zh_TWModule = _interopRequireDefault(require("./zh_TW")),
  p = {
    zh_CN: zh_CNModule.default,
    zh_TW: zh_TWModule.default,
    zh_HK: zh_HKModule.default,
    en_US: en_USModule.default
  }[languageModule.default.language] || zh_CNModule.default;
exports.default = p;
