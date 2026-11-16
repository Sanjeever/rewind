import locales from '../../locales/index';
export const FOREGROUND_HEIGHT = 364;
export const sortModeMap = {
  time: 'random',
  random: 'song',
  song: 'singer',
  singer: 'album',
  album: 'time',
} as const;
export const orderTexts = {
  random: locales.RANDOM_ORDER,
  song: locales.SONG_ORDER,
  album: locales.ALBUM_ORDER,
  singer: locales.ARTIST_ORDER,
};
