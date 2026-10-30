Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  utils = require("../utils/index"),
  s = function (e) {
    function t() {
      var e, a, n;
      babelHelpers.classCallCheck(this, t);
      for (var r = arguments.length, l = new Array(r), i = 0; i < r; i++) l[i] = arguments[i];
      return babelHelpers.possibleConstructorReturn(n, (a = n = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(l))), n.state = {
        avatarUrl: null,
        nickname: null,
        living: null
      }, n.onCake = function () {
        n.props.navigation.navigate('SearchPage', {
          text: '\u751f\u65e5\u5feb\u4e50'
        });
      }, a));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        var e = this.props.navigation.state.params;
        if (e) {
          var t = e.profile,
            a = t.birthday,
            n = t.avatarUrl,
            r = t.nickname;
          this.setState({
            avatarUrl: n,
            nickname: r,
            living: utils.timeFormatter.diffInDays(new Date(a), new Date())
          });
        }
      }
    }, {
      key: "render",
      value: function () {
        var e = this.state,
          t = e.avatarUrl,
          a = e.nickname,
          n = e.living;
        return React.default.createElement(ReactNative.View, {
          style: c.container
        }, React.default.createElement(ReactNative.StatusBar, {
          hidden: true
        }), t && React.default.createElement(ReactNative.Image, {
          source: {
            uri: t
          },
          style: c.avatar
        }), a && React.default.createElement(ReactNative.Text, {
          style: c.normal
        }, a), React.default.createElement(ReactNative.TouchableOpacity, {
          onPress: this.onCake
        }, React.default.createElement(ReactNative.Text, {
          style: [c.text, {
            marginVertical: 32
          }]
        }, "\u751f\u65e5\u5feb\u4e50", '\n', "\ud83c\udf82")), n && React.default.createElement(ReactNative.Text, {
          style: [c.normal, {
            opacity: .5
          }]
        }, "\u4f60\u5df2\u5b58\u5728 ", n, " \u5929"));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent),
  c = ReactNative.StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      alignItems: 'center',
      justifyContent: 'center'
    },
    text: {
      fontSize: 32,
      textAlign: 'center',
      fontWeight: 'bold'
    },
    normal: {
      fontSize: 20
    },
    avatar: {
      height: 88,
      width: 88,
      borderRadius: 44
    }
  }),
  u = s;
exports.default = u;
