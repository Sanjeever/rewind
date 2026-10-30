Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  keys = babelHelpers.interopRequireDefault(require("./keys")),
  types = babelHelpers.interopRequireWildcard(require("../utils/types")),
  c = function (e) {
    var t;
    return regeneratorRuntime.async(function (a) {
      for (;;) switch (a.prev = a.next) {
        case 0:
          a.prev = 0;
          a.next = 3;
          return regeneratorRuntime.awrap(storage.load({
            key: e
          }));
        case 3:
          if (t = a.sent, !types.isObject(t)) {
            a.next = 6;
            break;
          }
          return a.abrupt("return", t);
        case 6:
          a.next = 11;
          break;
        case 8:
          a.prev = 8;
          a.t0 = a.catch(0);
          return a.abrupt("return", null);
        case 11:
        case "end":
          return a.stop();
      }
    }, null, this, [[0, 8]]);
  },
  l = function (e, t, a) {
    var r = e;
    switch (a) {
      case providers.default.netEase:
        r.netEase = {
          userId: t.userId,
          avatarUrl: t.avatarUrl,
          nickname: t.nickname,
          signature: t.signature
        };
        break;
      case providers.default.qqMusic:
        r.qqMusic = {
          userId: t.uin,
          avatarUrl: t.headpic,
          nickname: t.nick,
          cookies: t.cookies
        };
    }
    return r;
  },
  o = {
    getUserInfo: function () {
      return c(keys.default.userInfo);
    },
    getUserPlayList: function () {
      return c(keys.default.playlist);
    },
    saveUserStorage: function (e, t) {
      var a, r;
      return regeneratorRuntime.async(function (n) {
        for (;;) switch (n.prev = n.next) {
          case 0:
            a = {};
            n.next = 3;
            return regeneratorRuntime.awrap(c(keys.default.userInfo));
          case 3:
            r = n.sent;
            types.isObject(r) ? (a = l(r, e, t), storage.save({
              key: keys.default.userInfo,
              data: a
            })) : (a = l(a, e, t), storage.save({
              key: keys.default.userInfo,
              data: a
            }));
          case 5:
          case "end":
            return n.stop();
        }
      }, null, this);
    },
    saveUserPlayList: function (e, t) {
      var a = {};
      storage.load({
        key: keys.default.playlist
      }).then(function (r) {
        switch (a = r, t) {
          case providers.default.netEase:
            a.netEase = e;
            break;
          case providers.default.qqMusic:
            a.qqMusic = e;
        }
        storage.save({
          key: keys.default.playlist,
          data: a
        });
      }).catch(function () {
        switch (t) {
          case providers.default.netEase:
            a.netEase = e;
            break;
          case providers.default.qqMusic:
            a.qqMusic = e;
        }
        storage.save({
          key: keys.default.playlist,
          data: a
        });
      });
    },
    saveUserLikeList: function (e, t) {
      var a, r;
      return regeneratorRuntime.async(function (n) {
        for (;;) switch (n.prev = n.next) {
          case 0:
            a = {};
            n.next = 3;
            return regeneratorRuntime.awrap(c(keys.default.likelist));
          case 3:
            r = n.sent;
            types.isObject(r) && (a = r);
            n.t0 = t;
            n.next = n.t0 === providers.default.netEase ? 8 : n.t0 === providers.default.qqMusic ? 10 : 12;
            break;
          case 8:
            a.netEase = e;
            return n.abrupt("break", 12);
          case 10:
            a.qqMusic = e;
            return n.abrupt("break", 12);
          case 12:
            storage.save({
              key: keys.default.likelist,
              data: a
            });
          case 13:
          case "end":
            return n.stop();
        }
      }, null, this);
    },
    saveNeteasePlayListCache: function (e, t, a) {
      var r, n, s;
      return regeneratorRuntime.async(function (l) {
        for (;;) switch (l.prev = l.next) {
          case 0:
            r = [];
            l.next = 3;
            return regeneratorRuntime.awrap(c(keys.default.netEasePlaylistCache));
          case 3:
            (n = l.sent) && types.isArray(n) && (r = n.filter(function (t) {
              return t.id !== e;
            }));
            r.length > 64 && r.splice(0, 32);
            s = {
              tracks: a,
              name: t,
              id: e
            };
            r.push(s);
            storage.save({
              key: keys.default.netEasePlaylistCache,
              data: r
            });
          case 9:
          case "end":
            return l.stop();
        }
      }, null, this);
    },
    removeNetEasePlaylistCache: function (e) {
      var t, a, r, n, s, l;
      return regeneratorRuntime.async(function (o) {
        for (;;) switch (o.prev = o.next) {
          case 0:
            if (e) {
              o.next = 13;
              break;
            }
            o.next = 3;
            return regeneratorRuntime.awrap(c(keys.default.playlist));
          case 3:
            if (!(t = o.sent)) {
              o.next = 11;
              break;
            }
            if (!((a = t.netEase).length > 0)) {
              o.next = 11;
              break;
            }
            o.next = 9;
            return regeneratorRuntime.awrap(c(keys.default.netEasePlaylistCache));
          case 9:
            r = o.sent;
            types.isArray(r) && (n = r.filter(function (e) {
              return e.id !== a[0].id;
            }), storage.save({
              key: keys.default.netEasePlaylistCache,
              data: n
            }));
          case 11:
            o.next = 17;
            break;
          case 13:
            o.next = 15;
            return regeneratorRuntime.awrap(c(keys.default.netEasePlaylistCache));
          case 15:
            s = o.sent;
            types.isArray(s) && (l = s.filter(function (t) {
              return t.id !== e;
            }), storage.save({
              key: keys.default.netEasePlaylistCache,
              data: l
            }));
          case 17:
          case "end":
            return o.stop();
        }
      }, null, this);
    },
    getSettings: function () {
      return c(keys.default.settings);
    },
    getCharts: function () {
      return c(keys.default.charts);
    },
    saveCharts: function (e) {
      storage.save({
        key: keys.default.charts,
        data: e
      });
    },
    getRestUsers: function () {
      return c(keys.default.restUsers);
    },
    saveRestUsers: function (e) {
      storage.save({
        key: keys.default.restUsers,
        data: e
      });
    }
  };
exports.default = o;
