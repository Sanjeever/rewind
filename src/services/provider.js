Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var providers = babelHelpers.interopRequireDefault(require("./providers")),
  types = babelHelpers.interopRequireWildcard(require("../utils/types")),
  netease = babelHelpers.interopRequireDefault(require("./netease/index")),
  qqmusic = babelHelpers.interopRequireDefault(require("./qqmusic/index")),
  c = function (e) {
    var r = e.name || e.songname || e.song || e.title || e.filename,
      n = e.singer || e.artists || e.ar,
      t = r;
    n[0] && (t += ' - ' + n[0].name);
    return {
      text: t,
      song: r,
      singer: n[0].name
    };
  },
  o = function (e, r, n) {
    var t = e.songs;
    return t && 0 !== t.length ? n ? t.find(function (e) {
      return e.id !== r.id && e.dt === r.dt;
    }) || null : t[0] : null;
  },
  f = function (e) {
    var r,
      n,
      t,
      a,
      u,
      l,
      f,
      d = arguments;
    return regeneratorRuntime.async(function (g) {
      for (;;) switch (g.prev = g.next) {
        case 0:
          r = d.length > 1 && void 0 !== d[1] && d[1];
          n = null;
          t = c(e);
          a = t.text;
          g.next = 5;
          return regeneratorRuntime.awrap(netease.default.search({
            keywords: a
          }));
        case 5:
          if (u = g.sent, types.isObject(u)) {
            g.next = 8;
            break;
          }
          return g.abrupt("return", null);
        case 8:
          if (l = o(u.result, e, r), !types.isObject(l)) {
            g.next = 14;
            break;
          }
          g.next = 12;
          return regeneratorRuntime.awrap(netease.default.freeMusicUrl({
            id: l.id
          }));
        case 12:
          f = g.sent;
          n = f.data ? f.data[0].url : null;
        case 14:
          return g.abrupt("return", n);
        case 15:
        case "end":
          return g.stop();
      }
    }, null, this);
  },
  d = function (e) {
    var r, n, t, a, u, i, o, f, d, g, p, b, x;
    return regeneratorRuntime.async(function (m) {
      for (;;) switch (m.prev = m.next) {
        case 0:
          r = c(e);
          n = r.text;
          t = r.song;
          a = r.singer;
          m.next = 3;
          return regeneratorRuntime.awrap(qqmusic.default.searchSong(n));
        case 3:
          if (u = m.sent, i = function (e) {
            var r = e.name === t,
              n = e.singer[0].name === a;
            if (r && n) return true;
          }, !types.isArray(u)) {
            m.next = 23;
            break;
          }
          if (o = f, (f = u[0]).name === t) {
            m.next = 18;
            break;
          }
          if (!(d = u.slice(1).find(i))) {
            m.next = 14;
            break;
          }
          o = d;
          m.next = 18;
          break;
        case 14:
          m.next = 16;
          return regeneratorRuntime.awrap(qqmusic.default.searchSong(t));
        case 16:
          (g = m.sent) && g.length > 0 && (p = g.find(i)) && (o = p);
        case 18:
          b = o.songmid ? o.songmid : o.mid;
          m.next = 21;
          return regeneratorRuntime.awrap(qqmusic.default.getMusicUrl(b));
        case 21:
          x = m.sent;
          return m.abrupt("return", x || null);
        case 23:
        case "end":
          return m.stop();
      }
    }, null, this);
  },
  g = {
    getUrlFromOther: function (e) {
      var r,
        n,
        t,
        a,
        s = arguments;
      return regeneratorRuntime.async(function (i) {
        for (;;) switch (i.prev = i.next) {
          case 0:
            if (r = s.length > 1 && void 0 !== s[1] ? s[1] : providers.default.netEase, i.prev = 1, r !== providers.default.qqMusic) {
              i.next = 9;
              break;
            }
            i.next = 5;
            return regeneratorRuntime.awrap(f(e));
          case 5:
            t = i.sent;
            n = t || null;
            i.next = 18;
            break;
          case 9:
            if (r !== providers.default.netEase) {
              i.next = 18;
              break;
            }
            i.next = 12;
            return regeneratorRuntime.awrap(d(e));
          case 12:
            if (a = i.sent, n = a || null) {
              i.next = 18;
              break;
            }
            i.next = 17;
            return regeneratorRuntime.awrap(f(e, true));
          case 17:
            n = i.sent;
          case 18:
            i.next = 23;
            break;
          case 20:
            i.prev = 20;
            i.t0 = i.catch(1);
            return i.abrupt("return", null);
          case 23:
            return i.abrupt("return", n);
          case 24:
          case "end":
            return i.stop();
        }
      }, null, this, [[1, 20]]);
    }
  };
exports.default = g;
