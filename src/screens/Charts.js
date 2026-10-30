Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  reactNativeSpringScrollview = require("react-native-spring-scrollview"),
  components = require("../components/index"),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  services = require("../services/index"),
  utils = require("../utils/index"),
  playlists = babelHelpers.interopRequireDefault(require("../storage/playlists")),
  users = babelHelpers.interopRequireDefault(require("../storage/users")),
  b = function (e) {
    function t() {
      var e, r, n;
      babelHelpers.classCallCheck(this, t);
      for (var a = arguments.length, i = new Array(a), b = 0; b < a; b++) i[b] = arguments[b];
      return babelHelpers.possibleConstructorReturn(n, (r = n = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(i))), n.state = {
        data: [],
        loading: true
      }, n.onTop = function () {
        var e, t;
        null === (e = (t = n._scrollView).scrollToBegin) || void 0 === e || e.call(t);
      }, n.getCharts = function () {
        var e, t, r, a, l;
        return regeneratorRuntime.async(function (i) {
          for (;;) switch (i.prev = i.next) {
            case 0:
              i.next = 2;
              return regeneratorRuntime.awrap(services.Netease.charts());
            case 2:
              if (e = i.sent, !(0, utils.usable)(e)) {
                i.next = 12;
                break;
              }
              i.next = 6;
              return regeneratorRuntime.awrap(users.default.getCharts());
            case 6:
              t = i.sent;
              r = e.code;
              a = e.list;
              l = a;
              (null === t || void 0 === t ? void 0 : t.length) > 0 && t.length === a.length && (l = t);
              n.setState({
                loading: false
              });
              200 === r && n.setState({
                data: l
              });
            case 12:
            case "end":
              return i.stop();
          }
        }, null, this);
      }, n._renderItem = function (e) {
        var t = e.item,
          r = e.index;
        return React.default.createElement(components.ListItem, {
          key: r,
          img: t.coverImgUrl + '?param=200y200',
          title: t.name,
          subtitle: t.trackCount + " " + locales.default.SONG_COUNT,
          onPress: function () {
            return n.Playlist(t, r);
          }
        });
      }, n.Playlist = function (e, t) {
        n.collect(t);
        n.props.navigation.navigate('Playlist', {
          playlist: e,
          api: providers.default.netEase
        });
      }, n.collect = function (e) {
        var t = n.state.data;
        playlists.default.collectCharts({
          list: t,
          index: e
        });
        n.getCharts();
      }, r));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        this.getCharts();
      }
    }, {
      key: "render",
      value: function () {
        var e = this,
          t = this.state,
          r = t.loading,
          n = t.data;
        return React.default.createElement(components.PageContainer, {
          goBack: function () {
            return e.props.navigation.goBack();
          },
          onTop: this.onTop,
          title: locales.default.CHARTS
        }, r && React.default.createElement(components.Spinkit, {
          style: {
            position: 'absolute',
            top: 100,
            bottom: 0,
            left: 0,
            right: 0
          }
        }), React.default.createElement(reactNativeSpringScrollview.SpringScrollView, {
          ref: function (t) {
            return e._scrollView = t;
          }
        }, n.map(function (t, r) {
          return e._renderItem({
            item: t,
            index: r
          });
        })));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = b;
