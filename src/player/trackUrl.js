import providers from '../services/providers';
import {Netease, QQMusic, provider} from '../services';

async function neteaseUrl(song, allowPaid) {
  const response = await (song.fee > 0 && allowPaid === true
    ? Netease.musicUrl({id: song.id})
    : Netease.freeMusicUrl({id: song.id}));
  if (response?.code !== 200)
    throw new Error(
      `网易云音源失败（${response?.code ?? '无状态码'}）：${response?.message || '服务拒绝请求'}`,
    );
  const result = response.data?.[0];
  if (!result) throw new Error('网易云音源响应缺少歌曲');
  if (result.freeTrialInfo && !(result.payed > 0)) throw new Error('网易云歌曲仅提供试听');
  if (!result.url) throw new Error(`网易云未返回播放地址（${result.code ?? '无状态码'}）`);
  return result.url;
}

export default {
  async getUrl(api, {song}, allowPaid) {
    let primaryError;
    try {
      let url;
      if (api === providers.netEase) url = await neteaseUrl(song, allowPaid);
      else if (api === providers.qqMusic) url = await QQMusic.getMusicUrl(song.songmid || song.mid);
      else throw new Error('未知音源来源：' + api);
      if (typeof url !== 'string' || !url) throw new Error('来源未返回播放地址');
      return url;
    } catch (error) {
      primaryError = error;
    }
    try {
      const url = await provider.getUrlFromOther(song, api);
      if (typeof url !== 'string' || !url) throw new Error('未找到可播放的匹配歌曲');
      return url;
    } catch (error) {
      throw new AggregateError(
        [primaryError, error],
        primaryError.message + '；备用音源：' + error.message,
        {cause: error},
      );
    }
  },
};
