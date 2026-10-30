Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  reactNativeSpringScrollview = require("react-native-spring-scrollview"),
  components = require("../components/index"),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  names = babelHelpers.interopRequireDefault(require("../events/names")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  services = require("../services/index"),
  events = require("../events/index"),
  types = babelHelpers.interopRequireWildcard(require("../utils/types")),
  trackInfo = require("../services/trackInfo"),
  g = function (e) {
    function t() {
      var e, n, r;
      babelHelpers.classCallCheck(this, t);
      for (var a = arguments.length, o = new Array(a), g = 0; g < a; g++) o[g] = arguments[g];
      return babelHelpers.possibleConstructorReturn(r, (n = r = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(o))), r.state = {
        data: []
      }, r.getList = function () {
        var e, t, n, a;
        return regeneratorRuntime.async(function (i) {
          for (;;) switch (i.prev = i.next) {
            case 0:
              i.next = 2;
              return regeneratorRuntime.awrap(services.Netease.cloud());
            case 2:
              if (!(e = i.sent)) {
                i.next = 13;
                break;
              }
              if (t = e.code, n = e.data, 301 !== t) {
                i.next = 9;
                break;
              }
              toast(locales.default.NETEASE_NOT_LOGIN);
              r.props.navigation.navigate('NeteaseLogin');
              return i.abrupt("return");
            case 9:
              if (types.isArray(n) && !(n.length < 1)) {
                i.next = 11;
                break;
              }
              return i.abrupt("return");
            case 11:
              a = n.map(function (e) {
                return {
                  name: e.songName,
                  id: e.songId,
                  title: e.songName,
                  singer: e.artist,
                  duration: e.simpleSong.dt,
                  ar: [{
                    id: -1,
                    name: e.artist
                  }],
                  al: [{
                    id: -1,
                    name: e.album
                  }]
                };
              });
              r.setState({
                data: a
              });
            case 13:
            case "end":
              return i.stop();
          }
        }, null, this);
      }, r.onTop = function () {
        var e, t;
        null === (e = (t = r._scrollView).scrollToBegin) || void 0 === e || e.call(t);
      }, r._renderItem = function (e) {
        var t = e.item,
          n = e.index,
          a = (0, trackInfo.extractFullInfo)(t);
        return React.default.createElement(components.SongRow, {
          key: n,
          index: n,
          song: a.song,
          album: a.album,
          singer: a.singer,
          onPress: function () {
            return r.playMusic(t, n);
          },
          addToQueue: function () {
            return r.addToQueue(t);
          }
        });
      }, r.addToQueue = function (e) {
        var t = r.state.api;
        events.emitter.emit(names.default.InsertToList, {
          data: e,
          type: 'item',
          api: t
        });
      }, r.playMusic = function (e, t) {
        var n = r.state.data;
        (0, events.toPlayer)({
          item: e,
          data: n,
          index: t,
          api: providers.default.netEase
        });
      }, n));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        this.getList();
      }
    }, {
      key: "render",
      value: function () {
        var e = this,
          t = this.state.data;
        return React.default.createElement(components.PageContainer, {
          goBack: function () {
            return e.props.navigation.goBack();
          },
          onTop: this.onTop,
          title: locales.default.CLOUD_DRIVE
        }, React.default.createElement(reactNativeSpringScrollview.SpringScrollView, {
          ref: function (t) {
            return e._scrollView = t;
          }
        }, t.map(function (t, n) {
          return e._renderItem({
            item: t,
            index: n
          });
        })));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.Component);
exports.default = g;
