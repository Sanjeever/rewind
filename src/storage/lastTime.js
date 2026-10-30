Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var keys = babelHelpers.interopRequireDefault(require("./keys")),
  o = {
    get: function () {
      return new Promise(function (e) {
        storage.load({
          key: keys.default.lastPlayedTime
        }).then(function (t) {
          return e(t);
        }).catch(function () {
          return e(0);
        });
      });
    },
    save: function () {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
      return new Promise(function (t) {
        storage.save({
          key: keys.default.lastPlayedTime,
          data: e
        }).then(function () {
          return t(true);
        }).catch(function () {
          return t(false);
        });
      });
    }
  };
exports.default = o;
