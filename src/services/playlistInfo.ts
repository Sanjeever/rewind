import type {Playlist} from '../storage/models';
import type {Provider} from './providers';

export function formatPlaylist(item: Playlist, api: Provider) {
  if (api === 'netEase') {
    return {
      title: item.name,
      img: `${item.coverImgUrl}?param=200y200`,
      trackCount: item.trackCount,
    };
  }
  return item.title
    ? {
        title: item.title,
        img: item.picurl || 'http://s4.music.126.net/style/web2/img/default/default_album.jpg',
        trackCount: item.subtitle ? item.subtitle.replace(/首.+/, '') : undefined,
      }
    : {title: item.dissname, img: item.logo, trackCount: item.songnum};
}
