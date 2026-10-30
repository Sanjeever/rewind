Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  _ = require("./index"),
  o = function (e) {
    function t() {
      babelHelpers.classCallCheck(this, t);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(t).apply(this, arguments));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        var e = this.props,
          t = e.onPress,
          r = e.name,
          l = e.size,
          n = e.disabled;
        return React.default.createElement(ReactNative.View, {
          style: {
            alignItems: 'center',
            justifyContent: 'center',
            height: 80,
            width: 80
          }
        }, React.default.createElement(ReactNative.TouchableOpacity, {
          onPress: t,
          disabled: n
        }, React.default.createElement(_.Icon, {
          name: r,
          size: l || 20
        })));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = o;
