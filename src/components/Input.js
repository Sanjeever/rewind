Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  constants = require("../theme/constants"),
  p = function (e) {
    function r() {
      babelHelpers.classCallCheck(this, r);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(r).apply(this, arguments));
    }
    babelHelpers.createClass(r, [{
      key: "render",
      value: function () {
        var e = this.props,
          r = e.style,
          t = e.maxLength,
          l = babelHelpers.objectWithoutProperties(e, ["style", "maxLength"]);
        return React.default.createElement(ReactNative.TextInput, babelHelpers.extends({
          autoCorrect: false,
          maxLength: t || 40,
          underlineColorAndroid: 'transparent',
          style: [{
            color: constants.COLORS.primary
          }, r],
          placeholderTextColor: constants.COLORS.primaryAlpha70,
          selectionColor: constants.COLORS.primaryAlpha70
        }, l));
      }
    }]);
    babelHelpers.inherits(r, e);
    return r;
  }(React.PureComponent);
exports.default = p;
