const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _appStorage = require("./index.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var keys = _interopRequireDefault(require("./keys")),
  events = require("../events/index"),
  o = function () {
    return _appStorage.storage.load({
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
      _appStorage.storage.save({
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
