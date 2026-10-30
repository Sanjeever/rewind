Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNextPlayIndexByPagerPos = exports.getRandomArray = exports.getRandomIndex = exports.getNextPlayIndex = void 0;
var utils = require("../utils/index");
exports.getNextPlayIndex = function (e) {
  var n = e.type,
    a = e.tracks,
    r = e.playingIndex;
  r += 'next' === n ? 1 : -1;
  return r = (0, utils.keepBound)(r, a.length);
};
var o = function (e) {
  var n = e.type,
    a = e.randomArray,
    r = e.playingIndex,
    t = a.indexOf(r);
  switch (n) {
    case 'next':
    case 'random':
      t += 1;
      break;
    case 'pre':
      t -= 1;
  }
  return a[t = (0, utils.keepBound)(t, a.length)];
};
exports.getRandomIndex = o;
exports.getRandomArray = function (e, n) {
  for (var a = Array(n), r = 0; r < n; r++) a[r] = r;
  var t = (0, utils.shuffle)(a);
  e.setState({
    randomArray: t
  });
};
exports.getNextPlayIndexByPagerPos = function (e) {
  var n = e.pos,
    a = e.playMode,
    r = e.randomArray,
    t = e.playingIndex,
    y = e.len;
  return 1 === n ? t : 'random' === a ? o({
    type: 0 === n ? 'pre' : 'next',
    randomArray: r,
    playingIndex: t
  }) : (t += 0 === n ? -1 : 1, (0, utils.keepBound)(t, y));
};
