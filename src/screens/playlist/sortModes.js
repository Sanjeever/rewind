const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.sortModeMap = exports.orderTexts = exports.FOREGROUND_HEIGHT = void 0;
var constants = require('../../theme/constants'),
  locales = _interopRequireDefault(require('../../locales/index')),
  n = constants.DEVICE_WIDTH;
exports.FOREGROUND_HEIGHT = n;
exports.sortModeMap = {
  time: 'random',
  random: 'song',
  song: 'singer',
  singer: 'album',
  album: 'time',
};
var l = {
  random: locales.default.RANDOM_ORDER,
  song: locales.default.SONG_ORDER,
  album: locales.default.ALBUM_ORDER,
  singer: locales.default.ARTIST_ORDER,
};
exports.orderTexts = l;
