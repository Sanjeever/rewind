Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var i = function (e) {
    var t = e.navigation,
      n = e.scene,
      r = t.state.index === n.index,
      a = r ? 0 : 1e6;
    return {
      opacity: r ? 1 : 0,
      transform: [{
        translateX: a
      }, {
        translateY: a
      }]
    };
  },
  u = function (e) {
    var t = e.layout,
      n = e.position,
      r = e.scene;
    if (!t.isMeasured) return i(e);
    var a = r.index,
      u = [a - 1, a, a + .99, a + 1];
    return {
      opacity: n.interpolate({
        inputRange: u,
        outputRange: [0, 1, 1, 0]
      })
    };
  },
  o = function (e) {
    return {
      transitionSpec: e ? {
        duration: 0,
        useNativeDriver: true
      } : {
        useNativeDriver: true
      },
      screenInterpolator: function (e) {
        return u(e);
      }
    };
  };
exports.default = o;
