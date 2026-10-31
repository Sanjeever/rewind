const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _toConsumableArray = require('@babel/runtime/helpers/toConsumableArray');
const _objectSpread = require('@babel/runtime/helpers/objectSpread2');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var utils = require('../../utils/index'),
  types = _interopRequireWildcard(require('../../utils/types')),
  http = require('./http'),
  u = null,
  l = function () {
    u && (u.abort(), (u = null));
    u = new AbortController();
  },
  c = function (e) {
    var t = e.length;
    if (t <= 1e3) return [e];
    for (var r = Math.ceil(t / 1e3), n = [], i = 1; i <= r; i++)
      n.push(e.slice(1e3 * (i - 1), 1e3 * i));
    return n;
  },
  m = new (class NeteaseService {
    constructor() {
      var t = this;
      this.login_out = function () {
        return (0, http.cryptoRequest)('/weapi/logout', {
          csrf_token: '',
        });
      };
      this.login_cellphone = function (e, t) {
        var r = {
          phone: e,
          password: utils.md5.hex_md5(t),
          rememberLogin: 'true',
        };
        return (0, http.cryptoRequest)('/weapi/login/cellphone', r);
      };
      this.login_email = function (e, t) {
        var r = {
          username: e,
          password: utils.md5.hex_md5(t),
          rememberLogin: 'true',
        };
        return (0, http.cryptoRequest)('/weapi/login', r);
      };
      this.login_refresh = function () {
        return (0, http.cryptoRequest)('/weapi/login/token/refresh', {
          csrf_token: '',
        });
      };
      this.daily_signin = function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
        return (0, http.request)('/api/point/dailyTask', 'type=' + e);
      };
      this.user_playlist = function (e) {
        var t = 'offset=0&uid=' + e + '&limit=1000';
        return (0, http.request)('/api/user/playlist', t);
      };
      this.user_detail = function (e) {
        return (0, http.request)('/api/v1/user/detail/' + e, '');
      };
      this.user_follows = function (e) {
        var t =
            'offset=' +
            (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0) +
            '&limit=' +
            (arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 30),
          r = '/api/user/getfollows/' + e;
        return (0, http.request)(r, t);
      };
      this.user_followeds = function (e) {
        var t =
          'userId=' +
          e +
          '&offset=' +
          (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0) +
          '&limit=' +
          (arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 30);
        return (0, http.request)('/api/user/getfolloweds', t);
      };
      this.playlist_detail = async function (id, loadAll = false) {
        const result = await http.request(
          '/api/v6/playlist/detail',
          'id=' + id + '&n=1000&limit=1000',
        );
        const playlist = result?.playlist;
        if (!playlist) return result;
        const remaining = playlist.trackIds.slice(1000);
        if (playlist.tracks.length < playlist.trackIds.length && remaining.length) {
          const more = () => t.song_detail(remaining);
          if (loadAll) {
            const response = await more();
            if (response.songs?.length) playlist.tracks = [...playlist.tracks, ...response.songs];
          } else result.moreFunc = more;
        }
        return result;
      };
      this.song_detail = async function (tracks) {
        if (!tracks?.length) return;
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
        var t = 's=' + e;
        return (0, http.request)('/api/search/suggest/web', t);
      };
      this.artist = function (e) {
        if (e) return (0, http.request)('/api/artist/' + e, '');
      };
      this.artist_album = function (e) {
        return (0, http.request)('/api/artist/albums/' + e, 'total=true&offset=0&limit=100');
      };
      this.artist_mv = function (e) {
        var t = 'artistId=' + e + '&total=true&offset=0&limit=100';
        return (0, http.request)('/api/artist/mvs', t);
      };
      this.album = function (e) {
        return (0, http.request)('/api/album/' + e, '');
      };
      this.musicUrl = function (e) {
        var t = e.id,
          r = e.ids,
          n = e.br,
          i = void 0 === n ? 999e3 : n;
        l();
        var a = {
          ids: '[' + (r ? r.join(',') : t) + ']',
          br: i || 32e4,
        };
        return (0, http.cryptoRequest)('/weapi/song/enhance/player/url', a, u);
      };
      this.freeMusicUrl = function (e) {
        var t = e.id,
          r = e.ids,
          n = e.br,
          i = void 0 === n ? 32e4 : n;
        l();
        var a = 'br=' + i + '&ids=[' + (r ? r.join(',') : t) + ']';
        return (0, http.request)('/api/song/enhance/player/url', a, u);
      };
      this.recommend_songs = function () {
        return (0, http.request)('/api/v1/discovery/recommend/songs?total=true', '');
      };
      this.recommend_dislike = function (e) {
        var t = e.id,
          r = e.type,
          n = 'resId=' + t + '&resType=' + ('song' === (void 0 === r ? 'song' : r) ? 4 : 1e3);
        return (0, http.request)('api/v2/discovery/recommend/dislike', n);
      };
      this.recommend_playlists = function () {
        return (0, http.request)('/api/v1/discovery/recommend/resource', '');
      };
      this.likelist = function (e) {
        var t = 'uid=' + e;
        return (0, http.request)('/api/song/like/get', t);
      };
      this.like = function (e) {
        var t = e.isLike,
          r = void 0 === t || t,
          n = 'trackId=' + e.id + '&like=' + r;
        return (0, http.request)('/api/radio/like', n);
      };
      this.msg = function () {
        return (0, http.request)('/api/msg/private/users', 'total=true&limit=50&offset=0');
      };
      this.msg_history = function (e) {
        var t = e.userId,
          r = e.offset,
          n = 'userId=' + t + '&offset=' + (void 0 === r ? 0 : r) + '&limit=50&total=true';
        return (0, http.request)('/api/msg/private/history', n);
      };
      this.comment = function (e) {
        var t = e.id,
          r = e.limit,
          n = void 0 === r ? 30 : r,
          i = e.offset;
        if (t) {
          var a = 'offset=' + (void 0 === i ? 0 : i) + '&limit=' + n;
          return (0, http.request)('/api/v1/resource/comments/R_SO_4_' + t, a);
        }
      };
      this.comment_radio = function (e) {
        var t = e.id,
          r = e.limit,
          n = void 0 === r ? 30 : r,
          i = e.offset,
          a = 'offset=' + (void 0 === i ? 0 : i) + '&limit=' + n;
        return (0, http.request)('/api/v1/resource/comments/A_DJ_1_' + t, a);
      };
      this.comment_add = function (e) {
        var t = e.id,
          r = e.text,
          n = Math.round(Date.now()),
          i = {
            threadId: 'R_SO_4_' + t,
            content: r,
            csrf_token: '',
          };
        return (0, http.cryptoRequest)(
          '/weapi/resource/comments/add/?csrf_token=&timestamp=' + n,
          i,
        );
      };
      this.playlist_tracks = function (e) {
        var t = e.op,
          r = void 0 === t ? 'add' : t,
          n = e.pid,
          i = e.tracks,
          a = types.isArray(i) ? _toConsumableArray(i) : [i, i],
          u =
            'op=' + r + '&pid=' + n + '&tracks=' + i + '&trackIds=[' + _toConsumableArray(a) + ']';
        return (0, http.request)('/api/playlist/manipulate/tracks', u);
      };
      this.personal_fm = function () {
        return (0, http.request)('/api/v1/radio/get', '');
      };
      this.charts = function () {
        return (0, http.request)('/api/toplist', '');
      };
      this.play_count = function (e, t, r) {
        var n = JSON.stringify([
            {
              action: 'play',
              json: {
                download: 0,
                end: 'playend',
                id: e,
                sourceId: t,
                time: r,
                type: 'song',
                wifi: 0,
              },
            },
          ]),
          i = 'logs=' + encodeURI(n) + '&timestamp=' + Date.now();
        return (0, http.request)('/api/feedback/weblog', i);
      };
      this.sublist_artist = function (e) {
        var t = e.offset,
          r = void 0 === t ? 0 : t,
          n = e.limit,
          i = 'offset=' + r + '&limit=' + (void 0 === n ? 1e3 : n);
        return (0, http.request)('/api/artist/sublist', i);
      };
      this.sublist_album = function (e) {
        var t = e.offset,
          r = void 0 === t ? 0 : t,
          n = e.limit,
          i = 'offset=' + r + '&limit=' + (void 0 === n ? 30 : n);
        return (0, http.request)('/api/album/sublist', i);
      };
      this.subcount = function () {
        return (0, http.cryptoRequest)('/weapi/subcount', {
          csrf_token: '',
        });
      };
      this.sublist_artist_add = function (e) {
        var t = e.id,
          r = e.op,
          n = void 0 === r ? 'sub' : r;
        if (t) {
          var i = Math.round(Date.now()),
            a =
              'sub' === n
                ? {
                    artistId: t,
                  }
                : {
                    artistIds: [t],
                  },
            s = _objectSpread(
              {
                csrf_token: '',
              },
              a,
            );
          return (0, http.cryptoRequest)('/weapi/artist/' + n + '?timestamp=' + i, s);
        }
      };
      this.sublist_album_add = function (e) {
        var t = e.id,
          r = e.op,
          n = void 0 === r ? 'sub' : r;
        if (t) {
          var i = Math.round(Date.now()),
            a = {
              id: t,
            },
            s = _objectSpread(
              {
                csrf_token: '',
              },
              a,
            );
          return (0, http.cryptoRequest)('/weapi/album/' + n + '?timestamp=' + i, s);
        }
      };
      this.playlist_catalogue = function () {
        var e = Math.round(Date.now());
        return (0, http.cryptoRequest)('/weapi/playlist/catalogue/v1?timestamp=' + e, {
          csrf_token: '',
        });
      };
      this.playlist_category = function () {
        var e = Math.round(Date.now());
        return (0, http.cryptoRequest)('/weapi/playlist/category/list?timestamp=' + e, {
          csrf_token: '',
        });
      };
      this.topPlaylist = function (e) {
        var t = e.category,
          r = void 0 === t ? '\u5168\u90e8\u6b4c\u5355' : t,
          n = e.offset,
          i = void 0 === n ? 0 : n,
          a = e.order,
          s = void 0 === a ? 'hot' : a,
          u = e.limit,
          l =
            '?cat=' +
            r +
            '&order=' +
            s +
            '&offset=' +
            i +
            '&total=9999&limit=' +
            (void 0 === u ? 30 : u);
        return (0, http.request)('/api/playlist/list', l);
      };
      this.playlist_category_names = [
        {
          name: '\u5168\u90e8\u6b4c\u5355',
        },
        {
          name: '\u5f71\u89c6\u539f\u58f0',
        },
        {
          name: '\u534e\u8bed',
        },
        {
          name: '\u6d41\u884c',
        },
        {
          name: '\u6e05\u6668',
        },
        {
          name: '\u6000\u65e7',
        },
        {
          name: '\u6447\u6eda',
        },
        {
          name: 'ACG',
        },
        {
          name: '\u591c\u665a',
        },
        {
          name: '\u6b27\u7f8e',
        },
        {
          name: '\u6e05\u65b0',
        },
        {
          name: '\u6d6a\u6f2b',
        },
        {
          name: '\u65e5\u8bed',
        },
        {
          name: '\u5b66\u4e60',
        },
        {
          name: '\u6821\u56ed',
        },
        {
          name: '\u6c11\u8c23',
        },
        {
          name: '\u6027\u611f',
        },
        {
          name: '\u97e9\u8bed',
        },
        {
          name: '\u6e38\u620f',
        },
        {
          name: '\u7535\u5b50',
        },
        {
          name: '\u5de5\u4f5c',
        },
        {
          name: '\u7ca4\u8bed',
        },
        {
          name: '\u4f24\u611f',
        },
        {
          name: '\u821e\u66f2',
        },
        {
          name: '70\u540e',
        },
        {
          name: '\u5348\u4f11',
        },
        {
          name: '\u5c0f\u8bed\u79cd',
        },
        {
          name: '\u8bf4\u5531',
        },
        {
          name: '80\u540e',
        },
        {
          name: '\u4e0b\u5348\u8336',
        },
        {
          name: '\u6cbb\u6108',
        },
        {
          name: '90\u540e',
        },
        {
          name: '\u8f7b\u97f3\u4e50',
        },
        {
          name: '\u653e\u677e',
        },
        {
          name: '\u5730\u94c1',
        },
        {
          name: '\u7235\u58eb',
        },
        {
          name: '\u7f51\u7edc\u6b4c\u66f2',
        },
        {
          name: '\u9a7e\u8f66',
        },
        {
          name: '\u5b64\u72ec',
        },
        {
          name: 'KTV',
        },
        {
          name: '\u4e61\u6751',
        },
        {
          name: '\u611f\u52a8',
        },
        {
          name: '\u8fd0\u52a8',
        },
        {
          name: '\u65c5\u884c',
        },
        {
          name: '\u7ecf\u5178',
        },
        {
          name: '\u5174\u594b',
        },
        {
          name: 'R&B/Soul',
        },
        {
          name: '\u5feb\u4e50',
        },
        {
          name: '\u7ffb\u5531',
        },
        {
          name: '\u53e4\u5178',
        },
        {
          name: '\u6563\u6b65',
        },
        {
          name: '\u5409\u4ed6',
        },
        {
          name: '\u6c11\u65cf',
        },
        {
          name: '\u5b89\u9759',
        },
        {
          name: '\u9152\u5427',
        },
        {
          name: '\u601d\u5ff5',
        },
        {
          name: '\u82f1\u4f26',
        },
        {
          name: '\u94a2\u7434',
        },
        {
          name: '\u91d1\u5c5e',
        },
        {
          name: '\u5668\u4e50',
        },
        {
          name: '\u670b\u514b',
        },
        {
          name: '\u513f\u7ae5',
        },
        {
          name: '\u84dd\u8c03',
        },
        {
          name: '\u699c\u5355',
        },
        {
          name: '\u96f7\u9b3c',
        },
        {
          name: '00\u540e',
        },
        {
          name: '\u4e16\u754c\u97f3\u4e50',
        },
        {
          name: '\u62c9\u4e01',
        },
        {
          name: '\u53e6\u7c7b/\u72ec\u7acb',
        },
        {
          name: 'New Age',
        },
        {
          name: '\u53e4\u98ce',
        },
        {
          name: '\u540e\u6447',
        },
        {
          name: 'Bossa Nova',
        },
      ];
      this.lyric = function (e) {
        var t = '?os=osx&id=' + e + '&lv=-1&kv=-1&tv=-1';
        return (0, http.request)('/api/song/lyric', t);
      };
      this.mv = function (e) {
        var t = '?id=' + e;
        return (0, http.request)('/api/mv/detail', t);
      };
      this.radio_category = function () {
        return fetch('http://music.163.com/api/djradio/category/get')
          .then(function (e) {
            return e.json();
          })
          .then(function (e) {
            return e;
          })
          .catch(function (e) {
            return e;
          });
      };
      this.radio_sublist = function () {
        return (0, http.request)('/api/djradio/get/subed', '?limit=1000&offset=0&total=true');
      };
      this.radio_detail = function (e) {
        var t = e.id,
          r = e.offset,
          n = void 0 === r ? 0 : r,
          i = e.limit,
          a = void 0 === i ? 30 : i,
          s = e.asc,
          u = 'radioId=' + t + '&offset=' + n + '&limit=' + a + '&asc=' + (void 0 === s ? 0 : s);
        return (0, http.request)('/api/dj/program/byradio', u);
      };
      this.radio_hot = function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
          t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 30;
        return fetch('http://music.163.com/api/djradio/hot/v1?offset=' + e + '&limit=' + t)
          .then(function (e) {
            return e.json();
          })
          .then(function (e) {
            return e;
          })
          .catch(function (e) {
            return e;
          });
      };
      this.heart_mode = function (e) {
        var t = e.songId,
          r =
            'songId=' +
            t +
            '&type=fromPlayOne&playlistId=' +
            e.playlistId +
            '&startMusicId=' +
            t +
            '&count=1';
        return (0, http.request)('/api/playmode/intelligence/list', r);
      };
      this.cloud = function () {
        var e =
          'limit=' +
          (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1e3) +
          '&offset=' +
          (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0);
        return (0, http.request)('/api/v1/cloud/get', e);
      };
      this.listen_record = function (e) {
        var t =
          'uid=' +
          e +
          '&type=' +
          (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1) +
          '&timestamp=' +
          Date.now();
        return (0, http.request)('/api/v1/play/record', t);
      };
      this.follow_user = async function ({uid, type = 1}) {
        const csrf = await http.getCsrfToken();
        if (!uid || !csrf) return;
        return http.request(
          '/api/user/' + (type === 1 ? 'follow' : 'delfollow') + '/' + uid,
          'csrf_token=' + csrf,
        );
      };
      this.subscribe_playlist = async function ({id, op = 'subscribe'}) {
        const csrf = await http.getCsrfToken();
        if (!csrf) return;
        return http.request('/api/playlist/' + op, 'id=' + id + '&csrf_token=' + csrf);
      };
      this.profile = function (e) {
        return (0, http.request)('/api/v1/user/detail/' + e);
      };
      this.sub_new_songs = function () {
        var e = {
          limit: arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 100,
          startTimestamp: Date.now(),
        };
        return (0, http.cryptoRequest)('/weapi/sub/artist/new/works/song/list', e);
      };
      this.sub_new_mv = function () {
        var e = {
          limit: arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 100,
          startTimestamp: Date.now(),
        };
        return (0, http.cryptoRequest)('/weapi/sub/artist/new/works/mv/list', e);
      };
      this.imgID2url = function (e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 100;
        if (e) {
          for (
            var r = '3go8&$8*3*3h0k(2)2',
              n = Array.from(r).map(function (e, t) {
                return r.charCodeAt(t);
              }),
              i = Array.from(e).map(function (t, r) {
                return e.charCodeAt(r);
              }),
              s = [],
              o = 0;
            o < i.length;
            o++
          ) {
            var u = 255 & (i[o] ^ n[o % r.length]);
            s.push(u);
          }
          var l = s
            .map(function (e, t) {
              return String.fromCharCode(s[t]);
            })
            .join('');
          return (
            'http://p1.music.126.net/' +
            utils.md5.b64_md5(l).replace(/\//g, '_').replace(/\+/g, '-') +
            '==/' +
            e +
            '.jpg?param=y' +
            t +
            'y' +
            t
          );
        }
      };
    }
  })();
exports.default = m;
