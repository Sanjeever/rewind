Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _ = babelHelpers.interopRequireDefault(require("@runtime/40")),
  React = babelHelpers.interopRequireDefault(require("react")),
  ReactNative = require("react-native"),
  _2 = babelHelpers.interopRequireDefault(require("@runtime/381")),
  iconGlyphs = babelHelpers.interopRequireDefault(require("../theme/iconGlyphs")),
  d = (0, _2.default)(iconGlyphs.default, 'Material Design Icons', 'MaterialCommunityIcons.ttf'),
  c = function (e) {
    var r = e.onPress,
      t = e.component,
      o = ReactNative.View;
    r && (o = ReactNative.TouchableOpacity);
    t && (o = t);
    return o;
  },
  f = function (e) {
    var r = e.reverse,
      t = e.raised,
      o = e.size,
      n = Object.create(null);
    (r || t) && (n = ReactNative.StyleSheet.flatten([n.button, {
      borderRadius: o + 4,
      height: 2 * o + 4,
      width: 2 * o + 4
    }]));
    return n;
  },
  b = function (e) {
    var r = e.name,
      t = e.size,
      o = e.color,
      n = e.iconStyle,
      l = e.component,
      s = e.underlayColor,
      i = e.reverse,
      u = e.raised,
      b = e.containerStyle,
      y = e.reverseColor,
      v = e.onPress,
      m = babelHelpers.objectWithoutProperties(e, ["name", "size", "color", "iconStyle", "component", "underlayColor", "reverse", "raised", "containerStyle", "reverseColor", "onPress"]),
      C = c({
        onPress: v,
        component: l
      });
    return React.default.createElement(C, babelHelpers.extends({
      underlayColor: i ? o : s || o,
      style: [f({
        reverse: i,
        raised: u,
        size: t
      }), u && p.raised, {
        backgroundColor: i ? o : u ? 'white' : 'transparent',
        alignItems: 'center',
        justifyContent: 'center'
      }, b && b],
      onPress: v
    }, m), React.default.createElement(d, {
      style: [{
        backgroundColor: 'transparent'
      }, n && n],
      size: t,
      name: r,
      color: i ? y : o
    }));
  };
b.propTypes = {
  type: _.default.string,
  name: _.default.string,
  size: _.default.number,
  color: _.default.string,
  component: _.default.element,
  underlayColor: _.default.string,
  reverse: _.default.bool,
  raised: _.default.bool,
  onPress: _.default.func,
  reverseColor: _.default.string
};
b.defaultProps = {
  underlayColor: 'white',
  reverse: false,
  raised: false,
  size: 24,
  reverseColor: 'white'
};
var p = ReactNative.StyleSheet.create({
    button: {
      margin: 7
    },
    raised: babelHelpers.objectSpread({}, {
      elevation: 2
    })
  }),
  y = b;
exports.default = y;
