const _default = require("./../components/Text.js").default;
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireDefault(require("react")),
  ReactNative = require("react-native"),
  TouchableScale = _interopRequireDefault(require("../components/TouchableScale")),
  f = function (e) {
    var t = e.onPress,
      n = e.content;
    return React.default.createElement(TouchableScale.default, {
      onPress: t
    }, React.default.createElement(_default, {
      style: {
        fontSize: 18,
        marginTop: '15%',
        marginBottom: 10,
        fontWeight: 'bold'
      }
    }, n));
  };
exports.default = f;
