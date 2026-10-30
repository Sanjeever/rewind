Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeSpringScrollview = require("react-native-spring-scrollview"),
  i = function (e) {
    function r() {
      var e, t, n;
      babelHelpers.classCallCheck(this, r);
      for (var l = arguments.length, a = new Array(l), s = 0; s < l; s++) a[s] = arguments[s];
      return babelHelpers.possibleConstructorReturn(n, (t = n = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(r)).call.apply(e, [this].concat(a))), n._nativeOffset = {
        x: new ReactNative.Animated.Value(0),
        y: new ReactNative.Animated.Value(0)
      }, n._renderForeground = function () {
        var e = n.props.renderForeground;
        if (e) return e(n._nativeOffset);
      }, t));
    }
    babelHelpers.createClass(r, [{
      key: "render",
      value: function () {
        var e = this.props,
          r = e.children,
          t = e.onRef,
          n = babelHelpers.objectWithoutProperties(e, ["children", "onRef"]);
        return React.default.createElement(reactNativeSpringScrollview.SpringScrollView, babelHelpers.extends({
          onNativeContentOffsetExtract: this._nativeOffset
        }, n, {
          ref: function (e) {
            return t && t(e);
          }
        }), this._renderForeground(), r);
      }
    }]);
    babelHelpers.inherits(r, e);
    return r;
  }(React.PureComponent);
exports.default = i;
