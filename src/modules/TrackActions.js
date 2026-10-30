const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var locales = _interopRequireDefault(require("../locales/index")),
  f = [{
    title: locales.default.ADD_TO_QUEUE
  }, {
    title: locales.default.ADD_TO_MIX
  }, {
    title: locales.default.ARTIST,
    needCheck: true
  }, {
    title: locales.default.ALBUM,
    needCheck: true
  }, {
    title: locales.default.COMMENT
  }, {
    title: locales.default.SHARE
  }, {
    title: locales.default.LYRIC
  }, {
    title: locales.default.CLONE
  }];
exports.default = f;
