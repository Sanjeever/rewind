Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var Runtime562 = babelHelpers.interopRequireDefault(require("@runtime/562")),
  trackInfo = require("../services/trackInfo"),
  utils = require("./index"),
  c = {
    ':1': 1,
    ':11': 1,
    ':2': 1,
    ':22': 1,
    ':3': 1,
    ':33': 1,
    ':4': 1
  },
  o = {
    bySong: ':1',
    bySongReversed: ':11',
    byArtist: ':2',
    byArtistReversed: ':22',
    byAlbum: ':3',
    byAlbumReversed: ':33',
    byRandom: ':4'
  },
  l = new RegExp(/:\w{1,2}/gi),
  b = function (e) {
    return e.replace(/\s/, '');
  },
  f = function (e) {
    return b(Runtime562.default.getFullChars(e));
  },
  g = function (e) {
    return (0, utils.usable)(c[e]);
  },
  v = function (e, r) {
    var n = r.replace(l, ''),
      t = r.replace(new RegExp(n, 'gi'), ''),
      a = m(e, t);
    t !== o.bySongReversed && t !== o.byArtistReversed && t !== o.byAlbumReversed || (a = a.reverse());
    return a;
  },
  m = function (e, r) {
    return r === o.byRandom ? (0, utils.shuffle)(e) : g(r) ? e.sort(function (e, n) {
      return p(e, n, r);
    }) : e;
  },
  p = function (e, r, n) {
    var t = (0, trackInfo.extractBasicInfo)(e),
      a = (0, trackInfo.extractBasicInfo)(r),
      u = null,
      s = null,
      c = null;
    switch (n) {
      case o.bySong:
      case o.bySongReversed:
        u = f(t.song);
        s = f(a.song);
        c = u.localeCompare(s);
        break;
      case o.byArtist:
      case o.byArtistReversed:
        var l = d(t.singer),
          b = d(a.singer);
        u = f(l);
        s = f(b);
        c = u.localeCompare(s);
        break;
      case o.byAlbum:
      case o.byAlbumReversed:
        u = f(t.album);
        s = f(a.album);
        c = u.localeCompare(s);
    }
    return c;
  },
  y = function (e) {
    return (null === e || void 0 === e ? void 0 : e.map(function (e) {
      return e.name;
    })) || [];
  },
  d = function (e) {
    return 'string' == typeof e ? e : y(e).join('');
  },
  h = function (e) {
    if ('string' == typeof e) return e;
    var r = y(e);
    return f(r.join(''));
  },
  R = {
    search: function (e, r) {
      var n = b(r.replace(/\?/gi, '\\?'));
      if (n.length < 1) return e;
      var t = n.replace(l, ''),
        a = new RegExp(t, 'gi'),
        u = e.filter(function (e) {
          var r = (0, trackInfo.extractBasicInfo)(e),
            n = r.song,
            t = r.album,
            u = d(r.singer),
            s = f(r.song),
            c = f(r.album);
          return [n, t, u, h(r.singer), s, c].join(' ').match(a);
        });
      return n.match(l) ? v(u, n) : u;
    },
    quickSearch: function (e, r) {
      var n = b(r.replace(/\?/gi, '\\?'));
      if (n.length < 1) return e;
      var t = new RegExp(n, 'gi');
      return e.filter(function (e) {
        if (e._searchable && 'string' == typeof e._searchable) return e._searchable.match(t);
        var r = (0, trackInfo.extractBasicInfo)(e),
          n = r.song,
          a = r.album,
          u = d(r.singer),
          s = f(r.song),
          c = f(r.album),
          o = [n, a, u, h(r.singer), s, c].join('');
        e._searchable = o;
        return e._searchable.match(t);
      });
    },
    searchTypesMap: o
  };
exports.default = R;
