Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var accordionCollapseReactNative = babelHelpers.interopRequireDefault(require("accordion-collapse-react-native")),
  React = babelHelpers.interopRequireDefault(require("react")),
  reactNativeSpringScrollview = require("react-native-spring-scrollview"),
  _ = require("./index"),
  constants = require("../theme/constants"),
  module822 = require("../modules/module-822"),
  f = function (e) {
    function t() {
      babelHelpers.classCallCheck(this, t);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(t).apply(this, arguments));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        if ('refreshing' === this.state.status) return React.default.createElement(_.Spinkit, null);
        var e = this.props.offset.interpolate({
          inputRange: [-120, -60],
          outputRange: [1, 0]
        });
        return React.default.createElement(accordionCollapseReactNative.default, {
          source: module822,
          progress: e,
          style: {
            height: constants.SPINKIT_SIZE,
            width: constants.SPINKIT_SIZE,
            alignSelf: 'center'
          }
        });
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(reactNativeSpringScrollview.RefreshHeader);
exports.default = f;
