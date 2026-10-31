import providers from './providers.js';
import {
  getAlbum,
  getAlias,
  getApi,
  getImg,
  getSinger,
  getSong,
  getTrackKey,
  getUid,
} from './trackFields.js';

export {getUid, getTrackKey};

export function extractBasicInfo(song = {}) {
  return {song: getSong(song), album: getAlbum(song), singer: getSinger(song)};
}

export function extractFullInfo(song = {}, size = 'small') {
  const api = getApi(song);
  return {
    ...extractBasicInfo(song),
    qqAlbumId: song.album?.mid || song.albummid,
    localAlbumId: song.albumId,
    api,
    alias: getAlias(song),
    uid: getUid(song),
    img: getImg(song, size, api),
  };
}

export function normalizeTrack(source, api = getApi(source)) {
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

export function extractSingerItem(song, api) {
  if (api === providers.netEase) return song.ar || song.artists;
  if (api === providers.qqMusic) return song.singer;
  return null;
}

export function extractSingerName(song, api) {
  return (
    extractSingerItem(song, api)
      ?.map((artist) => artist.name)
      .join('/') || ''
  );
}

export function extractAlbumName(song, api) {
  return api === providers.netEase || api === providers.qqMusic ? getAlbum(song) : '';
}

export function extractAlbumItem(song, api) {
  if (api === providers.netEase) return song.al || song.album;
  if (api === providers.qqMusic)
    return song.album || {albummid: song.albummid, albumname: song.albumname};
  return '';
}
