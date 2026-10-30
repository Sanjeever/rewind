const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _asyncRuntime = require("regenerator-runtime");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var immer = require("immer"),
  providers = _interopRequireDefault(require("../services/providers")),
  utils = require("../utils/index"),
  types = _interopRequireWildcard(require("../utils/types")),
  users = _interopRequireDefault(require("./users")),
  l = function (e) {
    var r = e.api,
      t = e.newItem,
      n = e.oldItem;
    switch (r) {
      case providers.default.netEase:
        return t.id === n.id;
      case providers.default.qqMusic:
        var a = n.id || n.dissid;
        return (t.id || t.dissid) === a;
    }
  },
  p = function (e) {
    var r, t, n, a;
    return _asyncRuntime.async(function (u) {
      for (;;) switch (u.prev = u.next) {
        case 0:
          r = e.api;
          t = e.newArr;
          u.next = 3;
          return _asyncRuntime.awrap(users.default.getUserPlayList());
        case 3:
          if (n = u.sent, types.isObject(n)) {
            u.next = 6;
            break;
          }
          return u.abrupt("return", t);
        case 6:
          if (a = n[r], Array.isArray(a) && a.length > 0 && t.length === a.length) {
            u.next = 10;
            break;
          }
          return u.abrupt("return", t);
        case 10:
          t.map(function (e) {
            return a.map(function (t, n) {
              l({
                api: r,
                newItem: e,
                oldItem: t
              }) && (a[n] = e);
            });
          });
          return u.abrupt("return", a);
        case 12:
        case "end":
          return u.stop();
      }
    }, null, this);
  },
  d = {
    collect: function (e) {
      var r, t, n, a, i, l;
      return _asyncRuntime.async(function (p) {
        for (;;) switch (p.prev = p.next) {
          case 0:
            if (r = e.playlist, t = e.api, n = e.index, a = r, !n || !types.isObject(a)) {
              p.next = 8;
              break;
            }
            if (i = a[t], !Array.isArray(i)) {
              p.next = 8;
              break;
            }
            l = (0, immer.produce)(i, function (e) {
              (0, utils.swap)(e, n, 1);
            });
            users.default.saveUserPlayList(l, t);
            return p.abrupt("return", l);
          case 8:
          case "end":
            return p.stop();
        }
      }, null, this);
    },
    newOrder: function (e) {
      var r, t, n, a;
      return _asyncRuntime.async(function (u) {
        for (;;) switch (u.prev = u.next) {
          case 0:
            if (r = e.api, t = e.newArr, false !== (void 0 === (n = e.on) || n)) {
              u.next = 3;
              break;
            }
            return u.abrupt("return", t);
          case 3:
            u.next = 5;
            return _asyncRuntime.awrap(p({
              api: r,
              newArr: t
            }));
          case 5:
            a = u.sent;
            return u.abrupt("return", a);
          case 7:
          case "end":
            return u.stop();
        }
      }, null, this);
    },
    collectCharts: function (e) {
      var r, t, n;
      return _asyncRuntime.async(function (a) {
        for (;;) switch (a.prev = a.next) {
          case 0:
            r = e.list;
            t = e.index;
            Array.isArray(r) && (n = (0, immer.produce)(r, function (e) {
              (0, utils.swap)(e, t, 0);
            }), users.default.saveCharts(n));
          case 2:
          case "end":
            return a.stop();
        }
      }, null, this);
    }
  };
exports.default = d;
