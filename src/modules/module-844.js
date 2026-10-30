Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  components = require("../components/index"),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  o = function (e) {
    function a(e) {
      var r;
      babelHelpers.classCallCheck(this, a);
      (r = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(a).call(this, e))).renderApiIcon = function (e) {
        var a;
        switch (e) {
          case providers.default.netEase:
            a = require("./module-845");
            break;
          case providers.default.qqMusic:
            a = require("./module-846");
        }
        return React.default.createElement(ReactNative.View, {
          style: {
            marginRight: 10
          }
        }, a ? React.default.createElement(ReactNative.Image, {
          source: a,
          style: {
            height: 22,
            width: 22
          }
        }) : React.default.createElement(components.Icon, {
          name: icons.default.DISC
        }));
      };
      r._active = new ReactNative.Animated.Value(0);
      r._style = {
        transform: [{
          scale: r._active.interpolate({
            inputRange: [0, 1],
            outputRange: [1, .9]
          })
        }]
      };
      return r;
    }
    babelHelpers.createClass(a, [{
      key: "componentDidUpdate",
      value: function (e) {
        this.props.active !== e.active && ReactNative.Animated.timing(this._active, {
          duration: 300,
          easing: ReactNative.Easing.bounce,
          toValue: Number(this.props.active)
        }).start();
      }
    }, {
      key: "render",
      value: function () {
        var e = this.props,
          t = e.data;
        return 'pages' === e.type ? React.default.createElement(ReactNative.Animated.View, {
          style: [d.row, this._style]
        }, React.default.createElement(components.Icon, {
          name: t.icon.name,
          style: {
            marginRight: 10
          }
        }), React.default.createElement(ReactNative.Text, null, t.title)) : React.default.createElement(ReactNative.Animated.View, {
          style: [d.row, {
            marginLeft: 2
          }, this._style]
        }, this.renderApiIcon(t), React.default.createElement(ReactNative.Text, null, t));
      }
    }]);
    babelHelpers.inherits(a, e);
    return a;
  }(React.PureComponent);
exports.default = o;
var d = ReactNative.StyleSheet.create({
  row: {
    paddingHorizontal: 5,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center'
  }
});
