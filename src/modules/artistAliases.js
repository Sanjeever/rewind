const _toConsumableArray = require('@babel/runtime/helpers/toConsumableArray');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var o = function (e) {
  var r = e.transNames,
    a = e.alias,
    n = e.trans,
    t = _toConsumableArray(r || [])
      .concat(_toConsumableArray(a || []), [n])
      .filter(function (e) {
        return '' != e;
      });
  return Array.from(new Set(t)).join(' / ');
};
exports.default = o;
