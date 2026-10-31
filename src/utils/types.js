Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.debounce =
  exports.isNumber =
  exports.noop =
  exports.isArray =
  exports.isString =
  exports.isObject =
    void 0;
exports.isObject = function (n) {
  return n === Object(n);
};
exports.isString = function (n) {
  return 'string' == typeof n;
};
var o = Array.isArray;
exports.isArray = o;
exports.noop = function () {};
exports.isNumber = function (n) {
  return 'number' == typeof n && n == n;
};
exports.debounce = function (n) {
  var r,
    e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
    i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
  return function () {
    for (var t = arguments.length, o = new Array(t), u = 0; u < t; u++) o[u] = arguments[u];
    var c = function () {
        r = null;
        i || n.apply(void 0, o);
      },
      a = i && !r;
    clearTimeout(r);
    r = setTimeout(function () {
      return c.apply(void 0, o);
    }, e);
    a && n.apply(void 0, o);
  };
};
