const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var tabIcons = _interopRequireDefault(require("../theme/tabIcons")),
  locales = _interopRequireDefault(require("../locales/index")),
  f = {
    pages: [{
      title: locales.default.LOCAL_MUSIC,
      page: 'localMusic',
      icon: tabIcons.default.LOCAL
    }, {
      title: locales.default.RECENT_PLAY,
      page: 'history',
      icon: tabIcons.default.HISTORY
    }, {
      title: locales.default.RECOMMEND,
      page: 'recommend',
      icon: tabIcons.default.DATE
    }, {
      title: locales.default.FAVS,
      page: 'favs',
      icon: tabIcons.default.FAVS
    }, {
      title: locales.default.RADIOS,
      page: 'radio',
      icon: tabIcons.default.RADIO
    }, {
      title: locales.default.PRIVATE_FM,
      page: 'privateFM',
      icon: tabIcons.default.FM
    }, {
      title: locales.default.HOT_PLAYLISTS,
      page: 'hotPlaylist',
      icon: tabIcons.default.PLAY_LIST
    }, {
      title: locales.default.CHARTS,
      page: 'charts',
      icon: tabIcons.default.CHARTS
    }, {
      title: locales.default.SUB_NEW_SONGS,
      page: 'subNewSongs',
      icon: tabIcons.default.SUB_NEW_SONGS
    }],
    apis: ['custom', 'netEase', 'qqMusic']
  };
exports.default = f;
