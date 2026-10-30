Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireDefault(require("react")),
  components = require("../../components/index"),
  i = function (e) {
    var t = e.icon,
      n = e.onPress;
    return React.default.createElement(components.TouchableBorderless, {
      onPress: n,
      style: {
        padding: 8
      },
      size: 50
    }, React.default.createElement(components.Icon, {
      name: t.name,
      color: t.color,
      size: 25,
      style: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
      }
    }));
  };
exports.default = i;
