Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUid = exports.getSong = exports.getSinger = exports.getImg = exports.getApi = exports.getAlias = exports.getAlbum = void 0;
var providers = babelHelpers.interopRequireDefault(require("./providers")),
  utils = require("../utils/index"),
  types = require("../utils/types"),
  artistInfo = babelHelpers.interopRequireDefault(require("./artistInfo"));
exports.getUid = function (e) {
  if ((0, types.isObject)(e)) return e.songmid || e.mid || e.id;
};
exports.getSong = function (e) {
  return e.name || e.songname || e.song || e.title || e.filename;
};
exports.getSinger = function (e) {
  return e.singer || e.artists || e.ar;
};
exports.getAlbum = function (e) {
  return (0, utils.delve)(e, 'album.name') || (0, utils.delve)(e, 'al.name') || e.albumname || (t = e.album, (0, types.isString)(t) ? t : void 0) || '';
  var t;
};
exports.getAlias = function (e) {
  return (0, utils.delve)(e, 'tns.0') || (0, utils.delve)(e, 'alias.0') || e.transName;
};
exports.getImg = function (e, t, n) {
  return artistInfo.default[n](e, t) || "https://s1.ax1x.com/2020/04/01/G8Tdx0.png";
};
exports.getApi = function (e) {
  var t = e.qqAlbumId,
    n = e.localAlbumId,
    i = providers.default.netEase;
  t && (i = providers.default.qqMusic);
  n && (i = providers.default.local);
  return i;
};
