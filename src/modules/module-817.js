Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var o = function (e) {
  var r = e.transNames,
    a = e.alias,
    n = e.trans,
    t = babelHelpers.toConsumableArray(r || []).concat(babelHelpers.toConsumableArray(a || []), [n]).filter(function (e) {
      return '' != e;
    });
  return Array.from(new Set(t)).join(' / ');
};
exports.default = o;
