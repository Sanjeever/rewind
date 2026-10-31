import {responses} from './responses';
import type {TrackId} from '../track';
interface SearchRequest {
  keywords: string;
  type?: number;
  limit?: number;
  offset?: number;
}
interface AudioRequest {
  id?: TrackId;
  ids?: TrackId[];
  br?: number;
}
interface CommentRequest {
  id: TrackId;
  limit?: number;
  offset?: number;
}
import * as utils from '../../utils/index';
import * as types from '../../utils/types';
import * as http from './http';
let u: AbortController | null = null;
const l = () => {
  if (u) {
    u.abort();
    u = null;
  }
  u = new AbortController();
  return u;
};
const c = <T>(tracks: T[]) => {
  const e_length = tracks.length;
  if (e_length <= 1000) {
    return [tracks];
  }
  const n: T[][] = [];
  for (let r = Math.ceil(e_length / 1000), i = 1; i <= r; i++) {
    n.push(tracks.slice(1000 * (i - 1), 1000 * i));
  }
  return n;
};
const m = new (class NeteaseService {
  login_out = function () {
    return http.cryptoRequest(responses.login_out, '/weapi/logout', {
      csrf_token: '',
    });
  };
  login_cellphone = function (phone: string, password: string) {
    const r = {
      phone: phone,
      password: utils.md5.hex_md5(password),
      rememberLogin: 'true',
    };
    return http.cryptoRequest(responses.login_cellphone, '/weapi/login/cellphone', r);
  };
  login_email = function (username: string, password: string) {
    const r = {
      username: username,
      password: utils.md5.hex_md5(password),
      rememberLogin: 'true',
    };
    return http.cryptoRequest(responses.login_email, '/weapi/login', r);
  };
  login_refresh = function () {
    return http.cryptoRequest(responses.login_refresh, '/weapi/login/token/refresh', {
      csrf_token: '',
    });
  };
  daily_signin = function (type = 0) {
    return http.request(responses.daily_signin, '/api/point/dailyTask', `type=${type}`);
  };
  user_playlist = function (userId: TrackId) {
    const t = `offset=0&uid=${userId}&limit=1000`;
    return http.request(responses.user_playlist, '/api/user/playlist', t);
  };
  user_detail = function (userId: TrackId) {
    return http.request(responses.user_detail, `/api/v1/user/detail/${userId}`, '');
  };
  user_follows = function (userId: TrackId, offset = 0, limit = 30) {
    const t = `offset=${offset}&limit=${limit}`;
    const r = `/api/user/getfollows/${userId}`;
    return http.request(responses.user_follows, r, t);
  };
  user_followeds = function (userId: TrackId, offset = 0, limit = 30) {
    const t = `userId=${userId}&offset=${offset}&limit=${limit}`;
    return http.request(responses.user_followeds, '/api/user/getfolloweds', t);
  };
  playlist_detail = async (id: TrackId, loadAll = false) => {
    const result = await http.request(
      responses.playlist_detail,
      '/api/v6/playlist/detail',
      `id=${id}&n=1000&limit=1000`,
    );
    const playlist = result?.playlist;
    if (!playlist) {
      return result;
    }
    if (!playlist.tracks || !playlist.trackIds) throw new Error('网易云歌单响应缺少歌曲或索引');
    const remaining = playlist.trackIds.slice(1000);
    if (playlist.tracks.length < playlist.trackIds.length && remaining.length) {
      const more = () => this.song_detail(remaining);
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
  song_detail = async (
    tracks: {
      id: TrackId;
    }[],
  ) => {
    if (!tracks?.length) {
      return;
    }
    const results = await Promise.all(
      c(tracks).map((group) =>
        http.cryptoRequest(responses.song_detail, '/weapi/v3/song/detail', {
          c: JSON.stringify(
            group.map((track) => ({
              id: track.id,
            })),
          ),
        }),
      ),
    );
    return {
      songs: results.flatMap((response) => {
        if (!response.songs) throw new Error(`网易云歌曲详情失败（${response.code}）`);
        return response.songs;
      }),
    };
  };
  search = function ({keywords, type = 1, limit = 30, offset = 0}: SearchRequest) {
    return http.cryptoRequest(responses.search, '/weapi/search/get', {
      s: keywords.replace(' ', ''),
      type,
      limit,
      offset,
    });
  };
  cloud_search = function ({keywords, type = 1, limit = 30, offset = 0}: SearchRequest) {
    return http.cryptoRequest(responses.cloud_search, '/weapi/cloudsearch/pc', {
      s: keywords,
      type: type || 1,
      limit: limit || 30,
      offset: offset || 0,
      total: true,
    });
  };
  search_suggest = function (query: string) {
    const t = `s=${query}`;
    return http.request(responses.search_suggest, '/api/search/suggest/web', t);
  };
  artist = function (id: TrackId) {
    if (id) {
      return http.request(responses.artist, `/api/artist/${id}`, '');
    }
  };
  artist_album = function (id: TrackId) {
    return http.request(
      responses.artist_album,
      `/api/artist/albums/${id}`,
      'total=true&offset=0&limit=100',
    );
  };
  artist_mv = function (id: TrackId) {
    const t = `artistId=${id}&total=true&offset=0&limit=100`;
    return http.request(responses.artist_mv, '/api/artist/mvs', t);
  };
  album = function (id: TrackId) {
    return http.request(responses.album, `/api/album/${id}`, '');
  };
  musicUrl = function ({id, ids, br = 999000}: AudioRequest) {
    const request = l();
    const a = {
      ids: `[${ids ? ids.join(',') : id}]`,
      br: br || 320000,
    };
    return http.cryptoRequest(responses.musicUrl, '/weapi/song/enhance/player/url', a, request);
  };
  freeMusicUrl = function ({id, ids, br = 320000}: AudioRequest) {
    const request = l();
    const a = `br=${br}&ids=[${ids ? ids.join(',') : id}]`;
    return http.request(responses.freeMusicUrl, '/api/song/enhance/player/url', a, request);
  };
  recommend_songs = function () {
    return http.request(
      responses.recommend_songs,
      '/api/v1/discovery/recommend/songs?total=true',
      '',
    );
  };
  recommend_dislike = function ({id, type}: {id: TrackId; type?: 'song' | 'playlist'}) {
    const n = `resId=${id}&resType=${(type === undefined ? 'song' : type) === 'song' ? 4 : 1000}`;
    return http.request(responses.recommend_dislike, 'api/v2/discovery/recommend/dislike', n);
  };
  recommend_playlists = function () {
    return http.request(responses.recommend_playlists, '/api/v1/discovery/recommend/resource', '');
  };
  likelist = function (userId?: TrackId) {
    const t = `uid=${userId}`;
    return http.request(responses.likelist, '/api/song/like/get', t);
  };
  like = function (options: {id: TrackId; isLike?: boolean}) {
    const e_isLike = options.isLike;
    const r = e_isLike === undefined || e_isLike;
    const n = `trackId=${options.id}&like=${r}`;
    return http.request(responses.like, '/api/radio/like', n);
  };
  msg = function () {
    return http.request(responses.msg, '/api/msg/private/users', 'total=true&limit=50&offset=0');
  };
  msg_history = function ({userId, offset}: {userId: TrackId; offset?: number}) {
    const n = `userId=${userId}&offset=${offset === undefined ? 0 : offset}&limit=50&total=true`;
    return http.request(responses.msg_history, '/api/msg/private/history', n);
  };
  comment = function ({id, limit = 30, offset}: CommentRequest) {
    if (id) {
      const a = `offset=${offset === undefined ? 0 : offset}&limit=${limit}`;
      return http.request(responses.comment, `/api/v1/resource/comments/R_SO_4_${id}`, a);
    }
  };
  comment_radio = function ({id, limit = 30, offset}: CommentRequest) {
    const a = `offset=${offset === undefined ? 0 : offset}&limit=${limit}`;
    return http.request(responses.comment_radio, `/api/v1/resource/comments/A_DJ_1_${id}`, a);
  };
  comment_add = function ({id, text}: {id: TrackId; text: string}) {
    const n = Math.round(Date.now());
    const i = {
      threadId: `R_SO_4_${id}`,
      content: text,
      csrf_token: '',
    };
    return http.cryptoRequest(
      responses.comment_add,
      `/weapi/resource/comments/add/?csrf_token=&timestamp=${n}`,
      i,
    );
  };
  playlist_tracks = function ({
    op = 'add',
    pid,
    tracks,
  }: {
    op?: 'add' | 'del';
    pid: TrackId;
    tracks: TrackId | TrackId[];
  }) {
    const a = types.isArray(tracks) ? [...tracks] : [tracks, tracks];
    const u = `op=${op}&pid=${pid}&tracks=${tracks}&trackIds=[${[...a]}]`;
    return http.request(responses.playlist_tracks, '/api/playlist/manipulate/tracks', u);
  };
  personal_fm = function () {
    return http.request(responses.personal_fm, '/api/v1/radio/get', '');
  };
  charts = function () {
    return http.request(responses.charts, '/api/toplist', '');
  };
  play_count = function (id: TrackId, sourceId: TrackId | undefined, time: number) {
    const n = JSON.stringify([
      {
        action: 'play',
        json: {
          download: 0,
          end: 'playend',
          id: id,
          sourceId: sourceId,
          time: time,
          type: 'song',
          wifi: 0,
        },
      },
    ]);
    const i = `logs=${encodeURI(n)}&timestamp=${Date.now()}`;
    return http.request(responses.play_count, '/api/feedback/weblog', i);
  };
  sublist_artist = function ({offset = 0, limit}: {offset?: number; limit?: number}) {
    const i = `offset=${offset}&limit=${limit === undefined ? 1000 : limit}`;
    return http.request(responses.sublist_artist, '/api/artist/sublist', i);
  };
  sublist_album = function ({offset = 0, limit}: {offset?: number; limit?: number}) {
    const i = `offset=${offset}&limit=${limit === undefined ? 30 : limit}`;
    return http.request(responses.sublist_album, '/api/album/sublist', i);
  };
  subcount = function () {
    return http.cryptoRequest(responses.subcount, '/weapi/subcount', {
      csrf_token: '',
    });
  };
  sublist_artist_add = function ({id, op = 'sub'}: {id: TrackId; op?: 'sub' | 'unsub'}) {
    if (id) {
      const i = Math.round(Date.now());
      const a =
        op === 'sub'
          ? {
              artistId: id,
            }
          : {
              artistIds: [id],
            };
      const s = {
        csrf_token: '',
        ...a,
      };
      return http.cryptoRequest(
        responses.sublist_artist_add,
        `/weapi/artist/${op}?timestamp=${i}`,
        s,
      );
    }
  };
  sublist_album_add = function ({id, op = 'sub'}: {id: TrackId; op?: 'sub' | 'unsub'}) {
    if (id) {
      const i = Math.round(Date.now());
      const a = {
        id,
      };
      const s = {
        csrf_token: '',
        ...a,
      };
      return http.cryptoRequest(
        responses.sublist_album_add,
        `/weapi/album/${op}?timestamp=${i}`,
        s,
      );
    }
  };
  playlist_catalogue = function () {
    const e = Math.round(Date.now());
    return http.cryptoRequest(
      responses.playlist_catalogue,
      `/weapi/playlist/catalogue/v1?timestamp=${e}`,
      {
        csrf_token: '',
      },
    );
  };
  playlist_category = function () {
    const e = Math.round(Date.now());
    return http.cryptoRequest(
      responses.playlist_category,
      `/weapi/playlist/category/list?timestamp=${e}`,
      {
        csrf_token: '',
      },
    );
  };
  topPlaylist = function ({
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
    const l = `?cat=${category}&order=${order}&offset=${offset}&total=9999&limit=${limit === undefined ? 30 : limit}`;
    return http.request(responses.topPlaylist, '/api/playlist/list', l);
  };
  playlist_category_names = [
    {
      name: '全部歌单',
    },
    {
      name: '影视原声',
    },
    {
      name: '华语',
    },
    {
      name: '流行',
    },
    {
      name: '清晨',
    },
    {
      name: '怀旧',
    },
    {
      name: '摇滚',
    },
    {
      name: 'ACG',
    },
    {
      name: '夜晚',
    },
    {
      name: '欧美',
    },
    {
      name: '清新',
    },
    {
      name: '浪漫',
    },
    {
      name: '日语',
    },
    {
      name: '学习',
    },
    {
      name: '校园',
    },
    {
      name: '民谣',
    },
    {
      name: '性感',
    },
    {
      name: '韩语',
    },
    {
      name: '游戏',
    },
    {
      name: '电子',
    },
    {
      name: '工作',
    },
    {
      name: '粤语',
    },
    {
      name: '伤感',
    },
    {
      name: '舞曲',
    },
    {
      name: '70后',
    },
    {
      name: '午休',
    },
    {
      name: '小语种',
    },
    {
      name: '说唱',
    },
    {
      name: '80后',
    },
    {
      name: '下午茶',
    },
    {
      name: '治愈',
    },
    {
      name: '90后',
    },
    {
      name: '轻音乐',
    },
    {
      name: '放松',
    },
    {
      name: '地铁',
    },
    {
      name: '爵士',
    },
    {
      name: '网络歌曲',
    },
    {
      name: '驾车',
    },
    {
      name: '孤独',
    },
    {
      name: 'KTV',
    },
    {
      name: '乡村',
    },
    {
      name: '感动',
    },
    {
      name: '运动',
    },
    {
      name: '旅行',
    },
    {
      name: '经典',
    },
    {
      name: '兴奋',
    },
    {
      name: 'R&B/Soul',
    },
    {
      name: '快乐',
    },
    {
      name: '翻唱',
    },
    {
      name: '古典',
    },
    {
      name: '散步',
    },
    {
      name: '吉他',
    },
    {
      name: '民族',
    },
    {
      name: '安静',
    },
    {
      name: '酒吧',
    },
    {
      name: '思念',
    },
    {
      name: '英伦',
    },
    {
      name: '钢琴',
    },
    {
      name: '金属',
    },
    {
      name: '器乐',
    },
    {
      name: '朋克',
    },
    {
      name: '儿童',
    },
    {
      name: '蓝调',
    },
    {
      name: '榜单',
    },
    {
      name: '雷鬼',
    },
    {
      name: '00后',
    },
    {
      name: '世界音乐',
    },
    {
      name: '拉丁',
    },
    {
      name: '另类/独立',
    },
    {
      name: 'New Age',
    },
    {
      name: '古风',
    },
    {
      name: '后摇',
    },
    {
      name: 'Bossa Nova',
    },
  ];
  lyric = function (id: TrackId) {
    const t = `?os=osx&id=${id}&lv=-1&kv=-1&tv=-1`;
    return http.request(responses.lyric, '/api/song/lyric', t);
  };
  mv = function (id: TrackId) {
    const t = `?id=${id}`;
    return http.request(responses.mv, '/api/mv/detail', t);
  };
  radio_category = function () {
    return fetch('http://music.163.com/api/djradio/category/get')
      .then((e) => e.json().then((value) => responses.radio_category.parse(value)))
      .then((e) => e);
  };
  radio_sublist = function () {
    return http.request(
      responses.radio_sublist,
      '/api/djradio/get/subed',
      '?limit=1000&offset=0&total=true',
    );
  };
  radio_detail = function ({
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
    const u = `radioId=${id}&offset=${offset}&limit=${limit}&asc=${asc === undefined ? 0 : asc}`;
    return http.request(responses.radio_detail, '/api/dj/program/byradio', u);
  };
  radio_hot = function (offset = 0, limit = 30) {
    return fetch(`http://music.163.com/api/djradio/hot/v1?offset=${offset}&limit=${limit}`)
      .then((e) => e.json().then((value) => responses.radio_hot.parse(value)))
      .then((e) => e);
  };
  heart_mode = function (options: {songId: TrackId; playlistId: TrackId}) {
    const e_songId = options.songId;
    const r = `songId=${e_songId}&type=fromPlayOne&playlistId=${options.playlistId}&startMusicId=${e_songId}&count=1`;
    return http.request(responses.heart_mode, '/api/playmode/intelligence/list', r);
  };
  cloud = function (limit = 1000, offset = 0) {
    const e = `limit=${limit}&offset=${offset}`;
    return http.request(responses.cloud, '/api/v1/cloud/get', e);
  };
  listen_record = function (id: TrackId, type = 1) {
    const t = `uid=${id}&type=${type}&timestamp=${Date.now()}`;
    return http.request(responses.listen_record, '/api/v1/play/record', t);
  };
  follow_user = async ({uid, type = 1}: {uid: TrackId; type?: number}) => {
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
  subscribe_playlist = async ({
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
  profile = function (id: TrackId) {
    return http.request(responses.profile, `/api/v1/user/detail/${id}`);
  };
  sub_new_songs = function (limit = 100) {
    const e = {
      limit: limit,
      startTimestamp: Date.now(),
    };
    return http.cryptoRequest(responses.sub_new_songs, '/weapi/sub/artist/new/works/song/list', e);
  };
  sub_new_mv = function (limit = 100) {
    const e = {
      limit: limit,
      startTimestamp: Date.now(),
    };
    return http.cryptoRequest(responses.sub_new_mv, '/weapi/sub/artist/new/works/mv/list', e);
  };
  imgID2url = function (imageId: string, size = 100) {
    if (imageId) {
      const r = '3go8&$8*3*3h0k(2)2';
      const n = Array.from(r).map((e, t) => r.charCodeAt(t));
      const bytes: number[] = [];
      for (
        let i = Array.from(imageId).map((_t, r) => imageId.charCodeAt(r)), o = 0;
        o < i.length;
        o++
      ) {
        const u = 255 & (i[o] ^ n[o % r.length]);
        bytes.push(u);
      }
      const l = bytes.map((e) => String.fromCharCode(e)).join('');
      return `http://p1.music.126.net/${utils.md5.b64_md5(l).replace(/\//g, '_').replace(/\+/g, '-')}==/${imageId}.jpg?param=y${size}y${size}`;
    }
  };
})();
export default m;
