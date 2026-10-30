Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.playlist_dir = exports.picture_dir = exports.files_dir = exports.cache_dir = exports.audio_cache = void 0;
var info = require("../native/info"),
  c = babelHelpers.interopRequireDefault(require("rn-fetch-blob")).default.fs.dirs,
  l = c.SDCardDir + '/Android/data/' + info.applicationId + '/cache/';
exports.cache_dir = l;
var s = c.SDCardDir + '/Android/data/' + info.applicationId + '/files/';
exports.files_dir = s;
var t = s + 'playlist';
exports.playlist_dir = t;
var u = l + 'audio-cache';
exports.audio_cache = u;
var _ = c.PictureDir;
exports.picture_dir = _;
