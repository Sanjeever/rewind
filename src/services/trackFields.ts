import providers from './providers';
import artwork from './artistInfo';
import type {ArtworkSize, TrackFields} from './track';
import type {Provider} from './providers';

export const getUid = (song: TrackFields) => song.songmid || song.mid || song.id;
export const getSong = (song: TrackFields) =>
  song.name || song.songname || song.song || song.title || song.filename;
export const getSinger = (song: TrackFields) => song.singer || song.artists || song.ar;
export const getAlias = (song: TrackFields) => song.tns?.[0] || song.alias?.[0] || song.transName;

export function getAlbum(song: TrackFields) {
  return (
    (typeof song.album === 'object' && song.album?.name) ||
    (!Array.isArray(song.al) && song.al?.name) ||
    song.albumname ||
    (typeof song.album === 'string' ? song.album : '')
  );
}

export function getApi(song: TrackFields): Provider {
  if (song.api) return song.api;
  if (song.localAlbumId != null || song.albumId != null || song.path) return providers.local;
  if (
    song.qqAlbumId ||
    (typeof song.album === 'object' && song.album?.mid) ||
    song.albummid ||
    song.songmid ||
    song.mid
  )
    return providers.qqMusic;
  return providers.netEase;
}

export function getTrackKey(song: TrackFields, api: Provider = getApi(song)) {
  const provider = song.api || api;
  const id = provider === providers.local ? song.path || song.id : getUid(song);
  return provider + ':' + id;
}

export function getImg(song: TrackFields, size: ArtworkSize, api: Provider) {
  return artwork[api](song, size) || 'https://s1.ax1x.com/2020/04/01/G8Tdx0.png';
}
