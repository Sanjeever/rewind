const _default = require("./../components/Text.js").default;
const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  components = require("../components/index"),
  providers = _interopRequireDefault(require("../services/providers")),
  icons = _interopRequireDefault(require("../theme/icons")),
  o = class a extends React.PureComponent {
    constructor(e) {
      var r;
      (r = super(e)).renderApiIcon = function (e) {
        var a;
        switch (e) {
          case providers.default.netEase:
            a = require("../../assets/images/netease.png");
            break;
          case providers.default.qqMusic:
            a = require("../../assets/images/qqmusic.png");
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
    "componentDidUpdate"(e) {
      this.props.active !== e.active && ReactNative.Animated.timing(this._active, {
        duration: 300,
        easing: ReactNative.Easing.bounce,
        toValue: Number(this.props.active)
      }).start();
    }
    "render"() {
      var e = this.props,
        t = e.data;
      return 'pages' === e.type ? React.default.createElement(ReactNative.Animated.View, {
        style: [d.row, this._style]
      }, React.default.createElement(components.Icon, {
        name: t.icon.name,
        style: {
          marginRight: 10
        }
      }), React.default.createElement(_default, null, t.title)) : React.default.createElement(ReactNative.Animated.View, {
        style: [d.row, {
          marginLeft: 2
        }, this._style]
      }, this.renderApiIcon(t), React.default.createElement(_default, null, t));
    }
  };
exports.default = o;
var d = ReactNative.StyleSheet.create({
  row: {
    paddingHorizontal: 5,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center'
  }
});
