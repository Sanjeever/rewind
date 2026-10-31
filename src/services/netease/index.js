import * as utils from '../../utils/index';
import * as types from '../../utils/types';
import * as http from './http';
let u = null;
const l = () => {
  if (u) {
    u.abort();
    u = null;
  }
  u = new AbortController();
};
const c = (tracks) => {
  const e_length = tracks.length;
  if (e_length <= 1000) {
    return [tracks];
  }
  for (var r = Math.ceil(e_length / 1000), n = [], i = 1; i <= r; i++) {
    n.push(tracks.slice(1000 * (i - 1), 1000 * i));
  }
  return n;
};
const m = new (class NeteaseService {
  constructor() {
    this.login_out = function () {
      return http.cryptoRequest('/weapi/logout', {
        csrf_token: '',
      });
    };
    this.login_cellphone = function (phone, t) {
      const r = {
        phone,
        password: utils.md5.hex_md5(t),
        rememberLogin: 'true',
      };
      return http.cryptoRequest('/weapi/login/cellphone', r);
    };
    this.login_email = function (username, t) {
      const r = {
        username,
        password: utils.md5.hex_md5(t),
        rememberLogin: 'true',
      };
      return http.cryptoRequest('/weapi/login', r);
    };
    this.login_refresh = function () {
      return http.cryptoRequest('/weapi/login/token/refresh', {
        csrf_token: '',
      });
    };
    this.daily_signin = function (e = 0) {
      return http.request('/api/point/dailyTask', `type=${e}`);
    };
    this.user_playlist = function (e) {
      const t = `offset=0&uid=${e}&limit=1000`;
      return http.request('/api/user/playlist', t);
    };
    this.user_detail = function (e) {
      return http.request(`/api/v1/user/detail/${e}`, '');
    };
    this.user_follows = function (e, _param_1 = 0, _param_2 = 30) {
      const t = `offset=${_param_1}&limit=${_param_2}`;
      const r = `/api/user/getfollows/${e}`;
      return http.request(r, t);
    };
    this.user_followeds = function (e, _param_1 = 0, _param_2 = 30) {
      const t = `userId=${e}&offset=${_param_1}&limit=${_param_2}`;
      return http.request('/api/user/getfolloweds', t);
    };
    this.playlist_detail = async (id, loadAll = false) => {
      const result = await http.request('/api/v6/playlist/detail', `id=${id}&n=1000&limit=1000`);
      const playlist = result?.playlist;
      if (!playlist) {
        return result;
      }
      const remaining = playlist.trackIds.slice(1000);
      if (playlist.tracks.length < playlist.trackIds.length && remaining.length) {
        const more = () => this.song_detail(remaining);
        if (loadAll) {
          const response = await more();
          if (response.songs?.length) {
            playlist.tracks = [...playlist.tracks, ...response.songs];
          }
        } else {
          result.moreFunc = more;
        }
      }
      return result;
    };
    this.song_detail = async (tracks) => {
      if (!tracks?.length) {
        return;
      }
      const responses = await Promise.all(
        c(tracks).map((group) =>
          http.cryptoRequest('/weapi/v3/song/detail', {
            c: JSON.stringify(
              group.map((track) => ({
                id: track.id,
              })),
            ),
          }),
        ),
      );
      return {
        songs: responses.flatMap((response) => response.songs),
      };
    };
    this.search = function ({keywords, type = 1, limit = 30, offset = 0}) {
      return http.cryptoRequest('/weapi/search/get', {
        s: keywords.replace(' ', ''),
        type,
        limit,
        offset,
      });
    };
    this.cloud_search = function ({keywords, type = 1, limit = 30, offset = 0}) {
      return http.cryptoRequest('/weapi/cloudsearch/pc', {
        s: keywords,
        type: type || 1,
        limit: limit || 30,
        offset: offset || 0,
        total: true,
      });
    };
    this.search_suggest = function (e) {
      const t = `s=${e}`;
      return http.request('/api/search/suggest/web', t);
    };
    this.artist = function (e) {
      if (e) {
        return http.request(`/api/artist/${e}`, '');
      }
    };
    this.artist_album = function (e) {
      return http.request(`/api/artist/albums/${e}`, 'total=true&offset=0&limit=100');
    };
    this.artist_mv = function (e) {
      const t = `artistId=${e}&total=true&offset=0&limit=100`;
      return http.request('/api/artist/mvs', t);
    };
    this.album = function (e) {
      return http.request(`/api/album/${e}`, '');
    };
    this.musicUrl = function ({id, ids, br = 999000}) {
      l();
      const a = {
        ids: `[${ids ? ids.join(',') : id}]`,
        br: br || 320000,
      };
      return http.cryptoRequest('/weapi/song/enhance/player/url', a, u);
    };
    this.freeMusicUrl = function ({id, ids, br = 320000}) {
      l();
      const a = `br=${br}&ids=[${ids ? ids.join(',') : id}]`;
      return http.request('/api/song/enhance/player/url', a, u);
    };
    this.recommend_songs = function () {
      return http.request('/api/v1/discovery/recommend/songs?total=true', '');
    };
    this.recommend_dislike = function ({id, type}) {
      const n = `resId=${id}&resType=${(type === undefined ? 'song' : type) === 'song' ? 4 : 1000}`;
      return http.request('api/v2/discovery/recommend/dislike', n);
    };
    this.recommend_playlists = function () {
      return http.request('/api/v1/discovery/recommend/resource', '');
    };
    this.likelist = function (e) {
      const t = `uid=${e}`;
      return http.request('/api/song/like/get', t);
    };
    this.like = function (e) {
      const e_isLike = e.isLike;
      const r = e_isLike === undefined || e_isLike;
      const n = `trackId=${e.id}&like=${r}`;
      return http.request('/api/radio/like', n);
    };
    this.msg = function () {
      return http.request('/api/msg/private/users', 'total=true&limit=50&offset=0');
    };
    this.msg_history = function ({userId, offset}) {
      const n = `userId=${userId}&offset=${offset === undefined ? 0 : offset}&limit=50&total=true`;
      return http.request('/api/msg/private/history', n);
    };
    this.comment = function ({id, limit = 30, offset}) {
      if (id) {
        const a = `offset=${offset === undefined ? 0 : offset}&limit=${limit}`;
        return http.request(`/api/v1/resource/comments/R_SO_4_${id}`, a);
      }
    };
    this.comment_radio = function ({id, limit = 30, offset}) {
      const a = `offset=${offset === undefined ? 0 : offset}&limit=${limit}`;
      return http.request(`/api/v1/resource/comments/A_DJ_1_${id}`, a);
    };
    this.comment_add = function ({id, text}) {
      const n = Math.round(Date.now());
      const i = {
        threadId: `R_SO_4_${id}`,
        content: text,
        csrf_token: '',
      };
      return http.cryptoRequest(`/weapi/resource/comments/add/?csrf_token=&timestamp=${n}`, i);
    };
    this.playlist_tracks = function ({op = 'add', pid, tracks}) {
      const a = types.isArray(tracks) ? [...tracks] : [tracks, tracks];
      const u = `op=${op}&pid=${pid}&tracks=${tracks}&trackIds=[${[...a]}]`;
      return http.request('/api/playlist/manipulate/tracks', u);
    };
    this.personal_fm = function () {
      return http.request('/api/v1/radio/get', '');
    };
    this.charts = function () {
      return http.request('/api/toplist', '');
    };
    this.play_count = function (id, sourceId, time) {
      const n = JSON.stringify([
        {
          action: 'play',
          json: {
            download: 0,
            end: 'playend',
            id,
            sourceId,
            time,
            type: 'song',
            wifi: 0,
          },
        },
      ]);
      const i = `logs=${encodeURI(n)}&timestamp=${Date.now()}`;
      return http.request('/api/feedback/weblog', i);
    };
    this.sublist_artist = function ({offset = 0, limit}) {
      const i = `offset=${offset}&limit=${limit === undefined ? 1000 : limit}`;
      return http.request('/api/artist/sublist', i);
    };
    this.sublist_album = function ({offset = 0, limit}) {
      const i = `offset=${offset}&limit=${limit === undefined ? 30 : limit}`;
      return http.request('/api/album/sublist', i);
    };
    this.subcount = function () {
      return http.cryptoRequest('/weapi/subcount', {
        csrf_token: '',
      });
    };
    this.sublist_artist_add = function ({id, op = 'sub'}) {
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
        return http.cryptoRequest(`/weapi/artist/${op}?timestamp=${i}`, s);
      }
    };
    this.sublist_album_add = function ({id, op = 'sub'}) {
      if (id) {
        const i = Math.round(Date.now());
        const a = {
          id,
        };
        const s = {
          csrf_token: '',
          ...a,
        };
        return http.cryptoRequest(`/weapi/album/${op}?timestamp=${i}`, s);
      }
    };
    this.playlist_catalogue = function () {
      const e = Math.round(Date.now());
      return http.cryptoRequest(`/weapi/playlist/catalogue/v1?timestamp=${e}`, {
        csrf_token: '',
      });
    };
    this.playlist_category = function () {
      const e = Math.round(Date.now());
      return http.cryptoRequest(`/weapi/playlist/category/list?timestamp=${e}`, {
        csrf_token: '',
      });
    };
    this.topPlaylist = function ({category = '全部歌单', offset = 0, order = 'hot', limit}) {
      const l = `?cat=${category}&order=${order}&offset=${offset}&total=9999&limit=${limit === undefined ? 30 : limit}`;
      return http.request('/api/playlist/list', l);
    };
    this.playlist_category_names = [
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
    this.lyric = function (e) {
      const t = `?os=osx&id=${e}&lv=-1&kv=-1&tv=-1`;
      return http.request('/api/song/lyric', t);
    };
    this.mv = function (e) {
      const t = `?id=${e}`;
      return http.request('/api/mv/detail', t);
    };
    this.radio_category = function () {
      return fetch('http://music.163.com/api/djradio/category/get')
        .then((e) => e.json())
        .then((e) => e)
        .catch((e) => e);
    };
    this.radio_sublist = function () {
      return http.request('/api/djradio/get/subed', '?limit=1000&offset=0&total=true');
    };
    this.radio_detail = function ({id, offset = 0, limit = 30, asc}) {
      const u = `radioId=${id}&offset=${offset}&limit=${limit}&asc=${asc === undefined ? 0 : asc}`;
      return http.request('/api/dj/program/byradio', u);
    };
    this.radio_hot = function (e = 0, t = 30) {
      return fetch(`http://music.163.com/api/djradio/hot/v1?offset=${e}&limit=${t}`)
        .then((e) => e.json())
        .then((e) => e)
        .catch((e) => e);
    };
    this.heart_mode = function (e) {
      const e_songId = e.songId;
      const r = `songId=${e_songId}&type=fromPlayOne&playlistId=${e.playlistId}&startMusicId=${e_songId}&count=1`;
      return http.request('/api/playmode/intelligence/list', r);
    };
    this.cloud = function (_param_0 = 1000, _param_1 = 0) {
      const e = `limit=${_param_0}&offset=${_param_1}`;
      return http.request('/api/v1/cloud/get', e);
    };
    this.listen_record = function (e, _param_1 = 1) {
      const t = `uid=${e}&type=${_param_1}&timestamp=${Date.now()}`;
      return http.request('/api/v1/play/record', t);
    };
    this.follow_user = async ({uid, type = 1}) => {
      const csrf = await http.getCsrfToken();
      if (!uid || !csrf) {
        return;
      }
      return http.request(
        `/api/user/${type === 1 ? 'follow' : 'delfollow'}/${uid}`,
        `csrf_token=${csrf}`,
      );
    };
    this.subscribe_playlist = async ({id, op = 'subscribe'}) => {
      const csrf = await http.getCsrfToken();
      if (!csrf) {
        return;
      }
      return http.request(`/api/playlist/${op}`, `id=${id}&csrf_token=${csrf}`);
    };
    this.profile = function (e) {
      return http.request(`/api/v1/user/detail/${e}`);
    };
    this.sub_new_songs = function (_param_0 = 100) {
      const e = {
        limit: _param_0,
        startTimestamp: Date.now(),
      };
      return http.cryptoRequest('/weapi/sub/artist/new/works/song/list', e);
    };
    this.sub_new_mv = function (_param_0 = 100) {
      const e = {
        limit: _param_0,
        startTimestamp: Date.now(),
      };
      return http.cryptoRequest('/weapi/sub/artist/new/works/mv/list', e);
    };
    this.imgID2url = function (e, t = 100) {
      if (e) {
        const r = '3go8&$8*3*3h0k(2)2';
        const n = Array.from(r).map((e, t) => r.charCodeAt(t));
        for (
          var i = Array.from(e).map((t, r) => e.charCodeAt(r)), s = [], o = 0;
          o < i.length;
          o++
        ) {
          const u = 255 & (i[o] ^ n[o % r.length]);
          s.push(u);
        }
        const l = s.map((e, t) => String.fromCharCode(s[t])).join('');
        return `http://p1.music.126.net/${utils.md5.b64_md5(l).replace(/\//g, '_').replace(/\+/g, '-')}==/${e}.jpg?param=y${t}y${t}`;
      }
    };
  }
})();
export default m;
