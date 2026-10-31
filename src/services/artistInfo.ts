import type {ArtworkSize, TrackFields} from './track';
export default {
  netEase(song: TrackFields, size: ArtworkSize) {
    const image =
      (typeof song.album === 'object' && song.album?.picUrl) ||
      (!Array.isArray(song.al) && song.al?.picUrl) ||
      song.coverUrl;
    if (image) return image + (size === 'small' ? '?param=100y100' : '?param=1000y1000');
  },
  qqMusic(song: TrackFields, size: ArtworkSize) {
    const albumId = (typeof song.album === 'object' && song.album?.mid) || song.albummid;
    const artistId = Array.isArray(song.singer) ? song.singer[0]?.mid : undefined;
    if (albumId && albumId !== '001ZaCQY2OxVMg') {
      return `https://y.gtimg.cn/music/photo_new/T002R${size === 'small' ? '150x150' : '500x500'}M000${albumId}.jpg`;
    }
    if (artistId)
      return `https://y.gtimg.cn/music/photo_new/T001R${size === 'small' ? '150x150' : '500x500'}M000${artistId}.jpg`;
  },
  local(song: TrackFields) {
    if (!song.img) return null;
    return /^(content:|https?:|data:)/.test(song.img)
      ? song.img
      : 'data:image/png;base64,' + song.img;
  },
};
