Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var providers = babelHelpers.interopRequireDefault(require("../../services/providers")),
  names = babelHelpers.interopRequireDefault(require("../../events/names")),
  locales = babelHelpers.interopRequireDefault(require("../../locales/index")),
  services = require("../../services/index"),
  events = require("../../events/index"),
  utils = require("../../utils/index"),
  queue = babelHelpers.interopRequireDefault(require("../../events/queue")),
  users = babelHelpers.interopRequireDefault(require("../../storage/users")),
  p = function (e, t) {
    for (var a = 0; a < e.length; a++) {
      var r = t[a];
      (null === r || void 0 === r ? void 0 : r.hasOwnProperty('lr')) && (e[a].lastRank = r.lr);
    }
  },
  m = function (e) {
    'subscribe' === e ? toast(locales.default.COLLECT_SUCCESS) : 'unsubscribe' === e && toast(locales.default.DELETE_SUCCESS);
  },
  b = function (e, t) {
    var a, r, n;
    return regeneratorRuntime.async(function (s) {
      for (;;) switch (s.prev = s.next) {
        case 0:
          s.next = 2;
          return regeneratorRuntime.awrap(services.Netease.subscribe_playlist({
            id: e,
            op: t
          }));
        case 2:
          (a = s.sent) && (r = a.code, n = a.msg, 200 === r ? m(t) : toast(n));
        case 4:
        case "end":
          return s.stop();
      }
    }, null, this);
  },
  v = function (e, t) {
    return regeneratorRuntime.async(function (a) {
      for (;;) switch (a.prev = a.next) {
        case 0:
          a.next = 2;
          return regeneratorRuntime.awrap(services.QQMusic.subscribe_playlist({
            id: e,
            op: t
          }));
        case 2:
          a.sent && m(t);
        case 4:
        case "end":
          return a.stop();
      }
    }, null, this);
  },
  g = {
    deleteFromNetease: function (e) {
      var t, a, r;
      return regeneratorRuntime.async(function (n) {
        for (;;) switch (n.prev = n.next) {
          case 0:
            t = e.playlistId;
            a = e.trackid;
            n.next = 3;
            return regeneratorRuntime.awrap(services.Netease.playlist_tracks({
              op: 'del',
              pid: t,
              tracks: a
            }));
          case 3:
            r = n.sent;
            (0, utils.usable)(r) && 200 !== r.code && toast(locales.default.ERROR);
          case 5:
          case "end":
            return n.stop();
        }
      }, null, this);
    },
    deleteFromQQMusic: function (e, t) {
      var a, r, n, s;
      return regeneratorRuntime.async(function (i) {
        for (;;) switch (i.prev = i.next) {
          case 0:
            if (e && t) {
              i.next = 2;
              break;
            }
            return i.abrupt("return");
          case 2:
            i.next = 4;
            return regeneratorRuntime.awrap(users.default.getUserInfo());
          case 4:
            if (!(a = i.sent)) {
              i.next = 10;
              break;
            }
            if (a.qqMusic) {
              i.next = 8;
              break;
            }
            return i.abrupt("return");
          case 8:
            r = a.qqMusic;
            n = r.userId;
            (s = r.cookies) ? services.QQMusic.dislike({
              id: e,
              dirid: t,
              qq: n,
              cookies: s
            }).then(function (e) {
              0 !== e.code && toast(locales.default.ERROR);
            }) : toast(locales.default.ERROR);
          case 10:
          case "end":
            return i.stop();
        }
      }, null, this);
    },
    getFromNetease: function (e) {
      var t, a, r, n, s, i;
      return regeneratorRuntime.async(function (u) {
        for (;;) switch (u.prev = u.next) {
          case 0:
            if (e) {
              u.next = 2;
              break;
            }
            return u.abrupt("return");
          case 2:
            u.next = 4;
            return regeneratorRuntime.awrap(services.Netease.playlist_detail(e));
          case 4:
            if (t = u.sent, a = t.playlist, r = a.tracks, n = a.name, s = a.trackIds, i = t.moreFunc, n.includes('\u699c') && p(r, s), r) {
              u.next = 9;
              break;
            }
            return u.abrupt("return");
          case 9:
            users.default.saveNeteasePlayListCache(e, n, r);
            return u.abrupt("return", {
              id: e,
              name: n,
              tracks: r,
              trackCount: r.length,
              moreFunc: i
            });
          case 11:
          case "end":
            return u.stop();
        }
      }, null, this);
    },
    getFromQQMusic: function (e) {
      var t, a, r, n;
      return regeneratorRuntime.async(function (s) {
        for (;;) switch (s.prev = s.next) {
          case 0:
            if (e) {
              s.next = 2;
              break;
            }
            return s.abrupt("return");
          case 2:
            s.next = 4;
            return regeneratorRuntime.awrap(services.QQMusic.disslist({
              id: e
            }));
          case 4:
            if (t = s.sent) {
              s.next = 7;
              break;
            }
            return s.abrupt("return");
          case 7:
            a = t[0];
            r = a.songlist;
            n = a.dissname;
            return s.abrupt("return", {
              id: e,
              name: n,
              tracks: r,
              trackCount: r.length
            });
          case 10:
          case "end":
            return s.stop();
        }
      }, null, this);
    },
    formatItemData: function (e, t) {
      if (e) {
        var a = {};
        if (t === providers.default.netEase) {
          a.song = e.name;
          a.artist = e.ar ? e.ar : e.artists;
          a.album = e.al ? e.al.name : e.album.name;
          a.showMV = e.mvid || e.mv;
          a.alias = (0, utils.delve)(e, 'tns.0');
        } else if (t === providers.default.qqMusic) {
          var r;
          a.song = e.songname;
          a.artist = e.singer;
          a.album = e.albumname;
          var n = (null === (r = e.mv) || void 0 === r ? void 0 : r.vid) || e.vid;
          n = 'string' == typeof n && n.length > 0;
          a.showMV = n;
        }
        return a;
      }
    },
    onMV: function (e, t) {
      var a;
      if (t === providers.default.netEase) a = e.mv || e.mvid;else if (t === providers.default.qqMusic) {
        var r;
        a = (null === (r = e.mv) || void 0 === r ? void 0 : r.vid) || e.vid;
      }
      queue.default.playMV(a, t);
    },
    addToQueue: function (e, t) {
      (0, events.toInsertToList)({
        data: e,
        api: t
      });
    },
    onDetail: function (e, t, a) {
      var r = a.state,
        n = r.playlistId,
        s = r.api;
      (0, events.toDetailModal)({
        item: e,
        index: t,
        api: s,
        playlistId: n
      });
    },
    playMusic: function (e, t, a) {
      var r = a.state,
        n = r.searching,
        s = r.api,
        i = r.oriList,
        u = r.playlist,
        o = r.showRestore,
        c = r.playlistId,
        d = false === o ? u : i,
        f = t;
      true === n && d.forEach(function (t, a) {
        t.id === e.id && (f = a);
      });
      (0, events.toPlayer)({
        item: e,
        data: d,
        index: f,
        api: s,
        localPath: e.localPath,
        pid: c
      });
      a.collectPlaylistOrder();
    },
    savePic: function (e, t) {
      events.emitter.emit(names.default.SavePicModal, {
        img: e,
        song: t
      });
    },
    onHeartMode: function (e) {
      var t, a, r, n, s, i, d, f, p, m, b, v;
      return regeneratorRuntime.async(function (g) {
        for (;;) switch (g.prev = g.next) {
          case 0:
            if (t = e.state, a = t.heartMode, r = t.playlist, n = t.playlistId, s = t.api, true !== a) {
              g.next = 12;
              break;
            }
            i = utils.random.getInt(0, r.length);
            d = r[i].id;
            g.next = 6;
            return regeneratorRuntime.awrap(services.Netease.heart_mode({
              songId: d,
              playlistId: n
            }));
          case 6:
            if ('500' !== (f = g.sent).code) {
              g.next = 10;
              break;
            }
            toast(locales.default.NETEASE_NOT_LOGIN);
            return g.abrupt("return");
          case 10:
            if ((p = f.data).length > 0) {
              for (m = [], b = 0; b < p.length; b++) {
                v = babelHelpers.objectSpread({
                  id: p[b].id
                }, p[b].songInfo);
                m.push(v);
              }
              (0, events.toPlayer)({
                item: m[0],
                data: m,
                index: 0,
                api: s
              });
            }
          case 12:
          case "end":
            return g.stop();
        }
      }, null, this);
    },
    onSubscribe: function (e, t, a) {
      a === providers.default.netEase ? b(e, t) : a === providers.default.qqMusic && v(e, t);
      users.default.saveUserPlayList([], a);
    }
  };
exports.default = g;
