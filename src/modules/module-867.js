Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  components = require("../components/index"),
  constants = require("../theme/constants"),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  d = function (e) {
    function t() {
      babelHelpers.classCallCheck(this, t);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(t).apply(this, arguments));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        var e = this.props,
          t = e.isOpen,
          n = e.onRequestClose;
        return React.default.createElement(ReactNative.Modal, {
          visible: t,
          backdropOpacity: .8,
          onRequestClose: n,
          position: "center",
          animationType: "fade"
        }, React.default.createElement(ReactNative.View, {
          style: {
            flex: 1,
            padding: 20,
            paddingTop: constants.STATUS_BAR_HEIGHT + 20
          }
        }, React.default.createElement(components.Background, null), React.default.createElement(ReactNative.View, {
          style: {
            justifyContent: 'center',
            flexDirection: 'row',
            paddingHorizontal: 10
          }
        }, React.default.createElement(components.Icon, {
          name: icons.default.WINDOW_CLOSE,
          size: 25,
          onPress: n
        })), React.default.createElement(ReactNative.View, {
          style: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }
        }, React.default.createElement(ReactNative.Text, {
          style: {
            fontSize: 16
          }
        }, "1.\u5f53\u4f7f\u7528QQ\u767b\u5165\u6216\u5fae\u535a\u767b\u5165\u65f6\uff0c\u53ef\u80fd\u4f1a\u770b\u5230 { code:401, msg:'\u6388\u6743\u51fa\u73b0\u5f02\u5e38' } \u76f8\u5173\u63d0\u793a\uff0c\u8bf7\u8fd4\u56de\u767b\u5165\u754c\u9762\u70b9\u51fb\u767b\u51fa\u540e\u91cd\u8bd5\u3002\n                  \n2.\u65e0\u6cd5\u767b\u5165\u7684\u539f\u56e0\u4e00\u822c\u6709\uff1a\n                  \n\ti.\u8bbe\u7f6e\u4e86\u767b\u5165\u4fdd\u62a4\uff08\u7f51\u6613\u4e91\u97f3\u4e50 - \u8bbe\u7f6e - \u767b\u5165\u4fdd\u62a4 - \u5173\u95ed\uff09\n                  \n\tii.\u767b\u5165\u8d85\u65f6\uff08\u5f53\u7528\u90ae\u7bb1\u6216\u624b\u673a\u53f7\u767b\u5165\u65f6\u9700\u8981\u8dd1\u7f51\u6613\u4e91\u767b\u5165\u7b97\u6cd5\uff0c\u8fc7\u91cf\u8bf7\u6c42\u6709\u65f6\u5019\u4f1a\u88ab\u62d2\u7edd\uff09\n                  \n\tiii.\u91cd\u590d\u767b\u5165\uff08\u5373\u4f7f\u7528\u4e0d\u540c\u7aef\u767b\u5165\u65f6\u51b2\u7a81\uff0c\u4f1a\u88ab\u62d2\u7edd\u8bbf\u95ee\uff09\n              "))));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = d;
