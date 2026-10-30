const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _asyncRuntime = require("regenerator-runtime");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var ReactNative = require("react-native"),
  rnFetchBlob = _interopRequireDefault(require("react-native-blob-util")),
  providers = _interopRequireDefault(require("./providers")),
  locales = _interopRequireDefault(require("../locales/index")),
  services = require("./index"),
  utils = require("../utils/index"),
  audioTagger = _interopRequireDefault(require("../native/audioTagger")),
  f = rnFetchBlob.default.fs.dirs.MusicDir + '/rewind/',
  d = {
    netEase: 'netease',
    qqMusic: 'qqmusic'
  },
  m = function (e, t) {
    var r;
    switch (t) {
      case providers.default.netEase:
        r = e.replace(/param=100y100/gi, 'param=1500y1500');
        break;
      case providers.default.qqMusic:
        r = e.replace(/T001R150x150M000/gi, 'T001R500x500M000');
    }
    return r;
  },
  b = function (e) {
    var t, r, a, n, u, i, l;
    return _asyncRuntime.async(function (b) {
      for (;;) switch (b.prev = b.next) {
        case 0:
          t = e.url;
          r = e.api;
          a = e.name;
          n = e.obj;
          u = e.type;
          i = f + d[r] + '/' + (a + "." + (void 0 === u ? 'mp3' : u));
          b.next = 7;
          return _asyncRuntime.awrap(rnFetchBlob.default.config({
            path: i
          }).fetch('GET', t));
        case 7:
          b.next = 9;
          return _asyncRuntime.awrap(audioTagger.default.commit(i, {
            title: n.song,
            artist: (0, utils.parseArtist)(n.singer),
            album: n.album,
            image: m(n.img, r)
          }));
        case 9:
          200 != (null === (l = b.sent) || void 0 === l ? void 0 : l.code) && toast('\u5199\u5165\u97f3\u4e50\u6807\u7b7e\u5931\u8d25');
          b.next = 13;
          return _asyncRuntime.awrap(rnFetchBlob.default.fs.scanFile([{
            path: i,
            mime: 'audio/mpeg'
          }]));
        case 13:
          toast(locales.default.CLONE_DONE + "\uff1a" + i);
        case 14:
        case "end":
          return b.stop();
      }
    }, null, this);
  },
  g = function (e, t) {
    var r = null;
    switch (t) {
      case providers.default.netEase:
        r = e.data[0].url;
        break;
      case providers.default.qqMusic:
        r = e;
    }
    return r;
  },
  x = function (e, t, r, a, n) {
    var u, s, i;
    return _asyncRuntime.async(function (c) {
      for (;;) switch (c.prev = c.next) {
        case 0:
          c.next = 2;
          return _asyncRuntime.awrap(services.Netease.musicUrl({
            id: t
          }));
        case 2:
          u = c.sent;
          (0, utils.usable)(u) && (s = g(u, r), i = u.data[0].type, true === n ? w(s) : b({
            url: s,
            api: r,
            name: e,
            obj: a,
            type: i
          }));
        case 4:
        case "end":
          return c.stop();
      }
    }, null, this);
  },
  R = function (e, t, r, a, n) {
    var u, s, i, c;
    return _asyncRuntime.async(function (p) {
      for (;;) switch (p.prev = p.next) {
        case 0:
          p.next = 2;
          return _asyncRuntime.awrap(services.Netease.freeMusicUrl({
            id: t
          }));
        case 2:
          if (!(u = p.sent)) {
            p.next = 19;
            break;
          }
          if ((0, utils.usable)(u)) {
            p.next = 7;
            break;
          }
          x(e, t, r, a, n);
          return p.abrupt("return");
        case 7:
          if (s = null, !(c = g(u, r))) {
            p.next = 14;
            break;
          }
          s = c;
          i = u.data[0].type;
          p.next = 18;
          break;
        case 14:
          p.next = 16;
          return _asyncRuntime.awrap(services.provider.getUrlFromOther(a));
        case 16:
          s = p.sent;
          i = 'mp3';
        case 18:
          true === n ? w(s) : b({
            url: s,
            api: r,
            name: e,
            obj: a,
            type: i
          });
        case 19:
        case "end":
          return p.stop();
      }
    }, null, this);
  },
  v = function (e, t, r, a, n) {
    var u, s;
    return _asyncRuntime.async(function (c) {
      for (;;) switch (c.prev = c.next) {
        case 0:
          c.next = 2;
          return _asyncRuntime.awrap(services.QQMusic.getMusicUrl(t));
        case 2:
          if (u = c.sent, s = g(u, r)) {
            c.next = 8;
            break;
          }
          c.next = 7;
          return _asyncRuntime.awrap(services.provider.getUrlFromOther(a, providers.default.qqMusic));
        case 7:
          s = c.sent;
        case 8:
          if (s) {
            c.next = 10;
            break;
          }
          return c.abrupt("return");
        case 10:
          true === n ? w(s) : b({
            url: s,
            api: r,
            name: e,
            obj: a
          });
        case 11:
        case "end":
          return c.stop();
      }
    }, null, this);
  },
  w = function (e) {
    ReactNative.Linking.openURL(e);
  },
  h = {
    download: function (e, t, r, a, n) {
      switch (toast(locales.default.CLONING), r) {
        case providers.default.netEase:
          R(e, t, r, a, n);
          break;
        case providers.default.qqMusic:
          v(e, t, r, a, n);
      }
    }
  };
exports.default = h;
