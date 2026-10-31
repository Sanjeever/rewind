import {responses} from './responses';
import * as http from './http';
import type {TrackId} from '../track';
import type * as z from 'zod/mini';
import type {TrackFields} from '../track';
import {song_detail} from './tracks';
export const playlist_detail = async (id: TrackId, loadAll = false) => {
  const result: z.output<typeof responses.playlist_detail> & {
    moreFunc?: () => Promise<{songs: TrackFields[]} | undefined>;
  } = await http.eapiRequest(responses.playlist_detail, '/api/v6/playlist/detail', {
    id,
    n: 1000,
    limit: 1000,
  });
  const playlist = result?.playlist;
  if (!playlist) {
    return result;
  }
  if (!playlist.tracks || !playlist.trackIds) throw new Error('网易云歌单响应缺少歌曲或索引');
  const remaining = playlist.trackIds.slice(1000);
  if (playlist.tracks.length < playlist.trackIds.length && remaining.length) {
    const more = () => song_detail(remaining);
    if (loadAll) {
      const response = await more();
      if (response?.songs?.length) {
        playlist.tracks = [...playlist.tracks, ...response.songs];
      }
    } else {
      result.moreFunc = more;
    }
  }
  return result;
};
export const playlist_tracks = function ({
  op = 'add',
  pid,
  tracks,
}: {
  op?: 'add' | 'del';
  pid: TrackId;
  tracks: TrackId | TrackId[];
}) {
  const trackIds = Array.isArray(tracks) ? [...tracks] : [tracks, tracks];
  const query = `op=${op}&pid=${pid}&tracks=${tracks}&trackIds=[${[...trackIds]}]`;
  return http.request(responses.playlist_tracks, '/api/playlist/manipulate/tracks', query);
};
export const playlist_catalogue = function () {
  const timestamp = Math.round(Date.now());
  return http.cryptoRequest(
    responses.playlist_catalogue,
    `/weapi/playlist/catalogue/v1?timestamp=${timestamp}`,
    {
      csrf_token: '',
    },
  );
};
export const playlist_category = function () {
  const timestamp = Math.round(Date.now());
  return http.cryptoRequest(
    responses.playlist_category,
    `/weapi/playlist/category/list?timestamp=${timestamp}`,
    {
      csrf_token: '',
    },
  );
};
export const topPlaylist = function ({
  category = '全部歌单',
  offset = 0,
  order = 'hot',
  limit,
}: {
  category?: string;
  offset?: number;
  order?: string;
  limit?: number;
}) {
  const query = `?cat=${category}&order=${order}&offset=${offset}&total=9999&limit=${limit === undefined ? 30 : limit}`;
  return http.request(responses.topPlaylist, '/api/playlist/list', query);
};
export const subscribe_playlist = async ({
  id,
  op = 'subscribe',
}: {
  id: TrackId;
  op?: 'subscribe' | 'unsubscribe';
}) => {
  const csrf = await http.getCsrfToken();
  if (!csrf) {
    return;
  }
  return http.request(
    responses.subscribe_playlist,
    `/api/playlist/${op}`,
    `id=${id}&csrf_token=${csrf}`,
  );
};
