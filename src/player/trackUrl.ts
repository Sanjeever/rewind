import providers from '../services/providers';
import {Netease, QQMusic, provider} from '../services';
import type {TrackFields} from '../services/track';
import type {Provider} from '../services/providers';

async function neteaseUrl(song: TrackFields, highQuality: boolean) {
  const response = await Netease.musicUrl({id: song.id, br: highQuality ? 320000 : 128000});
  if (response?.code !== 200)
    throw new Error(
      `网易云音源失败（${response?.code ?? '无状态码'}）：${response?.message || '服务拒绝请求'}`,
    );
  const result = response.data?.[0];
  if (!result) throw new Error('网易云音源响应缺少歌曲');
  if (result.freeTrialInfo) throw new Error('网易云歌曲仅提供试听');
  if (!result.url) throw new Error(`网易云未返回播放地址（${result.code ?? '无状态码'}）`);
  return result.url;
}

export default {
  async getUrl(api: Provider, {song}: {song: TrackFields}, highQuality = false) {
    let primaryError;
    try {
      let url;
      if (api === providers.netEase) url = await neteaseUrl(song, highQuality);
      else if (api === providers.qqMusic)
        url = await QQMusic.getMusicUrl((song.songmid || song.mid)!, highQuality, song);
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
        String(primaryError instanceof Error ? primaryError.message : primaryError) +
          '；备用音源：' +
          String(error instanceof Error ? error.message : error),
        {cause: error},
      );
    }
  },
};
