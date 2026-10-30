Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  services = require("../services/index"),
  utils = require("../utils/index"),
  types = babelHelpers.interopRequireWildcard(require("../utils/types")),
  o = function (e, r) {
    return Math.floor(e) === Math.floor(r) || Math.round(e) === Math.round(r);
  },
  l = function () {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [];
    return (arguments.length > 1 ? arguments[1] : void 0).map(function (r) {
      var t = r.total,
        n = e.find(function (e) {
          return t === e.total;
        });
      n && (r.trans = n);
      return r;
    });
  },
  p = function (e) {
    var r, t, n, a;
    return regeneratorRuntime.async(function (u) {
      for (;;) switch (u.prev = u.next) {
        case 0:
          u.next = 2;
          return regeneratorRuntime.awrap(services.QQMusic.getLyric(e));
        case 2:
          if (!(r = u.sent).lyric) {
            u.next = 9;
            break;
          }
          t = r.trans;
          n = r.lyric;
          a = false;
          t && (n = l(t, n), a = true);
          return u.abrupt("return", {
            lyric: n,
            hasTrans: a
          });
        case 9:
        case "end":
          return u.stop();
      }
    }, null, this);
  },
  f = function (e, r) {
    var t, n;
    return regeneratorRuntime.async(function (a) {
      for (;;) switch (a.prev = a.next) {
        case 0:
          a.next = 2;
          return regeneratorRuntime.awrap(services.QQMusic.searchSong(e));
        case 2:
          if (!((t = a.sent).length > 0)) {
            a.next = 6;
            break;
          }
          n = t.find(function (e) {
            return o(e.interval, r / 1e3);
          });
          return a.abrupt("return", p(n.mid));
        case 6:
        case "end":
          return a.stop();
      }
    }, null, this);
  },
  d = function (e, r) {
    var t, n, a, u, o, p, d, g, x, h, y;
    return regeneratorRuntime.async(function (m) {
      for (;;) switch (m.prev = m.next) {
        case 0:
          if (t = e.id, !((null === e || void 0 === e ? void 0 : e.mainTrackId) > 0)) {
            m.next = 4;
            break;
          }
          n = [{
            txt: e.description,
            total: 0
          }];
          return m.abrupt("return", {
            lyric: n,
            hasTrans: false
          });
        case 4:
          m.next = 6;
          return regeneratorRuntime.awrap(services.Netease.lyric(t));
        case 6:
          if (a = m.sent, u = a.lrc, o = a.tlyric, p = a.transUser, d = a.uncollected, u) {
            m.next = 12;
            break;
          }
          g = r.song;
          types.isArray(r.singer) && (g += "- " + r.singer[0].name);
          return m.abrupt("return", f(g, e.dt));
        case 12:
          if (true !== d) {
            m.next = 14;
            break;
          }
          return m.abrupt("return", b(e));
        case 14:
          x = (0, utils.parseLyric)(u.lyric);
          h = false;
          o.lyric && (y = (0, utils.parseLyric)(o.lyric), x = l(y, x), h = true);
          p && x.push({
            txt: '\u7ffb\u8bd1\u8d21\u732e\u8005\uff1a' + p.nickname
          });
          return m.abrupt("return", {
            lyric: x,
            hasTrans: h
          });
        case 19:
        case "end":
          return m.stop();
      }
    }, null, this);
  },
  b = function (e, r) {
    var t, n, a, u, i, l, p, b;
    return regeneratorRuntime.async(function (g) {
      for (;;) switch (g.prev = g.next) {
        case 0:
          t = e.title;
          n = e.singer;
          a = e.duration;
          u = t;
          i = Object.create(null);
          types.isString(n) && (u += ' ' + n);
          g.next = 6;
          return regeneratorRuntime.awrap(services.Netease.search({
            keywords: u
          }));
        case 6:
          if (l = g.sent, types.isObject(l)) {
            g.next = 9;
            break;
          }
          return g.abrupt("return");
        case 9:
          if (p = l.result.songs, !(b = a && a > 0 && p.find(function (e) {
            return o(e.dt / 1e3, a / 1e3);
          }) || p[0])) {
            g.next = 17;
            break;
          }
          g.next = 14;
          return regeneratorRuntime.awrap(d(b, r));
        case 14:
          i = g.sent;
          g.next = 20;
          break;
        case 17:
          g.next = 19;
          return regeneratorRuntime.awrap(f(u));
        case 19:
          i = g.sent;
        case 20:
          return g.abrupt("return", i);
        case 21:
        case "end":
          return g.stop();
      }
    }, null, this);
  },
  g = {
    getLyric: function (e) {
      var r, t, n, a;
      return regeneratorRuntime.async(function (s) {
        for (;;) switch (s.prev = s.next) {
          case 0:
            r = e.api;
            t = e.obj;
            n = e.songItem;
            a = Object.create(null);
            s.t0 = r;
            s.next = s.t0 === providers.default.netEase ? 5 : s.t0 === providers.default.qqMusic ? 9 : s.t0 === providers.default.local ? 13 : 17;
            break;
          case 5:
            s.next = 7;
            return regeneratorRuntime.awrap(d(n, t));
          case 7:
            a = s.sent;
            return s.abrupt("break", 17);
          case 9:
            s.next = 11;
            return regeneratorRuntime.awrap(p(t.uid));
          case 11:
            a = s.sent;
            return s.abrupt("break", 17);
          case 13:
            s.next = 15;
            return regeneratorRuntime.awrap(b(n, t));
          case 15:
            a = s.sent;
            return s.abrupt("break", 17);
          case 17:
            a.lyric || (a.lyric = [], a.hasTrans = false);
            return s.abrupt("return", a);
          case 19:
          case "end":
            return s.stop();
        }
      }, null, this);
    }
  };
exports.default = g;
