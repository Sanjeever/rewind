import providers from './providers';
import type {ArtworkSize, DisplayTrack, TrackFields} from './track';
import type {Provider} from './providers';
import {
  getAlbum,
  getAlias,
  getApi,
  getImg,
  getSinger,
  getSong,
  getTrackKey,
  getUid,
} from './trackFields';

export {getUid, getTrackKey};

export function extractBasicInfo(song: TrackFields = {}) {
  return {song: getSong(song), album: getAlbum(song), singer: getSinger(song)};
}

export function extractFullInfo(song: TrackFields = {}, size: ArtworkSize = 'small') {
  const api = getApi(song);
  return {
    ...extractBasicInfo(song),
    qqAlbumId: (typeof song.album === 'object' && song.album?.mid) || song.albummid,
    localAlbumId: song.albumId,
    api,
    alias: getAlias(song),
    uid: getUid(song),
    img: getImg(song, size, api),
  };
}

export function normalizeTrack<T extends TrackFields>(
  source: T,
  api: Provider = getApi(source),
): DisplayTrack<T> {
  const singers = getSinger(source);
  return {
    key: getTrackKey(source, api),
    api: source.api || api,
    title: getSong(source),
    artists: Array.isArray(singers)
      ? singers.map((artist) => artist.name)
      : singers
        ? [singers]
        : [],
    album: getAlbum(source),
    artwork: getImg(source, 'small', source.api || api),
    duration:
      source.dt ?? source.duration ?? (source.interval == null ? null : source.interval * 1000),
    source,
  };
}

export function extractSingerItem(song: TrackFields, api: Provider) {
  if (api === providers.netEase) return song.ar || song.artists;
  if (api === providers.qqMusic) return Array.isArray(song.singer) ? song.singer : undefined;
  return null;
}

export function extractSingerName(song: TrackFields, api: Provider) {
  return (
    extractSingerItem(song, api)
      ?.map((artist) => artist.name)
      .join('/') || ''
  );
}

export function extractAlbumName(song: TrackFields, api: Provider) {
  return api === providers.netEase || api === providers.qqMusic ? getAlbum(song) : '';
}

export function extractAlbumItem(song: TrackFields, api: Provider) {
  if (api === providers.netEase) return song.al || song.album;
  if (api === providers.qqMusic)
    return song.album || {albummid: song.albummid, albumname: song.albumname};
  return '';
}
