import providers from '../services/providers';
import * as services from '../services';

async function neteaseUrl(id, paid) {
  const response = await (paid ? services.Netease.musicUrl({id}) : services.Netease.freeMusicUrl({id}));
  const song = response?.data?.[0];
  if (!song || (song.freeTrialInfo && !(song.payed > 0))) return null;
  return song.url;
}

export default {
  async getUrl(api, request, allowPaid) {
    const song = request.song;
    let url;
    if (api === providers.netEase) url = await neteaseUrl(song.id, song.fee > 0 && allowPaid === true);
    else if (api === providers.qqMusic) {
      const mid = song.songmid || song.mid;
      if (typeof mid === 'string') url = await services.QQMusic.getMusicUrl(mid);
    }
    if (typeof url !== 'string') url = await services.provider.getUrlFromOther(song, api);
    return url;
  },
};
