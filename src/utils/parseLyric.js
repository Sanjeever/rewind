Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var i = function (t) {
    var n = {},
      e = t.replace(/(^\s*)|(\s*$)/g, ''),
      r = e.indexOf(']'),
      s = e.substring(1, r),
      i = '',
      u = s.indexOf('.');
    -1 !== u ? (i = s.substring(1, e.indexOf('.')), n.ms = 0 | s.substring(u + 1, r)) : (i = s, n.ms = 0);
    var a = i.split(':');
    n.min = 0 | a[0];
    n.sec = 0 | a[1];
    n.txt = e.substring(r + 1, e.length);
    n.txt = n.txt.replace(/(^\s*)|(\s*$)/g, '');
    n.dis = false;
    n.total = 60 * n.min + n.sec + n.ms / 1e3;
    return n;
  },
  u = function (t) {
    var n = [];
    t.split('\n').forEach(function (t) {
      var e = i(t),
        r = new RegExp('[.+]', 'gi');
      if (e.txt.length > 0 && n.push(e), e.txt.match(r)) {
        var s = i(e.txt);
        n.push(s);
      }
    });
    n.sort(function (t, n) {
      return t.total > n.total ? 1 : -1;
    });
    return n.filter(function (t) {
      return t.total > 0 && t.txt.length > 0;
    });
  };
exports.default = u;
