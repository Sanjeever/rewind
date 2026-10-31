import providers from '../../services/providers';
import * as services from '../../services';
import type {Provider} from '../../services/providers';
import type {TrackId} from '../../services/track';
type Request = {api: Provider; id: TrackId};

export default {
  async albums({api, id}: Request) {
    if (api === providers.netEase) {
      const response = await services.Netease.artist_album(id);
      if (!response || !Array.isArray(response.hotAlbums)) throw new Error('读取歌手专辑失败');
      return response.hotAlbums;
    }
    if (api === providers.qqMusic) return services.QQMusic.album(id);
  },
  async mvs({api, id}: Request) {
    if (api === providers.netEase) {
      const response = await services.Netease.artist_mv(id);
      if (!response || !Array.isArray(response.mvs)) throw new Error('读取歌手视频失败');
      return response.mvs;
    }
    if (api === providers.qqMusic) return services.QQMusic.artist_mv(id);
  },
};
