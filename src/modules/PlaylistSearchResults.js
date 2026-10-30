const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _toConsumableArray = require("@babel/runtime/helpers/toConsumableArray");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeLargelist = require("./../components/Scrolling.js"),
  components = require("../components/index"),
  ParallaxList = _interopRequireDefault(require("../components/ParallaxList")),
  providers = _interopRequireDefault(require("../services/providers")),
  constants = require("../theme/constants"),
  services = require("../services/index"),
  trackDescription = _interopRequireDefault(require("../services/trackDescription")),
  searchTypes = _interopRequireDefault(require("../services/searchTypes")),
  b = class t extends React.PureComponent {
    constructor() {
      var e, a, r;
      for (var n = arguments.length, s = new Array(n), u = 0; u < n; u++) s[u] = arguments[u];
      return a = r = super(...s), r.state = {
        data: [],
        preSearch: ''
      }, r.fetchData = function (e) {
        var t = r.props.api;
        e && r.setState({
          data: [],
          preSearch: e
        }, function () {
          r.fetchAPI(t, e);
        });
      }, r.fetchAPI = function (e, t) {
        var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
        switch (e) {
          case providers.default.netEase:
            services.Netease.search({
              keywords: t,
              type: 1e3,
              offset: a
            }).then(function (e) {
              var t = e.result.playlists;
              if ((null === t || void 0 === t ? void 0 : t.length) > 0) {
                var a = r.formatAllData(t);
                r.setState({
                  data: _toConsumableArray(r.state.data).concat(_toConsumableArray(a))
                });
              }
              r.endLoading();
            });
            break;
          case providers.default.qqMusic:
            services.QQMusic.search_playlist({
              keywords: t,
              page: a / 30
            }).then(function (e) {
              var t = e.list;
              if ((null === t || void 0 === t ? void 0 : t.length) > 0) {
                var a = r.formatAllData(t);
                r.setState({
                  data: _toConsumableArray(r.state.data).concat(_toConsumableArray(a))
                });
              }
              r.endLoading();
            });
        }
      }, r.getMore = function () {
        var e = r.props,
          t = e.api,
          a = e.search,
          n = r.state.data.length;
        r.fetchAPI(t, a, n);
      }, r.endLoading = function () {
        var e, t;
        null === (e = (t = r._list).endLoading) || void 0 === e || e.call(t);
      }, r.header = function () {
        return React.default.createElement(ReactNative.View, {
          style: v.header
        });
      }, r.albumPage = function (e, t) {
        r.props.navigation.navigate('AlbumPage', {
          item: e,
          api: t
        });
      }, r.formatAllData = function (e) {
        for (var t = r.props.api, a = [], n = 0; n < e.length; n++) {
          var l = e[n],
            i = (0, trackDescription.default)({
              item: l,
              api: t,
              page: searchTypes.default.playlists
            });
          i.initItem = l;
          a.push(i);
        }
        return a;
      }, r._renderIndexPath = function (e) {
        var t = e.row,
          a = r.state.data[t];
        return React.default.createElement(components.ListItem, {
          title: a.title,
          subtitle: a.subtitle,
          img: a.img,
          onPress: function () {
            return r.Playlist(a.initItem);
          }
        });
      }, r.Playlist = function (e) {
        switch (r.props.api) {
          case providers.default.netEase:
            r.props.navigation.navigate('Playlist', {
              playlist: e,
              api: providers.default.netEase
            });
            break;
          case providers.default.qqMusic:
            r.props.navigation.navigate('Playlist', {
              playlist: e,
              api: providers.default.qqMusic
            });
        }
      }, a;
    }
    "componentDidMount"() {
      var e = this.props.onRef;
      e && e(this);
    }
    "UNSAFE_componentWillReceiveProps"(e) {
      var t = e.index,
        a = e.search;
      t === searchTypes.default.playlists && this.state.preSearch !== a && this.fetchData(a);
    }
    "render"() {
      var e = this,
        t = this.state.data;
      return t.length < 1 ? React.default.createElement(components.Spinkit, null) : React.default.createElement(ReactNative.View, {
        style: v.container
      }, React.default.createElement(reactNativeLargelist.LargeList, {
        ref: function (t) {
          return e._list = t;
        },
        data: [{
          items: t
        }],
        heightForIndexPath: function () {
          return constants.ITEM_HEIGHT;
        },
        renderIndexPath: this._renderIndexPath,
        onLoading: this.getMore,
        loadingFooter: ParallaxList.default
      }));
    }
  },
  v = ReactNative.StyleSheet.create({
    container: {
      flex: 1
    },
    header: {
      height: 10,
      width: '100%'
    }
  }),
  g = b;
exports.default = g;
