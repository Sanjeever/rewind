Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireDefault(require("react")),
  ReactNative = require("react-native"),
  TouchableScale = babelHelpers.interopRequireDefault(require("../components/TouchableScale")),
  components = require("../components/index"),
  s = function (e) {
    var t = e.name,
      r = e.size,
      a = void 0 === r ? 28 : r,
      l = e.color,
      s = e.disabled,
      u = void 0 !== s && s,
      c = e.style,
      f = e.onPress,
      b = e.onLongPress;
    return React.default.createElement(ReactNative.View, {
      style: [{
        height: a + 12,
        width: a + 12,
        borderRadius: (a + 12) / 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0)'
      }, c]
    }, React.default.createElement(TouchableScale.default, {
      activeScale: .8,
      disabled: u,
      onPress: f,
      onLongPress: b
    }, React.default.createElement(components.Icon, {
      size: a,
      name: t,
      color: l
    })));
  };
exports.default = s;
