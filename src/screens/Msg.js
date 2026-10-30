const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  reactNativeSpringScrollview = require("./../components/Scrolling.js"),
  components = require("../components/index"),
  locales = _interopRequireDefault(require("../locales/index")),
  services = require("../services/index"),
  utils = require("../utils/index"),
  f = class t extends React.PureComponent {
    constructor() {
      var e, r, n;
      for (var a = arguments.length, i = new Array(a), f = 0; f < a; f++) i[f] = arguments[f];
      return r = n = super(...i), n.state = {
        data: [],
        loaded: false,
        msgModalShow: false,
        pickedItem: null
      }, n.getMsg = async function () {
        try {
          const response = await services.Netease.msg();
          if (response?.code === 301) {
            toast(locales.default.NETEASE_NOT_LOGIN);
            n.props.navigation.navigate('NeteaseLogin');
            return;
          }
          if (response?.msgs) n.setState({
            data: response.msgs
          });
        } catch (error) {
          toast(error.message);
        } finally {
          n.setState({
            loaded: true
          });
        }
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
      }, r;
    }
    "componentDidMount"() {
      this.getMsg();
    }
    "render"() {
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
  };
exports.default = f;
