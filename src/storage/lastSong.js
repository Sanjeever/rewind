const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _appStorage = require("./index.js");
const _asyncRuntime = require("regenerator-runtime");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var keys = _interopRequireDefault(require("./keys")),
  o = {
    get: function (e) {
      return _appStorage.storage.load({
        key: keys.default.lastPlayedSong
      }).then(function (t) {
        if (t) return t[e];
      }).catch(function () {
        return false;
      });
    },
    save: function (e, t) {
      return _asyncRuntime.async(function (a) {
        for (;;) switch (a.prev = a.next) {
          case 0:
            if (e) {
              a.next = 2;
              break;
            }
            return a.abrupt("return");
          case 2:
            _appStorage.storage.load({
              key: keys.default.lastPlayedSong
            }).then(function (a) {
              if (!a) throw new Error('NMSL');
              a[e] = t;
              _appStorage.storage.save({
                key: keys.default.lastPlayedSong,
                data: a
              });
            }).catch(function () {
              var a = {};
              a[e] = t;
              _appStorage.storage.save({
                key: keys.default.lastPlayedSong,
                data: a
              });
            });
          case 3:
          case "end":
            return a.stop();
        }
      }, null, this);
    }
  };
exports.default = o;
