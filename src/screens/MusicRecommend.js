Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var l,
  immer = require("immer"),
  React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeSpringScrollview = require("react-native-spring-scrollview"),
  components = require("../components/index"),
  TabbedViewPager = babelHelpers.interopRequireDefault(require("../native/TabbedViewPager")),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  services = require("../services/index"),
  events = require("../events/index"),
  utils = require("../utils/index"),
  trackInfo = require("../services/trackInfo"),
  S = [locales.default.ARTIST_SONGS, locales.default.MIX],
  k = (l = {}, babelHelpers.defineProperty(l, locales.default.ARTIST_SONGS, '1'), babelHelpers.defineProperty(l, locales.default.MIX, '2'), l),
  E = function (e) {
    function t() {
      var e, n, a;
      babelHelpers.classCallCheck(this, t);
      for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
      return babelHelpers.possibleConstructorReturn(a, (n = a = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(l))), a.state = {
        api: providers.default.netEase,
        data: [],
        loaded: false,
        playlistData: [],
        tabIndex: 0,
        dislikeMode: false
      }, a.onBackPress = function () {
        var e = a.state.dislikeMode;
        return !!e && (a.setState({
          dislikeMode: !e
        }), true);
      }, a.getRe = function () {
        var e, t;
        return regeneratorRuntime.async(function (n) {
          for (;;) switch (n.prev = n.next) {
            case 0:
              n.next = 2;
              return regeneratorRuntime.awrap(services.Netease.recommend_songs());
            case 2:
              if (e = n.sent, !(0, utils.usable)(e)) {
                n.next = 10;
                break;
              }
              if (t = e.recommend, 301 !== e.code) {
                n.next = 9;
                break;
              }
              toast(locales.default.NETEASE_NOT_LOGIN);
              a.props.navigation.navigate('NeteaseLogin');
              return n.abrupt("return");
            case 9:
              t && (a.getRePlaylist(), a.setState({
                loaded: true,
                data: t
              }));
            case 10:
            case "end":
              return n.stop();
          }
        }, null, this);
      }, a.getRePlaylist = function () {
        var e, t;
        return regeneratorRuntime.async(function (n) {
          for (;;) switch (n.prev = n.next) {
            case 0:
              n.next = 2;
              return regeneratorRuntime.awrap(services.Netease.recommend_playlists());
            case 2:
              e = n.sent;
              (0, utils.usable)(e) && (t = e.recommend, 200 === e.code && a.setState({
                playlistData: t
              }));
            case 4:
            case "end":
              return n.stop();
          }
        }, null, this);
      }, a.onTop = function () {
        var e, t, n, r;
        0 === a.state.tabIndex ? null === (e = (t = a._songScrollView).scrollToBegin) || void 0 === e || e.call(t) : null === (n = (r = a._playlistScrollView).scrollToBegin) || void 0 === n || n.call(r);
      }, a.handlePageSelected = function (e) {
        var t = e.nativeEvent.position;
        a.setState({
          tabIndex: t
        });
      }, a._renderScenes = function (e) {
        var t = a.state,
          n = t.data,
          r = t.playlistData;
        switch (e) {
          case '1':
            return (null === n || void 0 === n ? void 0 : n.length) > 0 ? React.default.createElement(reactNativeSpringScrollview.SpringScrollView, {
              ref: function (e) {
                return a._songScrollView = e;
              }
            }, n.map(function (e, t) {
              return a._renderItem({
                item: e,
                index: t
              });
            }), React.default.createElement(components.EmptyFooter, null)) : React.default.createElement(components.Spinkit, null);
          case '2':
            return (null === r || void 0 === r ? void 0 : r.length) > 0 ? React.default.createElement(reactNativeSpringScrollview.SpringScrollView, {
              ref: function (e) {
                return a._playlistScrollView = e;
              }
            }, r.map(function (e, t) {
              return a._renderPlaylist({
                item: e,
                index: t
              });
            }), React.default.createElement(components.EmptyFooter, null)) : React.default.createElement(components.Spinkit, null);
          default:
            return null;
        }
      }, a._renderItem = function (e) {
        var t = e.item,
          n = e.index,
          r = a.state,
          l = r.api,
          i = r.data,
          s = r.dislikeMode,
          u = (0, trackInfo.extractFullInfo)(t),
          d = s ? function () {
            return a.onDisklikeSong(t, n);
          } : function () {
            return (0, events.toPlayer)({
              item: t,
              data: i,
              index: n,
              api: l
            });
          };
        return React.default.createElement(components.SongRow, {
          img: u.img + '?param=200y200',
          song: u.song,
          album: u.album,
          singer: u.singer,
          onPress: d,
          detail: function () {
            return (0, events.toDetailModal)({
              item: t,
              index: n,
              api: l
            });
          },
          addToQueue: function () {
            return (0, events.toInsertToList)({
              data: t,
              api: l
            });
          },
          songItem: t
        });
      }, a._renderPlaylist = function (e) {
        var t = e.item;
        return React.default.createElement(components.SongRow, {
          img: t.picUrl + '?param=200y200',
          song: t.name,
          singer: t.copywriter,
          onPress: function () {
            return a.onPlaylist(t);
          }
        });
      }, a.onPlaylist = function (e) {
        a.props.navigation.navigate('Playlist', {
          playlist: e,
          api: providers.default.netEase
        });
      }, a.onDisklikeSong = function (e, t) {
        var n, r, l, o, s;
        return regeneratorRuntime.async(function (u) {
          for (;;) switch (u.prev = u.next) {
            case 0:
              u.next = 2;
              return regeneratorRuntime.awrap(services.Netease.recommend_dislike({
                id: e.id
              }));
            case 2:
              n = u.sent;
              r = n.code;
              l = n.data;
              o = n.message;
              s = (0, immer.produce)(a.state.data, function (e) {
                200 === r ? e[t] = l : (toast(o), e.splice(t, 1));
              });
              a.setState({
                data: s
              });
            case 6:
            case "end":
              return u.stop();
          }
        }, null, this);
      }, n));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        ReactNative.BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
        this.getRe();
      }
    }, {
      key: "componentWillUnmount",
      value: function () {
        ReactNative.BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
      }
    }, {
      key: "render",
      value: function () {
        var e = this,
          t = this.state.dislikeMode;
        return React.default.createElement(components.PageContainer, {
          title: utils.timeFormatter.localeString(),
          goBack: function () {
            return e.props.navigation.goBack();
          },
          onTop: this.onTop,
          rightIcon: {
            name: t ? icons.default.DELETE_OUTLINE : icons.default.DELETE,
            onPress: function () {
              return e.setState({
                dislikeMode: !t
              });
            }
          },
          disabledTopFadingEdge: true
        }, React.default.createElement(TabbedViewPager.default, {
          tabNames: S,
          onPageSelected: this.handlePageSelected
        }, S.map(function (t, n) {
          return React.default.createElement(ReactNative.View, {
            key: n,
            style: {
              flex: 1,
              paddingBottom: 50
            }
          }, e._renderScenes(k[t]));
        })));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.Component);
exports.default = E;
