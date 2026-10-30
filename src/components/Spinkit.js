Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var accordionCollapseReactNative = babelHelpers.interopRequireDefault(require("accordion-collapse-react-native")),
  React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  constants = require("../theme/constants"),
  loading = require("../../assets/animations/loading"),
  p = function (e) {
    function t() {
      babelHelpers.classCallCheck(this, t);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(t).apply(this, arguments));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        var e = this.props,
          t = e.size,
          l = void 0 === t ? constants.SPINKIT_SIZE : t,
          r = e.style;
        return React.default.createElement(ReactNative.View, {
          style: [{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }, r]
        }, React.default.createElement(accordionCollapseReactNative.default, {
          loop: true,
          autoPlay: true,
          source: loading,
          style: {
            height: l,
            width: l,
            alignItems: 'center'
          },
          duration: 2e3
        }));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = p;
