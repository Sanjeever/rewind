Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.qmSign = function (n) {
  var r = utils.md5.hex_md5(n).toLowerCase(),
    e = f.map(function (n, e) {
      return n ^ parseInt(r.slice(2 * e, 2 * e + 2), 16);
    }),
    t = c.map(l(r)).join(''),
    o = i.map(l(r)).join(''),
    d = base64.default.encode(String.fromCodePoint.apply(String, babelHelpers.toConsumableArray(e))).replace(/=+$/, '').replace(/[\/+]/g, '').toLowerCase();
  return "zzb" + t + d + o;
};
exports.getSecuritySign = function (n) {
  for (var r = Math.floor(7 * Math.random() + 10), e = 'zza', t = 0; t < r; t++) e += "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(36 * Math.random())];
  return e += d('CJBPACrRuNy7' + n);
};
var base64 = babelHelpers.interopRequireDefault(require("base-64")),
  utils = require("../../utils/index"),
  f = [212, 45, 80, 68, 195, 163, 163, 203, 157, 220, 254, 91, 204, 79, 104, 6],
  c = [21, 4, 9, 26, 16, 20, 27, 30],
  i = [18, 11, 3, 2, 1, 7, 6, 25],
  l = function (n) {
    return function (r) {
      return n[r];
    };
  };
