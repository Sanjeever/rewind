const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _asyncRuntime = require("@babel/runtime/helpers/regeneratorRuntime")();
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeBackground = exports.getBackgroundCache = exports.moveToFiles = exports.clearCache = exports.getCurrentCache = exports.bytesToSize = exports.isUsableFile = void 0;
var rnFetchBlob = _interopRequireDefault(require("react-native-blob-util")),
  paths = require("./paths"),
  types = _interopRequireWildcard(require("../utils/types")),
  o = rnFetchBlob.default.fs,
  s = o.cp,
  f = o.unlink,
  l = o.lstat,
  h = o.exists,
  p = o.createFile,
  d = o.mkdir,
  g = o.isDir,
  b = function () {
    var e = paths.cache_dir + '.nomedia';
    h(e).then(function (r) {
      r || p(e).then(function (e) {
        return e;
      }).catch(function (e) {
        return e;
      });
    }).catch(function (e) {
      return e;
    });
  };
exports.isUsableFile = function (e) {
  return h(e);
};
exports.bytesToSize = function (e) {
  if (0 === e) return '0 B';
  var r = Math.floor(Math.log(e) / Math.log(1024));
  return (e / Math.pow(1024, r)).toFixed(1) + ' ' + ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][r];
};
exports.getCurrentCache = function e() {
  var r,
    t,
    n,
    a,
    i,
    o,
    s = arguments;
  return _asyncRuntime.async(function (f) {
    for (;;) switch (f.prev = f.next) {
      case 0:
        r = s.length > 0 && void 0 !== s[0] ? s[0] : paths.audio_cache;
        t = 0;
        f.prev = 2;
        f.next = 5;
        return _asyncRuntime.awrap(l(r));
      case 5:
        if ((n = f.sent) || types.isArray(n)) {
          f.next = 8;
          break;
        }
        return f.abrupt("return", 0);
      case 8:
        a = 0;
      case 9:
        if (!(a < n.length)) {
          f.next = 22;
          break;
        }
        if ('file' !== (i = n[a]).type) {
          f.next = 15;
          break;
        }
        t += 0 | i.size;
        f.next = 19;
        break;
      case 15:
        f.next = 17;
        return _asyncRuntime.awrap(e(i.path));
      case 17:
        o = f.sent;
        t += 0 | o;
      case 19:
        a++;
        f.next = 9;
        break;
      case 22:
        return f.abrupt("return", t > 0 ? t : 0);
      case 25:
        f.prev = 25;
        f.t0 = f.catch(2);
        return f.abrupt("return", 0);
      case 28:
      case "end":
        return f.stop();
    }
  }, null, this, [[2, 25]]);
};
exports.clearCache = function () {
  f(paths.audio_cache).catch(function (e) {
    return e;
  });
};
exports.moveToFiles = function (e) {
  var r, t, n, a, i, c, o, l, p;
  return _asyncRuntime.async(function (v) {
    for (;;) switch (v.prev = v.next) {
      case 0:
        r = e.from;
        t = e.dest;
        n = e.fileName;
        a = void 0 === n ? String(Date.now()) : n;
        i = e.clearOriginal;
        c = void 0 !== i && i;
        o = r.replace(/.+\./, '.');
        l = paths.files_dir + t;
        p = l + '/' + a + o;
        v.next = 6;
        return _asyncRuntime.awrap(h(r));
      case 6:
        if (true !== v.sent) {
          v.next = 23;
          break;
        }
        c && f(l);
        v.next = 11;
        return _asyncRuntime.awrap(g(l));
      case 11:
        if (v.sent) {
          v.next = 16;
          break;
        }
        b();
        v.next = 16;
        return _asyncRuntime.awrap(d(l));
      case 16:
        v.prev = 16;
        v.next = 19;
        return _asyncRuntime.awrap(s(r, p));
      case 19:
        return v.abrupt("return", p);
      case 20:
        v.prev = 20;
        f(r);
        return v.finish(20);
      case 23:
      case "end":
        return v.stop();
    }
  }, null, this, [[16,, 20, 23]]);
};
exports.getBackgroundCache = function () {
  return l(paths.files_dir + 'background').then(function (e) {
    if (e.length > 0) return 'file://' + e[0].path;
  }).catch(function () {
    return null;
  });
};
exports.removeBackground = function () {
  return f(paths.files_dir + 'background').then(function (e) {
    return e;
  }).catch(function (e) {
    return e;
  });
};
