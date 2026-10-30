const _asyncRuntime = require("@babel/runtime/helpers/regeneratorRuntime")();
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var ReactNative = require("react-native"),
  trackInfo = require("../services/trackInfo"),
  o = ReactNative.NativeModules.RNMediaStore,
  c = function () {
    return o.getPlayList();
  },
  s = function (t) {
    var e = t.formattedItem,
      r = t.localItem,
      n = e.singer[0].name + ' - ' + e.song,
      a = e.song === r.title && e.singer[0].name === r.singer,
      u = n === r.title;
    return a || u;
  },
  l = {
    getPlayList: c,
    getArtWork: function (t) {
      return o.getArtWork(t);
    },
    attachLocalPath: function (t) {
      var e, r, n;
      return _asyncRuntime.async(function (a) {
        for (;;) switch (a.prev = a.next) {
          case 0:
            e = t;
            a.next = 3;
            return _asyncRuntime.awrap(c());
          case 3:
            if ((r = a.sent) && r.numbers && !(r.numbers < 1)) {
              a.next = 6;
              break;
            }
            return a.abrupt("return", e);
          case 6:
            if ((n = r.data.filter(function (t) {
              return t.duration / 1e3 > 60;
            })) && !(n.length < 1)) {
              a.next = 9;
              break;
            }
            return a.abrupt("return", e);
          case 9:
            return a.abrupt("return", e.map(function (t) {
              var e = (0, trackInfo.extractBasicInfo)(t);
              n.map(function (r) {
                e.singer && s({
                  formattedItem: e,
                  localItem: r
                }) && (t.localPath = r.path);
              });
              return t;
            }));
          case 10:
          case "end":
            return a.stop();
        }
      }, null, this);
    }
  };
exports.default = l;
