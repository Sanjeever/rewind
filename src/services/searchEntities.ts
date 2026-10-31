import {Netease, QQMusic} from './index';
import type {OnlineProvider} from './providers';

export type EntityKind = 'playlists' | 'albums' | 'singers' | 'mvs';
export interface SearchEntity {
  albumtype?: string;
  type?: string | number;
  albumname?: string;
  albummid?: string;
  singerMID?: string;
  size?: number;
  pubTime?: string;
  albumMID?: string;
  latest_song?: {song_count: number};
  title?: string;
  date?: string;
  pic?: string;
  vid?: string | number;
  id?: string | number;
  mid?: string;
  v_id?: string;
  name?: string;
  albumSize?: number;
  img1v1Url?: string;
  alias?: string[];
  singerPic?: string;
  singerName?: string;
  albumNum?: number;
  artist?: {name: string};
  picUrl?: string;
  publishTime?: number | string;
  transNames?: string[];
  albumName?: string;
  albumPic?: string;
  publicTime?: string;
  coverImgUrl?: string;
  trackCount?: number;
  creator?: {nickname?: string; name?: string};
  dissname?: string;
  imgurl?: string;
  song_count?: number;
  duration?: number;
  cover?: string;
  mv_name?: string;
  mv_pic_url?: string;
}

const types = {
  playlists: {netease: 1000, qq: 'playlist', field: 'playlists'},
  albums: {netease: 10, qq: 'album', field: 'albums'},
  singers: {netease: 100, qq: 'singer', field: 'artists'},
  mvs: {netease: 1004, qq: 'mv', field: 'mvs'},
} as const;

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('搜索响应格式无效');
  return value as Record<string, unknown>;
}

export async function searchEntities({
  query,
  api,
  kind,
  offset = 0,
}: {
  query: string;
  api: OnlineProvider;
  kind: EntityKind;
  offset?: number;
}): Promise<{items: SearchEntity[]; offset: number; hasMore: boolean}> {
  const type = types[kind];
  let list: unknown;
  let total: unknown;
  if (api === 'netEase') {
    const response = record(await Netease.search({keywords: query, type: type.netease, offset}));
    if (response.code !== 200) throw new Error(`网易云搜索失败（${response.code}）`);
    const result = record(response.result);
    list = result[type.field];
    total =
      result[
        {playlists: 'playlistCount', albums: 'albumCount', singers: 'artistCount', mvs: 'mvCount'}[
          kind
        ]
      ];
    if (total === 0 && list == null) list = [];
  } else {
    const response: unknown =
      kind === 'playlists'
        ? await QQMusic.search_playlist({keywords: query, page: offset / 30, limit: 30})
        : await QQMusic.search({keywords: query, type: type.qq, page: offset / 30 + 1});
    const result = kind === 'playlists' ? record(response) : record(record(response)[type.qq]);
    list = result.list;
    total = result.totalnum ?? result.total;
    if (total === 0 && list == null) list = [];
  }
  if (!Array.isArray(list)) throw new Error('搜索响应缺少结果列表');
  const items = list.map((value: unknown) => record(value) as SearchEntity);
  const next = api === 'qqMusic' ? (Math.floor(offset / 30) + 1) * 30 : offset + items.length;
  return {
    items,
    offset: next,
    hasMore: typeof total === 'number' ? next < total : items.length === 30,
  };
}
