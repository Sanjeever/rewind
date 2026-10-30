Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  o = function (e) {
    function r() {
      babelHelpers.classCallCheck(this, r);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(r).apply(this, arguments));
    }
    babelHelpers.createClass(r, [{
      key: "render",
      value: function () {
        var e = this.props,
          r = e.children,
          l = babelHelpers.objectWithoutProperties(e, ["children"]);
        return React.default.createElement(ReactNative.Text, babelHelpers.extends({
          selectable: true,
          selectionColor: "#e41749"
        }, l), r);
      }
    }]);
    babelHelpers.inherits(r, e);
    return r;
  }(React.PureComponent);
exports.default = o;
