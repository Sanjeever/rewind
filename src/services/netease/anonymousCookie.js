function a(e, n) {
  return Array.from(Array(n))
    .map(function () {
      return e[Math.floor(Math.random() * e.length)];
    })
    .join('');
}
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var u =
    a('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKMNOPQRSTUVWXYZ\\/+', 176) + ':' + Date.now(),
  _ = a('0123456789abcdefghijklmnopqrstuvwxyz', 32),
  d =
    'JSESSIONID-WYYY=' +
    u +
    '; _iuqxldmzr_=32; _ntes_nnid=' +
    _ +
    ',' +
    Date.now() +
    '; _ntes_nuid=' +
    _ +
    '; os=pc; appver=2.10.6; __remember_me=true; NMTID=xxx;';
exports.default = d;
