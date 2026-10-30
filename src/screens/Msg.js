Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  reactNativeSpringScrollview = require("react-native-spring-scrollview"),
  components = require("../components/index"),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  services = require("../services/index"),
  utils = require("../utils/index"),
  f = function (e) {
    function t() {
      var e, r, n;
      babelHelpers.classCallCheck(this, t);
      for (var a = arguments.length, i = new Array(a), f = 0; f < a; f++) i[f] = arguments[f];
      return babelHelpers.possibleConstructorReturn(n, (r = n = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(i))), n.state = {
        data: [],
        loaded: false,
        msgModalShow: false,
        pickedItem: null
      }, n.getMsg = function () {
        var e, t;
        return regeneratorRuntime.async(function (r) {
          for (;;) switch (r.prev = r.next) {
            case 0:
              r.next = 2;
              return regeneratorRuntime.awrap(services.Netease.msg());
            case 2:
              if (e = r.sent, !(0, utils.usable)(e)) {
                r.next = 10;
                break;
              }
              if (t = e.msgs, 301 !== e.code) {
                r.next = 9;
                break;
              }
              toast(locales.default.NETEASE_NOT_LOGIN);
              n.props.navigation.navigate('NeteaseLogin');
              return r.abrupt("return");
            case 9:
              t && n.setState({
                data: t,
                loaded: true
              });
            case 10:
            case "end":
              return r.stop();
          }
        }, null, this);
      }, n.onTop = function () {
        var e, t;
        null === (e = (t = n._scrollView).scrollToBegin) || void 0 === e || e.call(t);
      }, n.formatRow = function (e) {
        var t = JSON.parse(e.lastMsg).msg;
        return {
          img: e.fromUser.avatarUrl + '?param=200y200',
          title: e.fromUser.nickname,
          subtitle: t
        };
      }, n.onUserInfo = function (e) {
        var t = e.fromUser.userId;
        'number' == typeof t && n.props.navigation.navigate('UserInfo', {
          userId: t
        });
      }, n.renderItem = function (e) {
        var t = e.item,
          r = e.index,
          a = n.formatRow(t);
        return React.default.createElement(components.ListItem, {
          key: r,
          img: a.img,
          title: a.title,
          subtitle: '' !== a.subtitle ? a.subtitle : null,
          onPress: function () {
            return n.onMsg(t);
          },
          onPressImg: function () {
            return n.onUserInfo(t);
          }
        });
      }, n.onMsg = function (e) {
        n.props.navigation.navigate('MsgHistory', {
          item: e
        });
      }, r));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        this.getMsg();
      }
    }, {
      key: "render",
      value: function () {
        var e = this,
          t = this.state.data;
        return React.default.createElement(components.PageContainer, {
          title: locales.default.INBOX,
          goBack: function () {
            return e.props.navigation.goBack();
          },
          onTop: this.onTop
        }, false === this.state.loaded ? React.default.createElement(components.Spinkit, null) : React.default.createElement(reactNativeSpringScrollview.SpringScrollView, {
          ref: function (t) {
            return e._scrollView = t;
          },
          showsVerticalScrollIndicator: false
        }, t.map(function (t, r) {
          return e.renderItem({
            item: t,
            index: r
          });
        })));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = f;
