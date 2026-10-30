const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _defineProperty = require("@babel/runtime/helpers/defineProperty");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var i,
  React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  components = require("../components/index"),
  TabbedViewPager = _interopRequireDefault(require("../native/TabbedViewPager")),
  constants = require("../theme/constants"),
  locales = _interopRequireDefault(require("../locales/index")),
  Subscriptions = _interopRequireDefault(require("./../modules/Subscriptions.js")),
  f = [locales.default.ARTIST, locales.default.ALBUM],
  b = (i = {}, _defineProperty(i, locales.default.ARTIST, '1'), _defineProperty(i, locales.default.ALBUM, '2'), i),
  g = class t extends React.PureComponent {
    constructor() {
      var e, n, a;
      for (var r = arguments.length, i = new Array(r), o = 0; o < r; o++) i[o] = arguments[o];
      return n = a = super(...i), a.state = {
        index: 0,
        searchText: ''
      }, a.onTop = function () {
        var e, t, n, r;
        0 === a.state.index ? null === (e = (t = a.artistList).onTop) || void 0 === e || e.call(t) : null === (n = (r = a.albumList).onTop) || void 0 === n || n.call(r);
      }, a.searchSong = function (e) {
        a.setState({
          searchText: e
        });
      }, a._handleIndexChange = function (e) {
        return a.setState({
          index: e
        });
      }, a._renderScene = function (e) {
        switch (e.route.key) {
          case '1':
            return React.default.createElement(Subscriptions.default, {
              type: "artist",
              onArtist: a.onArtist,
              index: a.state.index,
              navigation: a.props.navigation,
              searchText: a.state.searchText,
              onRef: function (e) {
                return a.artistList = e;
              }
            });
          case '2':
            return React.default.createElement(Subscriptions.default, {
              type: "album",
              onAlbum: a.onAlbum,
              index: a.state.index,
              navigation: a.props.navigation,
              searchText: a.state.searchText,
              onRef: function (e) {
                return a.albumList = e;
              }
            });
          default:
            return null;
        }
      }, a._renderScenes = function (e) {
        switch (e) {
          case '1':
            return React.default.createElement(Subscriptions.default, {
              type: "artist",
              onArtist: a.onArtist,
              scrolling: a.state.scrolling,
              index: a.state.index,
              scrollEnd: function () {
                return a.setState({
                  scrolling: false
                });
              },
              navigation: a.props.navigation,
              searchText: a.state.searchText,
              ref: function (e) {
                return a.artistList = e;
              }
            });
          case '2':
            return React.default.createElement(Subscriptions.default, {
              type: "album",
              onAlbum: a.onAlbum,
              scrolling: a.state.scrolling,
              index: a.state.index,
              scrollEnd: function () {
                return a.setState({
                  scrolling: false
                });
              },
              navigation: a.props.navigation,
              searchText: a.state.searchText,
              ref: function (e) {
                return a.albumList = e;
              }
            });
          default:
            return null;
        }
      }, a.onArtist = function (e, t) {
        a.props.navigation.navigate('ArtistPage', {
          item: e,
          api: t
        });
      }, a.onAlbum = function (e, t) {
        a.props.navigation.navigate('AlbumPage', {
          item: e,
          api: t
        });
      }, n;
    }
    "render"() {
      var e = this;
      return React.default.createElement(components.PageContainer, {
        title: locales.default.FAVS,
        goBack: function () {
          return e.props.navigation.goBack();
        },
        onTop: this.onTop,
        textInput: true,
        onChangeText: function (t) {
          return e.searchSong(t);
        },
        text: this.state.searchText,
        disabledTopFadingEdge: true
      }, React.default.createElement(TabbedViewPager.default, {
        tabNames: f,
        style: [h.container, {
          padding: 5
        }],
        onPageSelected: function (t) {
          return e._handleIndexChange(t.nativeEvent.position);
        }
      }, f.map(function (t, n) {
        return React.default.createElement(ReactNative.View, {
          key: n,
          style: {
            flex: 1,
            paddingBottom: 45
          }
        }, e._renderScenes(b[t]));
      })));
    }
  },
  h = ReactNative.StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 40 + constants.STATUS_BAR_HEIGHT
    },
    tabBar: {
      marginTop: 0,
      backgroundColor: 0,
      elevation: 0
    },
    tabStyle: {
      backgroundColor: 'rgba(0,0,0,0)'
    },
    labelStyle: {
      backgroundColor: 'rgba(0,0,0,0)'
    },
    indicatorStyle: {
      backgroundColor: constants.COLORS.primary
    }
  }),
  x = g;
exports.default = x;
