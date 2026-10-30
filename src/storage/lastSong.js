Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var keys = babelHelpers.interopRequireDefault(require("./keys")),
  o = {
    get: function (e) {
      return storage.load({
        key: keys.default.lastPlayedSong
      }).then(function (t) {
        if (t) return t[e];
      }).catch(function () {
        return false;
      });
    },
    save: function (e, t) {
      return regeneratorRuntime.async(function (a) {
        for (;;) switch (a.prev = a.next) {
          case 0:
            if (e) {
              a.next = 2;
              break;
            }
            return a.abrupt("return");
          case 2:
            storage.load({
              key: keys.default.lastPlayedSong
            }).then(function (a) {
              if (!a) throw new Error('NMSL');
              a[e] = t;
              storage.save({
                key: keys.default.lastPlayedSong,
                data: a
              });
            }).catch(function () {
              var a = {};
              a[e] = t;
              storage.save({
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
