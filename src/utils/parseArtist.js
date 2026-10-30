Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var a = function (e) {
  if (e) return Array.isArray(e) ? e.map(function (e) {
    return e.name;
  }).join('/') : e;
};
exports.default = a;
