Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var d = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
  n = function (r) {
    for (var e, o = '', t = 0, a = 0, d = 0; t < r.length;)
      (a = r.charCodeAt(t)) < 128
        ? ((o += String.fromCharCode(a)), t++)
        : a > 191 && a < 224
          ? ((d = r.charCodeAt(t + 1)),
            (o += String.fromCharCode(((31 & a) << 6) | (63 & d))),
            (t += 2))
          : ((d = r.charCodeAt(t + 1)),
            (e = r.charCodeAt(t + 2)),
            (o += String.fromCharCode(((15 & a) << 12) | ((63 & d) << 6) | (63 & e))),
            (t += 3));
    return o;
  },
  f = {
    decode: function (r) {
      for (
        var e, o, t, a, f, h, C = '', i = 0, c = r.replace(/[^A-Za-z0-9+/=]/g, '');
        i < c.length;
      ) {
        e = (d.indexOf(c.charAt(i++)) << 2) | ((a = d.indexOf(c.charAt(i++))) >> 4);
        o = ((15 & a) << 4) | ((f = d.indexOf(c.charAt(i++))) >> 2);
        t = ((3 & f) << 6) | (h = d.indexOf(c.charAt(i++)));
        C += String.fromCharCode(e);
        64 !== f && (C += String.fromCharCode(o));
        64 !== h && (C += String.fromCharCode(t));
      }
      return (C = n(C));
    },
  };
exports.default = f;
