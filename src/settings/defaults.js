const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.settingsMap = exports.sectionsMap = exports.defaultSettings = void 0;
var locales = _interopRequireDefault(require('../locales/index')),
  n = locales.default.SETTINGS,
  _ = n.NAVBAR_PADDING,
  r = n.DEFAULT_HIGH_QUALITY,
  d = n.DEFAULT_HIGH_QUALITY_SUB,
  T = n.HIDE_STATUS_BAR,
  E = n.IS_ROUND,
  I = n.HIDE_BOTTOM_TIP,
  L = n.HIDE_PLAYING_TIME,
  R = n.AUTO_ERROR_NEXT,
  u = n.HIDE_FLOAT_LYRIC,
  s = n.PLAY_WITH_OTHERS,
  A = n.CLONE_THROUGH_LINKING,
  O = n.RECORD_PLAY_COUNT,
  S = n.RECORD_PLAY_COUNT_SUB,
  P = n.BOTTOM_PADDING,
  N = n.BOTTOM_BLUR,
  D = n.AUTO_SET_PLAYLIST_ORDER,
  h = n.HIDE_MINI_PLAYER_TOP_BORDER,
  H = n.REVERSE_GESTURE_HANDS,
  y = n.HIDE_ROUND_SLIDER,
  U = n.HIDE_MINI_LYRIC,
  B = n.AUTO_LOAD_LAST_PLAYED_TRACKS,
  M = n.HIDE_MINI_LYRIC_TRANS,
  Y = n.DISABLED_ROUTER_TRANSITION,
  C = locales.default.GENERAL,
  c = locales.default.PLAY,
  g = locales.default.PLAYER_UI,
  b = {
    navbarPadding: {
      title: _,
      on: false,
    },
    defaultHighQuality: {
      title: r,
      subtitle: d,
      on: false,
    },
    hideStatusBar: {
      title: T,
      on: false,
    },
    reverseGestureHands: {
      title: H,
      on: false,
    },
    isRound: {
      title: E,
      on: true,
    },
    hideRoundSlider: {
      title: y,
      on: false,
    },
    hideBottomTip: {
      title: I,
      on: true,
    },
    hidePlayingTime: {
      title: L,
      on: true,
    },
    autoErrorNext: {
      title: R,
      on: true,
    },
    hideFloatLyric: {
      title: u,
      on: true,
    },
    playWithOthers: {
      title: s,
      on: false,
    },
    cloneThroughLinking: {
      title: A,
      on: false,
    },
    recordPlayCount: {
      title: O,
      subtitle: S,
      on: false,
    },
    bottomPadding: {
      title: P,
      subtitle: 0,
      on: true,
    },
    bottomBlur: {
      title: N,
      on: true,
    },
    autoSetPlaylistOrder: {
      title: D,
      on: true,
    },
    hideMiniPlayerTopBorder: {
      title: h,
      on: false,
    },
    hideMiniLyric: {
      title: U,
      on: false,
    },
    autoLoadLastPlayedTracks: {
      title: B,
      on: false,
    },
    hideMiniLyricTrans: {
      title: M,
      on: false,
    },
    disabledRouterTransition: {
      title: Y,
      on: true,
    },
  };
exports.defaultSettings = b;
exports.settingsMap = [
  'SECTION_GENERAL',
  'autoSetPlaylistOrder',
  'navbarPadding',
  'bottomPadding',
  'bottomBlur',
  'hideMiniPlayerTopBorder',
  'hideStatusBar',
  'disabledRouterTransition',
  'SECTION_PLAY',
  'autoLoadLastPlayedTracks',
  'defaultHighQuality',
  'autoErrorNext',
  'recordPlayCount',
  'playWithOthers',
  'cloneThroughLinking',
  'SECTION_PLAYER_UI',
  'reverseGestureHands',
  'isRound',
  'hideRoundSlider',
  'hideBottomTip',
  'hidePlayingTime',
  'hideFloatLyric',
  'hideMiniLyric',
  'hideMiniLyricTrans',
];
var G = {
  SECTION_GENERAL: {
    title: C,
  },
  SECTION_PLAY: {
    title: c,
  },
  SECTION_PLAYER_UI: {
    title: g,
  },
};
exports.sectionsMap = G;
