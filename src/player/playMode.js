Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  services = require("../services/index"),
  types = babelHelpers.interopRequireWildcard(require("../utils/types")),
  users = babelHelpers.interopRequireDefault(require("../storage/users")),
  l = function (e) {
    var t, r;
    return regeneratorRuntime.async(function (n) {
      for (;;) switch (n.prev = n.next) {
        case 0:
          n.next = 2;
          return regeneratorRuntime.awrap(services.Netease.likelist(e));
        case 2:
          t = n.sent;
          types.isObject(t) && (r = t.ids, 200 === t.code && users.default.saveUserLikeList(r, providers.default.netEase));
        case 4:
        case "end":
          return n.stop();
      }
    }, null, this);
  },
  d = function () {
    var e, t, r, n;
    return regeneratorRuntime.async(function (a) {
      for (;;) switch (a.prev = a.next) {
        case 0:
          a.next = 2;
          return regeneratorRuntime.awrap(users.default.getUserPlayList());
        case 2:
          if (e = a.sent, types.isObject(e)) {
            a.next = 5;
            break;
          }
          return a.abrupt("return");
        case 5:
          if (!e.qqMusic) {
            a.next = 13;
            break;
          }
          a.next = 8;
          return regeneratorRuntime.awrap(services.QQMusic.disslist(e.qqMusic[0].id));
        case 8:
          t = e[0];
          r = t.songlist;
          n = [];
          r.map(function (e) {
            n.push(e.songmid);
          });
          users.default.saveUserLikeList(n, providers.default.qqMusic);
        case 13:
        case "end":
          return a.stop();
      }
    }, null, this);
  },
  f = function (e) {
    var t,
      r,
      n,
      a,
      s,
      d,
      f,
      p = arguments;
    return regeneratorRuntime.async(function (b) {
      for (;;) switch (b.prev = b.next) {
        case 0:
          t = !(p.length > 1 && void 0 !== p[1]) || p[1];
          r = e.id;
          b.next = 4;
          return regeneratorRuntime.awrap(services.Netease.like({
            id: r,
            isLike: t
          }));
        case 4:
          if (n = b.sent, !types.isObject(n)) {
            b.next = 26;
            break;
          }
          if (200 !== (a = n.code)) {
            b.next = 11;
            break;
          }
          l();
          b.next = 26;
          break;
        case 11:
          if (512 !== a) {
            b.next = 15;
            break;
          }
          toast(locales.default.PAIDSONG_CANT_COLLECT);
          b.next = 26;
          break;
        case 15:
          if (-460 !== a) {
            b.next = 26;
            break;
          }
          b.next = 18;
          return regeneratorRuntime.awrap(users.default.getUserPlayList());
        case 18:
          if (null === (d = b.sent) || void 0 === d ? void 0 : d.netEase) {
            b.next = 21;
            break;
          }
          return b.abrupt("return");
        case 21:
          if (!(f = null === (s = d.netEase[0]) || void 0 === s ? void 0 : s.id)) {
            b.next = 26;
            break;
          }
          b.next = 25;
          return regeneratorRuntime.awrap(services.Netease.playlist_tracks({
            op: t ? 'add' : 'del',
            pid: f,
            tracks: r
          }));
        case 25:
          b.sent;
        case 26:
        case "end":
          return b.stop();
      }
    }, null, this);
  },
  p = function (e) {
    var t,
      r,
      n,
      a,
      s,
      l,
      f,
      p,
      b = arguments;
    return regeneratorRuntime.async(function (k) {
      for (;;) switch (k.prev = k.next) {
        case 0:
          t = !(b.length > 1 && void 0 !== b[1]) || b[1];
          r = e.mid || e.songmid;
          n = e.id || e.songid;
          k.next = 5;
          return regeneratorRuntime.awrap(users.default.getUserInfo());
        case 5:
          if (a = k.sent, types.isObject(a)) {
            k.next = 8;
            break;
          }
          return k.abrupt("return");
        case 8:
          if (s = a.qqMusic, l = s.userId, !(f = s.cookies)) {
            k.next = 21;
            break;
          }
          if (true !== t) {
            k.next = 16;
            break;
          }
          k.next = 13;
          return regeneratorRuntime.awrap(services.QQMusic.like({
            songmid: r,
            qq: l,
            cookies: f
          }));
        case 13:
          d();
          k.next = 21;
          break;
        case 16:
          k.next = 18;
          return regeneratorRuntime.awrap(services.QQMusic.dislike({
            id: n,
            qq: l,
            cookies: f
          }));
        case 18:
          p = k.sent;
          0 !== p.code && toast(locales.default.ERROR);
        case 21:
        case "end":
          return k.stop();
      }
    }, null, this);
  },
  b = {
    onLike: function (e, t) {
      var r = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2];
      switch (t) {
        case providers.default.netEase:
          f(e, !r);
          users.default.removeNetEasePlaylistCache();
          break;
        case providers.default.qqMusic:
          p(e, !r);
      }
    }
  };
exports.default = b;
