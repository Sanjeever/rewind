const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _defineProperty = require("@babel/runtime/helpers/defineProperty");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var l,
  immer = require("immer"),
  React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeSpringScrollview = require("./../components/Scrolling.js"),
  components = require("../components/index"),
  TabbedViewPager = _interopRequireDefault(require("../native/TabbedViewPager")),
  providers = _interopRequireDefault(require("../services/providers")),
  icons = _interopRequireDefault(require("../theme/icons")),
  locales = _interopRequireDefault(require("../locales/index")),
  services = require("../services/index"),
  events = require("../events/index"),
  utils = require("../utils/index"),
  trackInfo = require("../services/trackInfo"),
  S = [locales.default.ARTIST_SONGS, locales.default.MIX],
  k = (l = {}, _defineProperty(l, locales.default.ARTIST_SONGS, '1'), _defineProperty(l, locales.default.MIX, '2'), l),
  E = class t extends React.Component {
    constructor() {
      var e, n, a;
      for (var r = arguments.length, l = new Array(r), s = 0; s < r; s++) l[s] = arguments[s];
      return n = a = super(...l), a.state = {
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
      }, a.getRe = async function () {
        try {
          const response = await services.Netease.recommend_songs();
          if (response?.code === 301) {
            toast(locales.default.NETEASE_NOT_LOGIN);
            a.props.navigation.navigate('NeteaseLogin');
            return;
          }
          if (response?.recommend) {
            a.setState({
              data: response.recommend
            });
            await a.getRePlaylist();
          }
        } catch (error) {
          toast(error.message);
        } finally {
          a.setState({
            loaded: true
          });
        }
      }, a.getRePlaylist = async function () {
        const response = await services.Netease.recommend_playlists();
        if (response?.code === 200) a.setState({
          playlistData: response.recommend
        });
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
      }, a.onDisklikeSong = async function (song, index) {
        const response = await services.Netease.recommend_dislike({
          id: song.id
        });
        const data = immer.produce(a.state.data, draft => {
          if (response.code === 200) draft[index] = response.data;else {
            toast(response.message);
            draft.splice(index, 1);
          }
        });
        a.setState({
          data
        });
      }, n;
    }
    "componentDidMount"() {
      this.backSubscription = ReactNative.BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
      this.getRe();
    }
    "componentWillUnmount"() {
      this.backSubscription?.remove();
    }
    "render"() {
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
  };
exports.default = E;
