import providers from './providers';
import Netease from './netease';
import QQMusic from './qqmusic';
import {getSong, getSinger} from './trackFields';
import {findMatchingTrack} from './trackMatch';
import type {TrackFields} from './track';
import type {Provider} from './providers';

function describe(song: TrackFields) {
  const title = getSong(song);
  const artists = getSinger(song);
  const singer = Array.isArray(artists) ? artists[0]?.name : artists;
  return {title, singer, query: singer ? title + ' - ' + singer : title};
}

async function findNetease(song: TrackFields, alternate = false) {
  const query = describe(song).query;
  if (query === undefined) throw new Error('歌曲缺少名称');
  const response = await Netease.search({keywords: query});
  if (response?.code !== 200) throw new Error('网易云备用搜索失败（' + response?.code + '）');
  const songs = response.result?.songs;
  if (!Array.isArray(songs)) {
    if (response.result?.songCount === 0) return null;
    throw new Error('网易云备用搜索响应缺少歌曲');
  }
  const match = findMatchingTrack(
    song,
    alternate ? songs.filter((item) => String(item.id) !== String(song.id)) : songs,
  );
  if (!match) return null;
  const result = await Netease.freeMusicUrl({id: match.id});
  if (result?.code !== 200)
    throw new Error(
      '网易云备用音源失败（' + result?.code + '）：' + (result?.message || '服务拒绝请求'),
    );
  const audio = result.data?.[0];
  if (!audio?.url) throw new Error('网易云备用音源未返回地址（' + audio?.code + '）');
  if (audio.freeTrialInfo) throw new Error('网易云备用音源仅提供试听');
  return audio.url;
}

async function findQQ(song: TrackFields) {
  const {title, query} = describe(song);
  if (title === undefined || query === undefined) throw new Error('歌曲缺少名称');
  const candidates = await QQMusic.searchSong(query);
  let match = findMatchingTrack(song, candidates);
  if (!match) match = findMatchingTrack(song, await QQMusic.searchSong(title));
  return match ? QQMusic.getMusicUrl((match.songmid || match.mid)!) : null;
}

export default {
  async getUrlFromOther(song: TrackFields, api: Provider = providers.netEase) {
    if (api === providers.qqMusic) return findNetease(song);
    if (api !== providers.netEase) throw new Error('未知备用音源来源：' + api);
    let qqError;
    try {
      const url = await findQQ(song);
      if (url) return url;
    } catch (error) {
      qqError = error;
    }
    try {
      const url = await findNetease(song, true);
      if (url) return url;
      throw new Error('未找到匹配歌曲');
    } catch (error) {
      if (qqError)
        throw new AggregateError(
          [qqError, error],
          String(qqError instanceof Error ? qqError.message : qqError) +
            '；' +
            String(error instanceof Error ? error.message : error),
          {
            cause: error,
          },
        );
      throw error;
    }
  },
};
