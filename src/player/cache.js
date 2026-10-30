Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var tinyLru = babelHelpers.interopRequireDefault(require("tiny-lru")),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  o = new tinyLru.default(100),
  s = function (e, r) {
    var t = e.song;
    return r === providers.default.qqMusic ? t.songmid || t.mid : String(t.id);
  },
  l = function (e) {
    return function () {
      var r,
        t,
        n,
        u,
        a,
        i,
        l,
        f,
        c = arguments;
      return regeneratorRuntime.async(function (d) {
        for (;;) switch (d.prev = d.next) {
          case 0:
            for (r = c.length, t = new Array(r), n = 0; n < r; n++) t[n] = c[n];
            if (u = t[0], a = t[1], i = s(u, a), !(l = o.get(i))) {
              d.next = 6;
              break;
            }
            return d.abrupt("return", l);
          case 6:
            d.next = 8;
            return regeneratorRuntime.awrap(e.apply(void 0, t));
          case 8:
            (f = d.sent) && o.set(i, f);
            return d.abrupt("return", f);
          case 11:
          case "end":
            return d.stop();
        }
      }, null, this);
    };
  };
exports.default = l;
