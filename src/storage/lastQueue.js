Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var keys = babelHelpers.interopRequireDefault(require("./keys")),
  events = require("../events/index"),
  o = function () {
    return storage.load({
      key: keys.default.lastPlayedTracks
    }).then(function (e) {
      if (e) return e;
      throw new Error('Could not load');
    });
  },
  l = {
    save: function (e) {
      var a = e.tracks,
        t = e.index,
        n = e.api;
      storage.save({
        key: keys.default.lastPlayedTracks,
        data: {
          tracks: a,
          index: t,
          api: n
        }
      });
    },
    load: o,
    emit: function () {
      o().then(function (e) {
        var a = e.tracks,
          t = e.index,
          n = e.api;
        a && n && (0, events.toPlayer)({
          item: a[t],
          data: a,
          index: t,
          api: n
        });
      });
    }
  };
exports.default = l;
