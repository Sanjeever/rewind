Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  services = require("../services/index"),
  types = babelHelpers.interopRequireWildcard(require("../utils/types")),
  c = function (e, r, n, t) {
    var a, u;
    return regeneratorRuntime.async(function (s) {
      for (;;) switch (s.prev = s.next) {
        case 0:
          a = true === r && true === t;
          s.next = 3;
          return regeneratorRuntime.awrap(o(e, a, n));
        case 3:
          u = s.sent;
          return s.abrupt("return", u);
        case 5:
        case "end":
          return s.stop();
      }
    }, null, this);
  },
  o = function (e, r) {
    var n, t;
    return regeneratorRuntime.async(function (a) {
      for (;;) switch (a.prev = a.next) {
        case 0:
          if (!r) {
            a.next = 6;
            break;
          }
          a.next = 3;
          return regeneratorRuntime.awrap(services.Netease.musicUrl({
            id: e
          }));
        case 3:
          n = a.sent;
          a.next = 9;
          break;
        case 6:
          a.next = 8;
          return regeneratorRuntime.awrap(services.Netease.freeMusicUrl({
            id: e
          }));
        case 8:
          n = a.sent;
        case 9:
          if (!n) {
            a.next = 14;
            break;
          }
          if (t = n.data, !types.isArray(t) || t[0].freeTrialInfo && !(t[0].payed > 0)) {
            a.next = 13;
            break;
          }
          return a.abrupt("return", t[0].url);
        case 13:
          return a.abrupt("return", null);
        case 14:
        case "end":
          return a.stop();
      }
    }, null, this);
  },
  l = function (e) {
    var r, n;
    return regeneratorRuntime.async(function (t) {
      for (;;) switch (t.prev = t.next) {
        case 0:
          if (e) {
            t.next = 2;
            break;
          }
          return t.abrupt("return");
        case 2:
          if (r = e.songmid ? e.songmid : e.mid, !types.isString(r)) {
            t.next = 8;
            break;
          }
          t.next = 6;
          return regeneratorRuntime.awrap(services.QQMusic.getMusicUrl(r));
        case 6:
          n = t.sent;
          return t.abrupt("return", n || null);
        case 8:
        case "end":
          return t.stop();
      }
    }, null, this);
  },
  f = {
    getUrl: function (e, r, n) {
      var t, a, o, f, p, d;
      return regeneratorRuntime.async(function (g) {
        for (;;) switch (g.prev = g.next) {
          case 0:
            if (e !== providers.default.netEase) {
              g.next = 9;
              break;
            }
            o = r.song.id;
            f = !!((null === (a = r.song) || void 0 === a ? void 0 : a.fee) > 0);
            g.next = 5;
            return regeneratorRuntime.awrap(c(o, f, r.song, n));
          case 5:
            (p = g.sent) && (t = p);
            g.next = 13;
            break;
          case 9:
            if (e !== providers.default.qqMusic) {
              g.next = 13;
              break;
            }
            g.next = 12;
            return regeneratorRuntime.awrap(l(r.song));
          case 12:
            t = g.sent;
          case 13:
            if (types.isString(t)) {
              g.next = 18;
              break;
            }
            g.next = 16;
            return regeneratorRuntime.awrap(services.provider.getUrlFromOther(r.song, e));
          case 16:
            (d = g.sent) && types.isString(d) && (t = d);
          case 18:
            return g.abrupt("return", t);
          case 19:
          case "end":
            return g.stop();
        }
      }, null, this);
    }
  };
exports.default = f;
