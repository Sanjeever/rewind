Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeSpringScrollview = require("react-native-spring-scrollview"),
  components = require("../components/index"),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  services = require("../services/index"),
  events = require("../events/index"),
  utils = require("../utils/index"),
  queue = babelHelpers.interopRequireDefault(require("../events/queue")),
  styles = babelHelpers.interopRequireDefault(require("./messages/styles")),
  g = function (e) {
    function t() {
      var e, a, r;
      babelHelpers.classCallCheck(this, t);
      for (var n = arguments.length, l = new Array(n), o = 0; o < n; o++) l[o] = arguments[o];
      return babelHelpers.possibleConstructorReturn(r, (a = r = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(l))), r.state = {
        title: '\u2026\u2026',
        data: [],
        loaded: false
      }, r.getMsgUser = function (e) {
        var t, a;
        return regeneratorRuntime.async(function (n) {
          for (;;) switch (n.prev = n.next) {
            case 0:
              n.next = 2;
              return regeneratorRuntime.awrap(services.Netease.msg_history({
                userId: e
              }));
            case 2:
              t = n.sent;
              (0, utils.usable)(t) && (a = t.msgs) && r.setState({
                data: a,
                loaded: true
              });
            case 4:
            case "end":
              return n.stop();
          }
        }, null, this);
      }, r.onTop = function () {
        var e, t;
        null === (e = (t = r._scrollView).scrollToBegin) || void 0 === e || e.call(t);
      }, r.onClosed = function () {
        r.props.navigation.goBack();
      }, r.formatRow = function (e) {
        var t = JSON.parse(e.msg);
        return {
          img: e.fromUser.avatarUrl + '?param=200y200',
          title: e.fromUser.nickname,
          subtitle: t.msg,
          data: t,
          time: utils.timeFormatter.localeString(e.time)
        };
      }, r.Album = function (e) {
        r.props.navigation.navigate('AlbumPage', {
          item: e,
          api: providers.default.netEase
        });
      }, r._renderItem = function (e) {
        var t = e.item,
          a = e.index,
          n = r.formatRow(t);
        return React.default.createElement(styles.default, {
          key: a,
          user: r.state.title,
          fromUser: t.fromUser.nickname,
          img: n.img,
          msg: '' !== n.subtitle ? n.subtitle : null,
          data: n.data,
          time: n.time,
          onAlbum: function () {
            return r.Album(n.data.album);
          },
          onMV: function () {
            return r.MV(n.data.mv);
          },
          onSong: function () {
            return r.Song(n.data.song);
          }
        });
      }, r.MV = function (e) {
        var t = e.id;
        queue.default.playMV(t, providers.default.netEase);
      }, r.Song = function (e) {
        (0, events.toPlayer)({
          item: e,
          data: [e],
          index: 0,
          api: providers.default.netEase,
          type: 'insert'
        });
      }, a));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        var e = this.props.navigation.state.params;
        if (e) {
          var t = e.item;
          t && (t.fromUser && this.setState({
            title: t.fromUser.nickname
          }), this.getMsgUser(t.fromUser.userId));
        }
      }
    }, {
      key: "render",
      value: function () {
        var e = this,
          t = this.state.data;
        return React.default.createElement(components.PageContainer, {
          goBack: this.onClosed,
          title: this.state.title,
          onTop: this.onTop,
          backIcon: {
            name: icons.default.WINDOW_CLOSE
          }
        }, false === this.state.loaded ? React.default.createElement(components.Spinkit, {
          style: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
          }
        }) : null, React.default.createElement(reactNativeSpringScrollview.SpringScrollView, {
          ref: function (t) {
            return e._scrollView = t;
          },
          showsVerticalScrollIndicator: false
        }, React.default.createElement(ReactNative.View, {
          style: {
            height: 12
          }
        }), t.map(function (t, a) {
          return e._renderItem({
            item: t,
            index: a
          });
        })));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.Component);
exports.default = g;
