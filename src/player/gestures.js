Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var u = {
  isOverEdge: function (e) {
    var t = e.gestureState,
      r = e.DEVICE_WIDTH,
      a = t.moveX;
    return a > 65 && a < r - 65;
  },
  stepMap: function (e) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 10,
      r = -e;
    return Math.abs(e) >= t ? r >= 0 ? t : -t : r;
  }
};
exports.default = u;
