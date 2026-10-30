Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  o = function (e) {
    function t() {
      babelHelpers.classCallCheck(this, t);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(t).apply(this, arguments));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        var e = this.props,
          t = e.lyric,
          l = e.trans,
          n = e.onPress,
          r = e.style,
          o = e.hidden;
        return React.default.createElement(ReactNative.TouchableOpacity, {
          onPress: n,
          activeOpacity: .6
        }, React.default.createElement(ReactNative.View, {
          style: [s.textCon, r, o && {
            opacity: 0
          }]
        }, (null === t || void 0 === t ? void 0 : t.length) > 0 ? React.default.createElement(ReactNative.Text, {
          style: [s.text]
        }, t) : null, (null === l || void 0 === l ? void 0 : l.length) > 0 ? React.default.createElement(ReactNative.Text, {
          style: [s.text]
        }, l || '') : null));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = o;
var s = ReactNative.StyleSheet.create({
  textCon: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    padding: 8,
    paddingHorizontal: 20
  },
  text: {
    color: '#000',
    fontSize: 16
  }
});
