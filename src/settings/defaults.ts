import locales from '../locales/index';
const locales_SETTINGS = locales.SETTINGS;
const {
  NAVBAR_PADDING,
  DEFAULT_HIGH_QUALITY,
  DEFAULT_HIGH_QUALITY_SUB,
  HIDE_STATUS_BAR,
  IS_ROUND,
  HIDE_BOTTOM_TIP,
  HIDE_PLAYING_TIME,
  AUTO_ERROR_NEXT,
  HIDE_FLOAT_LYRIC,
  PLAY_WITH_OTHERS,
  CLONE_THROUGH_LINKING,
  RECORD_PLAY_COUNT,
  RECORD_PLAY_COUNT_SUB,
  BOTTOM_PADDING,
  BOTTOM_BLUR,
  AUTO_SET_PLAYLIST_ORDER,
  HIDE_MINI_PLAYER_TOP_BORDER,
  REVERSE_GESTURE_HANDS,
  HIDE_ROUND_SLIDER,
  HIDE_MINI_LYRIC,
  AUTO_LOAD_LAST_PLAYED_TRACKS,
  HIDE_MINI_LYRIC_TRANS,
  DISABLED_ROUTER_TRANSITION,
} = locales_SETTINGS;
const {GENERAL, PLAY, PLAYER_UI} = locales;
export const defaultSettings = {
  navbarPadding: {
    title: NAVBAR_PADDING,
    on: false,
  },
  defaultHighQuality: {
    title: DEFAULT_HIGH_QUALITY,
    subtitle: DEFAULT_HIGH_QUALITY_SUB,
    on: false,
  },
  hideStatusBar: {
    title: HIDE_STATUS_BAR,
    on: false,
  },
  reverseGestureHands: {
    title: REVERSE_GESTURE_HANDS,
    on: false,
  },
  isRound: {
    title: IS_ROUND,
    on: true,
  },
  hideRoundSlider: {
    title: HIDE_ROUND_SLIDER,
    on: false,
  },
  hideBottomTip: {
    title: HIDE_BOTTOM_TIP,
    on: true,
  },
  hidePlayingTime: {
    title: HIDE_PLAYING_TIME,
    on: true,
  },
  autoErrorNext: {
    title: AUTO_ERROR_NEXT,
    on: true,
  },
  hideFloatLyric: {
    title: HIDE_FLOAT_LYRIC,
    on: true,
  },
  playWithOthers: {
    title: PLAY_WITH_OTHERS,
    on: false,
  },
  cloneThroughLinking: {
    title: CLONE_THROUGH_LINKING,
    on: false,
  },
  recordPlayCount: {
    title: RECORD_PLAY_COUNT,
    subtitle: RECORD_PLAY_COUNT_SUB,
    on: false,
  },
  bottomPadding: {
    title: BOTTOM_PADDING,
    subtitle: 0,
    on: true,
  },
  bottomBlur: {
    title: BOTTOM_BLUR,
    on: true,
  },
  autoSetPlaylistOrder: {
    title: AUTO_SET_PLAYLIST_ORDER,
    on: true,
  },
  hideMiniPlayerTopBorder: {
    title: HIDE_MINI_PLAYER_TOP_BORDER,
    on: false,
  },
  hideMiniLyric: {
    title: HIDE_MINI_LYRIC,
    on: false,
  },
  autoLoadLastPlayedTracks: {
    title: AUTO_LOAD_LAST_PLAYED_TRACKS,
    on: false,
  },
  hideMiniLyricTrans: {
    title: HIDE_MINI_LYRIC_TRANS,
    on: false,
  },
  disabledRouterTransition: {
    title: DISABLED_ROUTER_TRANSITION,
    on: true,
  },
};
export type Settings = {[K in keyof typeof defaultSettings]: boolean};
export const settingsMap = [
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
export const sectionsMap = {
  SECTION_GENERAL: {
    title: GENERAL,
  },
  SECTION_PLAY: {
    title: PLAY,
  },
  SECTION_PLAYER_UI: {
    title: PLAYER_UI,
  },
};
