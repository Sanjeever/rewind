const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _objectWithoutProperties = require("@babel/runtime/helpers/objectWithoutProperties");
const _extends = require("@babel/runtime/helpers/extends");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeSpringScrollview = require("./Scrolling.js"),
  i = class r extends React.PureComponent {
    constructor() {
      var e, t, n;
      for (var l = arguments.length, a = new Array(l), s = 0; s < l; s++) a[s] = arguments[s];
      return t = n = super(...a), n._nativeOffset = {
        x: new ReactNative.Animated.Value(0),
        y: new ReactNative.Animated.Value(0)
      }, n._renderForeground = function () {
        var e = n.props.renderForeground;
        if (e) return e(n._nativeOffset);
      }, t;
    }
    "render"() {
      var e = this.props,
        r = e.children,
        t = e.onRef,
        n = _objectWithoutProperties(e, ["children", "onRef"]);
      return React.default.createElement(reactNativeSpringScrollview.SpringScrollView, _extends({
        onNativeContentOffsetExtract: this._nativeOffset
      }, n, {
        ref: function (e) {
          return t && t(e);
        }
      }), this._renderForeground(), r);
    }
  };
exports.default = i;
