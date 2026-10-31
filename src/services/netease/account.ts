import {responses} from './responses';
import * as http from './http';
import type {TrackId} from '../track';
import md5 from '../../utils/md5';
export const login_out = function () {
  return http.cryptoRequest(responses.login_out, '/weapi/logout', {
    csrf_token: '',
  });
};
export const login_cellphone = function (phone: string, password: string) {
  const credentials = {
    phone: phone,
    password: md5.hex_md5(password),
    rememberLogin: 'true',
  };
  return http.cryptoRequest(responses.login_cellphone, '/weapi/login/cellphone', credentials);
};
export const login_email = function (username: string, password: string) {
  const credentials = {
    username: username,
    password: md5.hex_md5(password),
    rememberLogin: 'true',
  };
  return http.cryptoRequest(responses.login_email, '/weapi/login', credentials);
};
export const login_refresh = function () {
  return http.cryptoRequest(responses.login_refresh, '/weapi/login/token/refresh', {
    csrf_token: '',
  });
};
export const daily_signin = function (type = 0) {
  return http.request(responses.daily_signin, '/api/point/dailyTask', `type=${type}`);
};
export const user_playlist = function (userId: TrackId) {
  const query = `offset=0&uid=${userId}&limit=1000`;
  return http.request(responses.user_playlist, '/api/user/playlist', query);
};
export const user_detail = function (userId: TrackId) {
  return http.request(responses.user_detail, `/api/v1/user/detail/${userId}`, '');
};
export const user_follows = function (userId: TrackId, offset = 0, limit = 30) {
  const query = `offset=${offset}&limit=${limit}`;
  const path = `/api/user/getfollows/${userId}`;
  return http.request(responses.user_follows, path, query);
};
export const user_followeds = function (userId: TrackId, offset = 0, limit = 30) {
  const query = `userId=${userId}&offset=${offset}&limit=${limit}`;
  return http.request(responses.user_followeds, '/api/user/getfolloweds', query);
};
export const likelist = function (userId?: TrackId) {
  const query = `uid=${userId}`;
  return http.request(responses.likelist, '/api/song/like/get', query);
};
export const like = function (options: {id: TrackId; isLike?: boolean}) {
  const requestedLike = options.isLike;
  const liked = requestedLike === undefined || requestedLike;
  const query = `trackId=${options.id}&like=${liked}`;
  return http.request(responses.like, '/api/radio/like', query);
};
export const msg = function () {
  return http.request(responses.msg, '/api/msg/private/users', 'total=true&limit=50&offset=0');
};
export const msg_history = function ({userId, offset}: {userId: TrackId; offset?: number}) {
  const query = `userId=${userId}&offset=${offset === undefined ? 0 : offset}&limit=50&total=true`;
  return http.request(responses.msg_history, '/api/msg/private/history', query);
};
export const sublist_artist = function ({offset = 0, limit}: {offset?: number; limit?: number}) {
  const query = `offset=${offset}&limit=${limit === undefined ? 1000 : limit}`;
  return http.request(responses.sublist_artist, '/api/artist/sublist', query);
};
export const sublist_album = function ({offset = 0, limit}: {offset?: number; limit?: number}) {
  const query = `offset=${offset}&limit=${limit === undefined ? 30 : limit}`;
  return http.request(responses.sublist_album, '/api/album/sublist', query);
};
export const subcount = function () {
  return http.cryptoRequest(responses.subcount, '/weapi/subcount', {
    csrf_token: '',
  });
};
export const sublist_artist_add = function ({id, op = 'sub'}: {id: TrackId; op?: 'sub' | 'unsub'}) {
  if (id) {
    const timestamp = Math.round(Date.now());
    const artistIds =
      op === 'sub'
        ? {
            artistId: id,
          }
        : {
            artistIds: [id],
          };
    const body = {
      csrf_token: '',
      ...artistIds,
    };
    return http.cryptoRequest(
      responses.sublist_artist_add,
      `/weapi/artist/${op}?timestamp=${timestamp}`,
      body,
    );
  }
};
export const sublist_album_add = function ({id, op = 'sub'}: {id: TrackId; op?: 'sub' | 'unsub'}) {
  if (id) {
    const timestamp = Math.round(Date.now());
    const albumId = {
      id,
    };
    const body = {
      csrf_token: '',
      ...albumId,
    };
    return http.cryptoRequest(
      responses.sublist_album_add,
      `/weapi/album/${op}?timestamp=${timestamp}`,
      body,
    );
  }
};
export const cloud = function (limit = 1000, offset = 0) {
  const query = `limit=${limit}&offset=${offset}`;
  return http.request(responses.cloud, '/api/v1/cloud/get', query);
};
export const listen_record = function (id: TrackId, type = 1) {
  const query = `uid=${id}&type=${type}&timestamp=${Date.now()}`;
  return http.request(responses.listen_record, '/api/v1/play/record', query);
};
export const follow_user = async ({uid, type = 1}: {uid: TrackId; type?: number}) => {
  const csrf = await http.getCsrfToken();
  if (!uid || !csrf) {
    return;
  }
  return http.request(
    responses.follow_user,
    `/api/user/${type === 1 ? 'follow' : 'delfollow'}/${uid}`,
    `csrf_token=${csrf}`,
  );
};
export const profile = function (id: TrackId) {
  return http.request(responses.profile, `/api/v1/user/detail/${id}`);
};
