import {responses} from './responses';
import * as http from './http';
import type {TrackId} from '../track';
interface SearchRequest {
  keywords: string;
  type?: number;
  limit?: number;
  offset?: number;
}
export const search = function ({keywords, type = 1, limit = 30, offset = 0}: SearchRequest) {
  return http.cryptoRequest(responses.search, '/weapi/search/get', {
    s: keywords.replace(' ', ''),
    type,
    limit,
    offset,
  });
};
export const cloud_search = function ({keywords, type = 1, limit = 30, offset = 0}: SearchRequest) {
  return http.cryptoRequest(responses.cloud_search, '/weapi/cloudsearch/pc', {
    s: keywords,
    type: type || 1,
    limit: limit || 30,
    offset: offset || 0,
    total: true,
  });
};
export const search_suggest = function (query: string) {
  const queryString = `s=${query}`;
  return http.request(responses.search_suggest, '/api/search/suggest/web', queryString);
};
export const artist = function (id: TrackId) {
  if (id) {
    return http.request(responses.artist, `/api/artist/${id}`, '');
  }
};
export const artist_album = function (id: TrackId) {
  return http.request(
    responses.artist_album,
    `/api/artist/albums/${id}`,
    'total=true&offset=0&limit=100',
  );
};
export const artist_mv = function (id: TrackId) {
  const query = `artistId=${id}&total=true&offset=0&limit=100`;
  return http.request(responses.artist_mv, '/api/artist/mvs', query);
};
export const album = function (id: TrackId) {
  return http.request(responses.album, `/api/album/${id}`, '');
};
export const charts = function () {
  return http.request(responses.charts, '/api/toplist', '');
};
