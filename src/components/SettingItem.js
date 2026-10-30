const _default = require("./Text.js").default;
const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  components = require("./index"),
  icons = _interopRequireDefault(require("../theme/icons")),
  u = class t extends React.PureComponent {
    constructor() {
      var e, r, l;
      for (var n = arguments.length, a = new Array(n), o = 0; o < n; o++) a[o] = arguments[o];
      return r = l = super(...a), l.handleOnPress = function () {
        requestAnimationFrame(function () {
          var e, t, r, n;
          null === (e = (t = l.props).onPress) || void 0 === e || e.call(t);
          null === (r = (n = l.props).onSwitch) || void 0 === r || r.call(n);
        });
      }, r;
    }
    "render"() {
      var e = this.props,
        t = e.title,
        r = e.subtitle,
        l = e.onLongPress,
        n = e.coverImg,
        u = e.coverImgStyle,
        d = e.containerStyle,
        f = e.rounded,
        b = e.titleStyle,
        h = e.textStyle,
        p = e.numberOfLines,
        m = e.textConStyle,
        y = e.switchButton,
        g = e.switched,
        v = e.onSwitch,
        S = e.showChevron;
      return React.default.createElement(ReactNative.TouchableNativeFeedback, {
        onPress: this.handleOnPress,
        onLongPress: l
      }, React.default.createElement(ReactNative.View, {
        style: [c.container, d]
      }, n && React.default.createElement(ReactNative.Image, {
        source: {
          uri: n
        },
        style: [c.coverImg, f && c.rounded, u]
      }), React.default.createElement(ReactNative.View, {
        style: [{
          paddingLeft: 10,
          flex: 1
        }, m]
      }, React.default.createElement(_default, {
        numberOfLines: p || 1,
        style: [c.text, b, h]
      }, t), r ? React.default.createElement(_default, {
        numberOfLines: 1,
        style: [c.text, c.subtitle, h]
      }, r) : null), y && React.default.createElement(components.Switch, {
        value: g,
        onValueChange: v
      }), S && React.default.createElement(components.Icon, {
        name: icons.default.CHEVRON_RIGHT,
        style: {
          marginRight: 10
        }
      })));
    }
  },
  c = ReactNative.StyleSheet.create({
    container: {
      height: 50,
      flexDirection: 'row',
      alignItems: 'center'
    },
    text: {
      fontSize: 14
    },
    subtitle: {
      opacity: .5,
      fontSize: 12
    },
    coverImg: {
      width: 50,
      height: 50,
      marginLeft: 5,
      borderRadius: 3
    },
    rounded: {
      borderRadius: 25
    }
  }),
  d = u;
exports.default = d;
