Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SECTIONS = exports.SECTION_KEYS = exports.SECTION_NAMES = void 0;
var locales = babelHelpers.interopRequireDefault(require("../../locales/index")),
  T = {
    songs: locales.default.ARTIST_SONGS,
    albums: locales.default.ARTIST_ALBUM,
    artists: locales.default.ARTIST,
    history: locales.default.HISTORY
  };
exports.SECTION_NAMES = T;
exports.SECTION_KEYS = {
  songs: 'songs',
  albums: 'albums',
  artists: 'artists',
  history: 'history'
};
var l = Object.keys(T);
exports.SECTIONS = l;
