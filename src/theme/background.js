Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initBackgroundState = exports.getBackground = void 0;
var keys = babelHelpers.interopRequireDefault(require("../storage/keys")),
  files = require("../storage/files"),
  o = {},
  i = false;
exports.getBackground = function () {
  return i ? o : s();
};
var s = function () {
  var e;
  return regeneratorRuntime.async(function (r) {
    for (;;) switch (r.prev = r.next) {
      case 0:
        r.prev = 0;
        r.next = 3;
        return regeneratorRuntime.awrap(storage.load({
          key: keys.default.background
        }));
      case 3:
        if ('string' == typeof (e = r.sent).path) {
          r.next = 10;
          break;
        }
        r.next = 7;
        return regeneratorRuntime.awrap(p());
      case 7:
        o = r.sent;
        r.next = 11;
        break;
      case 10:
        o = {
          url: e.path,
          opacity: e.opacity,
          blur: e.blur,
          error: false
        };
      case 11:
        return r.abrupt("return", o);
      case 14:
        r.prev = 14;
        r.t0 = r.catch(0);
        o = {
          error: true
        };
        return r.abrupt("return", o);
      case 18:
        r.prev = 18;
        i = true;
        return r.finish(18);
      case 21:
      case "end":
        return r.stop();
    }
  }, null, this, [[0, 14, 18, 21]]);
};
exports.initBackgroundState = s;
var p = function () {
  return (0, files.getBackgroundCache)().then(function (e) {
    return e ? {
      url: e,
      opacity: .7
    } : {
      error: true
    };
  });
};
