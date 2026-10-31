import {Netease, QQMusic} from './index';
import providers from './providers';
import {normalizeTrack} from './trackInfo';
import type {OnlineProvider} from './providers';
import type {DisplayTrack, TrackFields} from './track';
import type {QQSearchCursor} from './qqmusic/search';
export interface SearchOptions {
  query: string;
  api: OnlineProvider;
  offset?: number;
  cursor?: QQSearchCursor;
}
export interface SearchPage {
  tracks: DisplayTrack[];
  offset: number;
  hasMore: boolean;
  cursor?: QQSearchCursor;
}

export async function searchSongs({
  query,
  api,
  offset = 0,
  cursor,
}: SearchOptions): Promise<SearchPage> {
  let songs: TrackFields[] | undefined;
  let total: number | undefined;
  if (api === providers.netEase) {
    const response = await Netease.cloud_search({keywords: query, offset, limit: 30});
    if (response?.code !== 200)
      throw new Error(`网易云搜索失败（${response?.code ?? '无状态码'}）`);
    songs = response.result?.songs;
    total = response.result?.songCount;
    if (total === 0 && songs == null) songs = [];
  } else if (api === providers.qqMusic) {
    const page = await QQMusic.searchSongPage(query, cursor);
    return {
      tracks: page.songs.map((song) => normalizeTrack(song, api)),
      offset: offset + page.songs.length,
      hasMore: page.cursor !== undefined,
      cursor: page.cursor,
    };
  } else throw new Error('不支持的搜索来源：' + api);
  if (!Array.isArray(songs)) throw new Error('搜索响应缺少歌曲列表');
  return {
    tracks: songs.map((song) => normalizeTrack(song, api)),
    offset: offset + songs.length,
    hasMore: total == null ? songs.length === 30 : offset + songs.length < total,
  };
}