var d = function (n) {
  function r(n, r) {
    var e = (65535 & n) + (65535 & r);
    return (n >> 16) + (r >> 16) + (e >> 16) << 16 | 65535 & e;
  }
  function e(n, e, t, o, u, a) {
    return r((f = r(r(e, n), r(o, a))) << (c = u) | f >>> 32 - c, t);
    var f, c;
  }
  function t(n, r, t, o, u, a, f) {
    return e(r & t | ~r & o, n, r, u, a, f);
  }
  function o(n, r, t, o, u, a, f) {
    return e(r & o | t & ~o, n, r, u, a, f);
  }
  function u(n, r, t, o, u, a, f) {
    return e(r ^ t ^ o, n, r, u, a, f);
  }
  function a(n, r, t, o, u, a, f) {
    return e(t ^ (r | ~o), n, r, u, a, f);
  }
  function f(n) {
    return function (n) {
      var r,
        e = '';
      for (r = 0; r < 32 * n.length; r += 8) e += String.fromCharCode(n[r >> 5] >>> r % 32 & 255);
      return e;
    }(function (n, e) {
      n[e >> 5] |= 128 << e % 32;
      n[14 + (e + 64 >>> 9 << 4)] = e;
      var f,
        c,
        i,
        l,
        d,
        h = 1732584193,
        g = -271733879,
        p = -1732584194,
        m = 271733878;
      for (f = 0; f < n.length; f += 16) {
        c = h;
        i = g;
        l = p;
        d = m;
        h = a(h = u(h = u(h = u(h = u(h = o(h = o(h = o(h = o(h = t(h = t(h = t(h = t(h, g, p, m, n[f], 7, -680876936), g = t(g, p = t(p, m = t(m, h, g, p, n[f + 1], 12, -389564586), h, g, n[f + 2], 17, 606105819), m, h, n[f + 3], 22, -1044525330), p, m, n[f + 4], 7, -176418897), g = t(g, p = t(p, m = t(m, h, g, p, n[f + 5], 12, 1200080426), h, g, n[f + 6], 17, -1473231341), m, h, n[f + 7], 22, -45705983), p, m, n[f + 8], 7, 1770035416), g = t(g, p = t(p, m = t(m, h, g, p, n[f + 9], 12, -1958414417), h, g, n[f + 10], 17, -42063), m, h, n[f + 11], 22, -1990404162), p, m, n[f + 12], 7, 1804603682), g = t(g, p = t(p, m = t(m, h, g, p, n[f + 13], 12, -40341101), h, g, n[f + 14], 17, -1502002290), m, h, n[f + 15], 22, 1236535329), p, m, n[f + 1], 5, -165796510), g = o(g, p = o(p, m = o(m, h, g, p, n[f + 6], 9, -1069501632), h, g, n[f + 11], 14, 643717713), m, h, n[f], 20, -373897302), p, m, n[f + 5], 5, -701558691), g = o(g, p = o(p, m = o(m, h, g, p, n[f + 10], 9, 38016083), h, g, n[f + 15], 14, -660478335), m, h, n[f + 4], 20, -405537848), p, m, n[f + 9], 5, 568446438), g = o(g, p = o(p, m = o(m, h, g, p, n[f + 14], 9, -1019803690), h, g, n[f + 3], 14, -187363961), m, h, n[f + 8], 20, 1163531501), p, m, n[f + 13], 5, -1444681467), g = o(g, p = o(p, m = o(m, h, g, p, n[f + 2], 9, -51403784), h, g, n[f + 7], 14, 1735328473), m, h, n[f + 12], 20, -1926607734), p, m, n[f + 5], 4, -378558), g = u(g, p = u(p, m = u(m, h, g, p, n[f + 8], 11, -2022574463), h, g, n[f + 11], 16, 1839030562), m, h, n[f + 14], 23, -35309556), p, m, n[f + 1], 4, -1530992060), g = u(g, p = u(p, m = u(m, h, g, p, n[f + 4], 11, 1272893353), h, g, n[f + 7], 16, -155497632), m, h, n[f + 10], 23, -1094730640), p, m, n[f + 13], 4, 681279174), g = u(g, p = u(p, m = u(m, h, g, p, n[f], 11, -358537222), h, g, n[f + 3], 16, -722521979), m, h, n[f + 6], 23, 76029189), p, m, n[f + 9], 4, -640364487), g = u(g, p = u(p, m = u(m, h, g, p, n[f + 12], 11, -421815835), h, g, n[f + 15], 16, 530742520), m, h, n[f + 2], 23, -995338651), p, m, n[f], 6, -198630844);
        g = a(g = a(g = a(g = a(g, p = a(p, m = a(m, h, g, p, n[f + 7], 10, 1126891415), h, g, n[f + 14], 15, -1416354905), m, h, n[f + 5], 21, -57434055), p = a(p, m = a(m, h = a(h, g, p, m, n[f + 12], 6, 1700485571), g, p, n[f + 3], 10, -1894986606), h, g, n[f + 10], 15, -1051523), m, h, n[f + 1], 21, -2054922799), p = a(p, m = a(m, h = a(h, g, p, m, n[f + 8], 6, 1873313359), g, p, n[f + 15], 10, -30611744), h, g, n[f + 6], 15, -1560198380), m, h, n[f + 13], 21, 1309151649), p = a(p, m = a(m, h = a(h, g, p, m, n[f + 4], 6, -145523070), g, p, n[f + 11], 10, -1120210379), h, g, n[f + 2], 15, 718787259), m, h, n[f + 9], 21, -343485551);
        h = r(h, c);
        g = r(g, i);
        p = r(p, l);
        m = r(m, d);
      }
      return [h, g, p, m];
    }(function (n) {
      var r,
        e = [];
      for (e[(n.length >> 2) - 1] = void 0, r = 0; r < e.length; r += 1) e[r] = 0;
      for (r = 0; r < 8 * n.length; r += 8) e[r >> 5] |= (255 & n.charCodeAt(r / 8)) << r % 32;
      return e;
    }(n), 8 * n.length));
  }
  return function (n) {
    var r,
      e,
      t = '';
    for (e = 0; e < n.length; e += 1) {
      r = n.charCodeAt(e);
      t += '0123456789abcdef'.charAt(r >>> 4 & 15) + '0123456789abcdef'.charAt(15 & r);
    }
    return t;
  }(function (n) {
    return f(unescape(encodeURIComponent(n)));
  }(n));
};
