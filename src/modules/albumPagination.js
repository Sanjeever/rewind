const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _asyncRuntime = require("@babel/runtime/helpers/regeneratorRuntime")();
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var providers = _interopRequireDefault(require("../services/providers")),
  services = require("../services/index"),
  types = _interopRequireWildcard(require("../utils/types")),
  c = function e(r) {
    var t, n;
    return _asyncRuntime.async(function (a) {
      for (;;) switch (a.prev = a.next) {
        case 0:
          a.next = 2;
          return _asyncRuntime.awrap(services.Netease.artist_album(r));
        case 2:
          if (t = a.sent) {
            a.next = 5;
            break;
          }
          return a.abrupt("return", e(r));
        case 5:
          if (!(n = t.hotAlbums)) {
            a.next = 8;
            break;
          }
          return a.abrupt("return", n);
        case 8:
        case "end":
          return a.stop();
      }
    }, null, this);
  },
  o = function (e) {
    var r;
    return _asyncRuntime.async(function (t) {
      for (;;) switch (t.prev = t.next) {
        case 0:
          t.next = 2;
          return _asyncRuntime.awrap(services.QQMusic.album(e));
        case 2:
          if (r = t.sent, !types.isArray(r)) {
            t.next = 5;
            break;
          }
          return t.abrupt("return", r);
        case 5:
        case "end":
          return t.stop();
      }
    }, null, this);
  },
  f = function e(r) {
    var t, n;
    return _asyncRuntime.async(function (a) {
      for (;;) switch (a.prev = a.next) {
        case 0:
          a.next = 2;
          return _asyncRuntime.awrap(services.Netease.artist_mv(r));
        case 2:
          if (t = a.sent) {
            a.next = 5;
            break;
          }
          return a.abrupt("return", e(r));
        case 5:
          if (!(n = t.mvs)) {
            a.next = 8;
            break;
          }
          return a.abrupt("return", n);
        case 8:
        case "end":
          return a.stop();
      }
    }, null, this);
  },
  p = function (e) {
    var r;
    return _asyncRuntime.async(function (t) {
      for (;;) switch (t.prev = t.next) {
        case 0:
          t.next = 2;
          return _asyncRuntime.awrap(services.QQMusic.artist_mv(e));
        case 2:
          if (!(r = t.sent)) {
            t.next = 5;
            break;
          }
          return t.abrupt("return", r);
        case 5:
        case "end":
          return t.stop();
      }
    }, null, this);
  },
  l = {
    albums: function (e) {
      var r, t, n, a;
      return _asyncRuntime.async(function (s) {
        for (;;) switch (s.prev = s.next) {
          case 0:
            if (r = e.api, t = e.id, r !== providers.default.netEase) {
              s.next = 8;
              break;
            }
            s.next = 4;
            return _asyncRuntime.awrap(c(t));
          case 4:
            n = s.sent;
            return s.abrupt("return", n);
          case 8:
            if (r !== providers.default.qqMusic) {
              s.next = 13;
              break;
            }
            s.next = 11;
            return _asyncRuntime.awrap(o(t));
          case 11:
            a = s.sent;
            return s.abrupt("return", a);
          case 13:
          case "end":
            return s.stop();
        }
      }, null, this);
    },
    mvs: function (e) {
      var r, t, n, a;
      return _asyncRuntime.async(function (s) {
        for (;;) switch (s.prev = s.next) {
          case 0:
            if (r = e.api, t = e.id, r !== providers.default.netEase) {
              s.next = 8;
              break;
            }
            s.next = 4;
            return _asyncRuntime.awrap(f(t));
          case 4:
            n = s.sent;
            return s.abrupt("return", n);
          case 8:
            if (r !== providers.default.qqMusic) {
              s.next = 13;
              break;
            }
            s.next = 11;
            return _asyncRuntime.awrap(p(t));
          case 11:
            a = s.sent;
            return s.abrupt("return", a);
          case 13:
          case "end":
            return s.stop();
        }
      }, null, this);
    }
  };
exports.default = l;
