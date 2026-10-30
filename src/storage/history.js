const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _appStorage = require("./index.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.searchHistory = exports.musicHistory = exports.cleanedData = void 0;
var providers = _interopRequireDefault(require("../services/providers")),
  keys = _interopRequireDefault(require("./keys")),
  u = function (e) {
    return e.songmid || e.mid;
  },
  r = function (e, a, t) {
    var s = -1;
    switch (t) {
      case providers.default.netEase:
        s = e.findIndex(function (e) {
          return e.id === a.id;
        });
        break;
      case providers.default.qqMusic:
        s = e.findIndex(function (e) {
          return u(e) === u(a);
        });
        break;
      case providers.default.local:
        s = e.findIndex(function (e) {
          return e.path === a.path;
        });
    }
    e.splice(s >>> 0, 1);
    e.splice(0, 0, a);
    return e;
  };
exports.cleanedData = r;
exports.musicHistory = function (e, a) {
  if (e) {
    var t = {},
      s = [];
    _appStorage.storage.load({
      key: keys.default.musicHistory
    }).then(function (c) {
      var u = c[a];
      if (u) {
        switch (s = r(u, e, a), a) {
          case providers.default.netEase:
            t.qqMusic = c.qqMusic;
            t.netEase = s;
            t.local = c.local;
            break;
          case providers.default.qqMusic:
            t.qqMusic = s;
            t.netEase = c.netEase;
            t.local = c.local;
            break;
          case providers.default.local:
            t.qqMusic = c.qqMusic;
            t.netEase = c.netEase;
            t.local = s;
        }
        _appStorage.storage.save({
          key: keys.default.musicHistory,
          data: t
        }).catch(function (e) {
          return e;
        });
      }
    }).catch(function () {
      switch (s.push(e), a) {
        case providers.default.netEase:
          t.qqMusic = [];
          t.netEase = s;
          t.local = [];
          break;
        case providers.default.qqMusic:
          t.qqMusic = s;
          t.netEase = [];
          t.local = [];
          break;
        case providers.default.local:
          t.qqMusic = [];
          t.netEase = [];
          t.local = s;
      }
      _appStorage.storage.save({
        key: keys.default.musicHistory,
        data: t
      }).catch(function (e) {
        return e;
      });
    });
  }
};
exports.searchHistory = function (e, a) {
  _appStorage.storage.load({
    key: keys.default.searchHistory
  }).then(function (t) {
    var s = t,
      c = {
        text: e,
        api: a
      };
    (s = s.filter(function (a) {
      return a.text !== e;
    })).push(c);
    s.reverse();
    _appStorage.storage.save({
      key: keys.default.searchHistory,
      data: s
    });
  }).catch(function () {
    var t = [{
      text: e,
      api: a
    }];
    _appStorage.storage.save({
      key: keys.default.searchHistory,
      data: t
    });
  });
};
