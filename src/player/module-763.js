Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireDefault(require("react")),
  buttons = babelHelpers.interopRequireDefault(require("./buttons")),
  module752 = babelHelpers.interopRequireDefault(require("./module-752")),
  d = function (e) {
    var a,
      t = e.playMode,
      l = e.onPress,
      r = e.color,
      d = e.size,
      f = e.style;
    switch (t) {
      case 'list':
        a = {
          name: buttons.default.REPEAT.name,
          type: buttons.default.REPEAT.type
        };
        break;
      case 'random':
        a = {
          name: buttons.default.RANDOM.name,
          type: buttons.default.RANDOM.type
        };
        break;
      case 'circulate':
        a = {
          name: buttons.default.CIRLUATE.name,
          type: buttons.default.CIRLUATE.type
        };
    }
    return React.default.createElement(module752.default, {
      onPress: l,
      name: a.name || null,
      type: a.type,
      size: d || 28,
      color: r,
      style: f
    });
  };
exports.default = d;
