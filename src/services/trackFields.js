import providers from './providers.js';
import artwork from './artistInfo.js';

export const getUid = song => song.songmid || song.mid || song.id;
export const getSong = song => song.name || song.songname || song.song || song.title || song.filename;
export const getSinger = song => song.singer || song.artists || song.ar;
export const getAlias = song => song.tns?.[0] || song.alias?.[0] || song.transName;

export function getAlbum(song) {
  return song.album?.name || song.al?.name || song.albumname || (typeof song.album === 'string' ? song.album : '');
}

export function getApi(song) {
  if (song.api) return song.api;
  if (song.localAlbumId != null || song.albumId != null || song.path) return providers.local;
  if (song.qqAlbumId || song.album?.mid || song.albummid || song.songmid || song.mid) return providers.qqMusic;
  return providers.netEase;
}

export function getTrackKey(song, api = getApi(song)) {
  const provider = song.api || api;
  const id = provider === providers.local ? song.path || song.id : getUid(song);
  return provider + ':' + id;
}

export function getImg(song, size, api) {
  return artwork[api](song, size) || 'https://s1.ax1x.com/2020/04/01/G8Tdx0.png';
}
