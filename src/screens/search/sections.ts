import locales from '../../locales/index';
export const SECTION_NAMES = {
  songs: locales.ARTIST_SONGS,
  albums: locales.ARTIST_ALBUM,
  artists: locales.ARTIST,
  history: locales.HISTORY,
};
export const SECTION_KEYS = {
  songs: 'songs',
  albums: 'albums',
  artists: 'artists',
  history: 'history',
} as const;
export type SectionKey = keyof typeof SECTION_NAMES;
export const SECTIONS = Object.keys(SECTION_NAMES) as SectionKey[];
