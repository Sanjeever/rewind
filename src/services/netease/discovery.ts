import {responses} from './responses';
import * as http from './http';
import type {TrackId} from '../track';
export const recommend_songs = function () {
  return http.request(
    responses.recommend_songs,
    '/api/v1/discovery/recommend/songs?total=true',
    '',
  );
};
export const recommend_dislike = function ({id, type}: {id: TrackId; type?: 'song' | 'playlist'}) {
  const query = `resId=${id}&resType=${(type === undefined ? 'song' : type) === 'song' ? 4 : 1000}`;
  return http.request(responses.recommend_dislike, 'api/v2/discovery/recommend/dislike', query);
};
export const recommend_playlists = function () {
  return http.request(responses.recommend_playlists, '/api/v1/discovery/recommend/resource', '');
};
export const personal_fm = function () {
  return http.request(responses.personal_fm, '/api/v1/radio/get', '');
};
export const radio_category = function () {
  return fetch('http://music.163.com/api/djradio/category/get')
    .then((e) => e.json().then((value) => responses.radio_category.parse(value)))
    .then((e) => e);
};
export const radio_sublist = function () {
  return http.request(
    responses.radio_sublist,
    '/api/djradio/get/subed',
    '?limit=1000&offset=0&total=true',
  );
};
export const radio_detail = function ({
  id,
  offset = 0,
  limit = 30,
  asc,
}: {
  id: TrackId;
  offset?: number;
  limit?: number;
  asc?: boolean | number;
}) {
  const query = `radioId=${id}&offset=${offset}&limit=${limit}&asc=${asc === undefined ? 0 : asc}`;
  return http.request(responses.radio_detail, '/api/dj/program/byradio', query);
};
export const radio_hot = function (offset = 0, limit = 30) {
  return fetch(`http://music.163.com/api/djradio/hot/v1?offset=${offset}&limit=${limit}`)
    .then((e) => e.json().then((value) => responses.radio_hot.parse(value)))
    .then((e) => e);
};
export const heart_mode = function (options: {songId: TrackId; playlistId: TrackId}) {
  const songId = options.songId;
  const query = `songId=${songId}&type=fromPlayOne&playlistId=${options.playlistId}&startMusicId=${songId}&count=1`;
  return http.request(responses.heart_mode, '/api/playmode/intelligence/list', query);
};
export const sub_new_songs = function (limit = 100) {
  const body = {
    limit: limit,
    startTimestamp: Date.now(),
  };
  return http.cryptoRequest(responses.sub_new_songs, '/weapi/sub/artist/new/works/song/list', body);
};
export const sub_new_mv = function (limit = 100) {
  const body = {
    limit: limit,
    startTimestamp: Date.now(),
  };
  return http.cryptoRequest(responses.sub_new_mv, '/weapi/sub/artist/new/works/mv/list', body);
};
