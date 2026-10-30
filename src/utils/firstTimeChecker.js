const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _asyncRuntime = require("@babel/runtime/helpers/regeneratorRuntime")();
const _appStorage = require("./../storage/index.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.check = void 0;
var keys = _interopRequireDefault(require("../storage/keys")),
  u = function () {
    var e;
    return _asyncRuntime.async(function (t) {
      for (;;) switch (t.prev = t.next) {
        case 0:
          e = false;
          t.prev = 1;
          t.next = 4;
          return _asyncRuntime.awrap(_appStorage.storage.load({
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
    return _asyncRuntime.async(function (e) {
      for (;;) switch (e.prev = e.next) {
        case 0:
          _appStorage.storage.save({
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
