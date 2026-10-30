Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  components = require("../components/index"),
  s = function (e) {
    function t() {
      babelHelpers.classCallCheck(this, t);
      return babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(t).apply(this, arguments));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        var e = this,
          t = this.props,
          r = t.content,
          l = t.time,
          a = t.userName,
          s = t.userAvatar,
          u = t.beReplieds,
          d = t.onUserInfo,
          m = t.item;
        return React.default.createElement(ReactNative.View, {
          style: c.comment
        }, React.default.createElement(ReactNative.View, {
          style: {
            flexDirection: 'row',
            alignItems: 'center'
          }
        }, React.default.createElement(ReactNative.TouchableOpacity, {
          onPress: function () {
            return d(m);
          }
        }, React.default.createElement(ReactNative.View, {
          style: {
            alignItems: 'center',
            justifyContent: 'center'
          }
        }, React.default.createElement(ReactNative.Image, {
          source: {
            uri: s
          },
          style: c.userAvatar
        }))), React.default.createElement(ReactNative.View, {
          style: c.nickItem
        }, React.default.createElement(components.Selectable, {
          onCopy: function () {
            return e.copy(a);
          },
          style: c.nickname
        }, a), React.default.createElement(ReactNative.Text, {
          style: c.timestamp
        }, l))), React.default.createElement(ReactNative.View, {
          style: c.content
        }, React.default.createElement(components.Selectable, {
          style: c.subtitle
        }, r), u ? u.map(function (e, t) {
          return React.default.createElement(ReactNative.View, {
            style: c.replied,
            key: t
          }, React.default.createElement(ReactNative.View, {
            style: c.repliedUser
          }, React.default.createElement(ReactNative.TouchableOpacity, {
            onPress: function () {
              return d(e);
            }
          }, React.default.createElement(ReactNative.Image, {
            source: {
              uri: e.user.avatarUrl + '?param=100y100'
            },
            style: c.repliedAvatar
          })), React.default.createElement(components.Selectable, null, e.user.nickname)), React.default.createElement(components.Selectable, {
            style: c.subtitle
          }, e.content));
        }) : null));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = s;
var c = ReactNative.StyleSheet.create({
  comment: {
    paddingHorizontal: 20,
    marginTop: 15
  },
  content: {
    flex: 1,
    paddingLeft: 45
  },
  nickItem: {
    marginLeft: 10
  },
  replied: {
    borderColor: '#eee',
    borderWidth: ReactNative.StyleSheet.hairlineWidth,
    borderRadius: 5,
    padding: 10,
    marginTop: 10
  },
  subtitle: {
    opacity: .9,
    fontSize: 14,
    lineHeight: 20
  },
  userAvatar: {
    height: 35,
    width: 35,
    borderRadius: 17.5
  },
  repliedUser: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  repliedAvatar: {
    height: 30,
    width: 30,
    borderRadius: 15,
    marginRight: 10
  },
  timestamp: {
    marginBottom: 5,
    fontSize: 12,
    opacity: .8
  },
  nickname: {
    fontWeight: 'bold',
    fontSize: 15
  }
});
