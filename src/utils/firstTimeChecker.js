Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.check = void 0;
var keys = babelHelpers.interopRequireDefault(require("../storage/keys")),
  u = function () {
    var e;
    return regeneratorRuntime.async(function (t) {
      for (;;) switch (t.prev = t.next) {
        case 0:
          e = false;
          t.prev = 1;
          t.next = 4;
          return regeneratorRuntime.awrap(storage.load({
            key: keys.default.firstTime
          }));
        case 4:
          e = t.sent;
          t.next = 11;
          break;
        case 7:
          t.prev = 7;
          t.t0 = t.catch(1);
          e = true;
          s();
        case 11:
          return t.abrupt("return", e);
        case 12:
        case "end":
          return t.stop();
      }
    }, null, this, [[1, 7]]);
  };
exports.check = u;
var s = function () {
    return regeneratorRuntime.async(function (e) {
      for (;;) switch (e.prev = e.next) {
        case 0:
          storage.save({
            key: keys.default.firstTime,
            data: false
          });
        case 1:
        case "end":
          return e.stop();
      }
    }, null, this);
  },
  i = {
    check: u
  };
exports.default = i;
