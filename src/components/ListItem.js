Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  TouchableScale = babelHelpers.interopRequireDefault(require("./TouchableScale")),
  _ = require("./index"),
  constants = require("../theme/constants"),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  d = '6y-UleORITEDbvrOLV0Q8A==/5639395138885805',
  f = function (e) {
    function t() {
      var e, r, n;
      babelHelpers.classCallCheck(this, t);
      for (var l = arguments.length, o = new Array(l), u = 0; u < l; u++) o[u] = arguments[u];
      return babelHelpers.possibleConstructorReturn(n, (r = n = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(o))), n.state = {
        imgError: false
      }, n.renderImg = function () {
        var e = n.state.imgError,
          t = n.props,
          r = t.img,
          l = t.errorIconName;
        return !r || true === e || r.includes(d) ? React.default.createElement(ReactNative.View, {
          style: [b.img, {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#111'
          }]
        }, React.default.createElement(_.Icon, {
          name: l || icons.default.ACCOUNT_MUSIC
        })) : React.default.createElement(ReactNative.Image, {
          style: b.img,
          source: {
            uri: r
          },
          onError: function () {
            return n.setState({
              imgError: true
            });
          }
        });
      }, n.renderTitle = function () {
        var e = n.props,
          t = e.title,
          r = e.trans,
          l = e.vip,
          o = e.numberOfLines;
        return '\u2661' === t ? React.default.createElement(_.Icon, {
          name: icons.default.HEART_OUTLINE,
          style: {
            backgroundColor: 0
          },
          size: 23
        }) : r ? React.default.createElement(ReactNative.Text, {
          numberOfLines: o,
          style: [b.bold, b.title]
        }, t, React.default.createElement(ReactNative.Text, {
          style: [b.trans]
        }, " (", r, ")")) : l ? React.default.createElement(ReactNative.View, {
          style: {
            flexDirection: 'row',
            alignItems: 'center'
          }
        }, React.default.createElement(ReactNative.Text, {
          numberOfLines: o,
          style: [b.bold, b.title]
        }, t), React.default.createElement(_.Icon, {
          iconStyle: {
            marginLeft: 5
          },
          name: icons.default.CHECK_DECAGRAM,
          size: 13
        })) : React.default.createElement(ReactNative.Text, {
          numberOfLines: o,
          style: [b.bold, b.title]
        }, t);
      }, r));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        var e = this.props,
          t = e.onLongPress,
          r = e.onPress,
          n = e.subtitle,
          l = e.onPressImg,
          u = e.rightIcon;
        return React.default.createElement(ReactNative.TouchableNativeFeedback, {
          onPress: r,
          onLongPress: t
        }, React.default.createElement(ReactNative.View, {
          style: [b.container]
        }, React.default.createElement(TouchableScale.default, {
          disabled: !l,
          onPress: l
        }, this.renderImg()), React.default.createElement(ReactNative.View, {
          style: b.info
        }, this.renderTitle(), n ? React.default.createElement(ReactNative.Text, {
          numberOfLines: 1,
          style: [b.subtitle]
        }, n) : null), u && React.default.createElement(_.Icon, babelHelpers.extends({
          style: {
            marginHorizontal: 10
          }
        }, u))));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
f.defaultProps = {
  numberOfLines: 1
};
var b = ReactNative.StyleSheet.create({
    container: {
      height: constants.ITEM_HEIGHT,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10
    },
    bold: {
      fontWeight: 'bold'
    },
    title: {
      fontSize: 15
    },
    subtitle: {
      fontSize: 13,
      opacity: .8
    },
    trans: {
      fontWeight: 'normal',
      fontSize: 13,
      opacity: .6
    },
    img: {
      width: 55,
      height: 55,
      borderRadius: 27.5
    },
    info: {
      paddingLeft: 10,
      flex: 1
    }
  }),
  m = f;
exports.default = m;
