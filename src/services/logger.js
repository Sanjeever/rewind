Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var Runtime660 = babelHelpers.interopRequireDefault(require("@runtime/660")),
  info = require("../native/info"),
  types = require("../utils/types"),
  f = 0;
function d(e, t) {
  var o;
  try {
    o = JSON.stringify({
      id: f++,
      level: e,
      data: t
    });
  } catch (t) {
    o = JSON.stringify({
      id: f++,
      level: e,
      data: [t.message]
    });
  }
  fetch((0, Runtime660.default)().url + 'log-to-console', {
    method: 'POST',
    body: o
  });
}
var u = info.isDebug ? function () {
  for (var e = arguments.length, t = new Array(e), o = 0; o < e; o++) t[o] = arguments[o];
  for (var r = 0; r < t.length; r++) {
    var a = t[r];
    d('log', 'function' == typeof a ? String(a) : a);
  }
} : types.noop;
exports.default = u;
