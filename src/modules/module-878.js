Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeLargelist = require("react-native-largelist"),
  components = require("../components/index"),
  module821 = babelHelpers.interopRequireDefault(require("./module-821")),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  constants = require("../theme/constants"),
  names = babelHelpers.interopRequireDefault(require("../events/names")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  services = require("../services/index"),
  utils = require("../utils/index"),
  h = function (e) {
    function t() {
      var e, a, n;
      babelHelpers.classCallCheck(this, t);
      for (var r = arguments.length, o = new Array(r), u = 0; u < r; u++) o[u] = arguments[u];
      return babelHelpers.possibleConstructorReturn(n, (a = n = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(o))), n.state = {
        data: [],
        offset: 0
      }, n.onTop = function () {
        var e, t;
        0 === n.props.index ? null === (e = n._artistList) || void 0 === e || e.scrollTo({
          x: 0,
          y: 0
        }) : null === (t = n._albumList) || void 0 === t || t.scrollTo({
          x: 0,
          y: 0
        });
      }, n.loadData = function () {
        switch (n.props.type) {
          case 'artist':
            n.loadArtist();
            break;
          case 'album':
            n.loadAlbum();
        }
      }, n.renderSectionHeader = function (e) {
        var t,
          a = e.section;
        if ((null === (t = a.data) || void 0 === t ? void 0 : t.length) > 0) return React.default.createElement(ReactNative.View, {
          style: {
            padding: 10
          }
        }, React.default.createElement(ReactNative.Text, {
          style: [v.text, v.sectionHeader]
        }, a.key));
      }, n.unLogined = function () {
        toast(locales.default.NETEASE_NOT_LOGIN);
        n.props.navigation.navigate('NeteaseLogin');
      }, n._renderIndexPath = function (e) {
        var t = e.row;
        return n._renderItem({
          item: n.state.data[t],
          index: t
        });
      }, n.searchSong = function (e) {
        var t,
          a = n.state.data;
        t = e ? n.filterList(e, a) : n.state.initData;
        n.setState({
          data: t
        });
      }, n.filterList = function (e, t) {
        var a = e.replace(/\?/gi, '\\?').replace(/\s/, ''),
          n = new RegExp(a, 'gi');
        return t.filter(function (e) {
          return e.name.match(n);
        }) || t;
      }, n.loadArtist = function () {
        var e, t, a;
        return regeneratorRuntime.async(function (r) {
          for (;;) switch (r.prev = r.next) {
            case 0:
              r.next = 2;
              return regeneratorRuntime.awrap(services.Netease.sublist_artist({
                offset: 0
              }));
            case 2:
              e = r.sent;
              t = false;
              200 === (null === e || void 0 === e ? void 0 : e.code) && (a = e.data, t = true, a.length > 0 && n.setState({
                data: a,
                initData: a
              }));
              false === t && n.unLogined();
            case 6:
            case "end":
              return r.stop();
          }
        }, null, this);
      }, n.loadAlbum = function () {
        var e, t;
        return regeneratorRuntime.async(function (a) {
          for (;;) switch (a.prev = a.next) {
            case 0:
              a.next = 2;
              return regeneratorRuntime.awrap(services.Netease.sublist_album({
                offset: 0
              }));
            case 2:
              200 === (null === (e = a.sent) || void 0 === e ? void 0 : e.code) && (t = e.data).length > 0 && n.setState({
                data: t,
                initData: t
              });
            case 4:
            case "end":
              return a.stop();
          }
        }, null, this);
      }, n.getMore = function () {
        n.setState({
          offset: n.state.offset + 1
        }, function () {
          var e = n.state.offset;
          switch (n.props.type) {
            case 'artist':
              n.loadArtistMore(1e3 * e);
              break;
            case 'album':
              n.loadAlbumMore(30 * e);
          }
        });
      }, n.loadArtistMore = function (e) {
        var t, a, r, s, i;
        return regeneratorRuntime.async(function (o) {
          for (;;) switch (o.prev = o.next) {
            case 0:
              o.next = 2;
              return regeneratorRuntime.awrap(services.Netease.sublist_artist({
                offset: e
              }));
            case 2:
              t = o.sent;
              (0, utils.usable)(t) && (s = t.code, i = t.data, 200 === s && i.length > 0 && n.setState({
                data: babelHelpers.toConsumableArray(n.state.data).concat(babelHelpers.toConsumableArray(i))
              }), null === (a = (r = n._artistList).endLoading) || void 0 === a || a.call(r));
            case 4:
            case "end":
              return o.stop();
          }
        }, null, this);
      }, n.loadAlbumMore = function (e) {
        var t, a, r, s, i;
        return regeneratorRuntime.async(function (o) {
          for (;;) switch (o.prev = o.next) {
            case 0:
              o.next = 2;
              return regeneratorRuntime.awrap(services.Netease.sublist_album({
                offset: e
              }));
            case 2:
              t = o.sent;
              (0, utils.usable)(t) && (s = t.code, i = t.data, 200 === s && i.length > 0 && n.setState({
                data: babelHelpers.toConsumableArray(n.state.data).concat(babelHelpers.toConsumableArray(i))
              }), null === (a = (r = n._albumList).endLoading) || void 0 === a || a.call(r));
            case 4:
            case "end":
              return o.stop();
          }
        }, null, this);
      }, n.formatData = function (e) {
        var t = n.props.type,
          a = {},
          r = null === e || void 0 === e ? void 0 : e.artists;
        switch (t) {
          case 'artist':
            a.title = e.name;
            a.subtitle = e.albumSize ? e.albumSize + " " + locales.default.ALBUM_COUNT : null;
            a.img = e.img1v1Url ? e.img1v1Url + '?param=200y200' : 'http://y.gtimg.cn/music/photo_new/T001R150x150M000' + e.mid + '.jpg';
            break;
          case 'album':
            a.title = e.name || e.albumname;
            a.subtitle = r ? e.artists[0].name + "  |  " + e.size + " " + locales.default.SONG_COUNT : e.singername + "  |  " + e.songnum;
            a.img = e.picUrl ? e.picUrl + '?param=200y200' : e.pic;
        }
        return a;
      }, n._renderItem = function (e) {
        var t = e.item,
          a = n.formatData(t);
        return React.default.createElement(components.ListItem, {
          title: a.title,
          subtitle: a.subtitle,
          img: a.img,
          onPress: function () {
            return n.onPress(t);
          }
        });
      }, n.onPress = function (e) {
        var t = n.props.type,
          a = providers.default.netEase;
        switch (t) {
          case 'artist':
            n.props.onArtist(e, a);
            break;
          case 'album':
            n.props.onAlbum(e, a);
        }
      }, a));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidUpdate",
      value: function (e) {
        this.props.searchText !== e.searchText && this.searchSong(this.props.searchText);
      }
    }, {
      key: "componentDidMount",
      value: function () {
        var e = this;
        this.sub = ReactNative.DeviceEventEmitter.addListener(names.default.UserLogined, function () {
          e.loadData();
        });
        this.loadData();
      }
    }, {
      key: "componentWillUnmount",
      value: function () {
        var e, t;
        null === (e = (t = this.sub).remove) || void 0 === e || e.call(t);
      }
    }, {
      key: "render",
      value: function () {
        var e = this,
          t = this.state.data;
        return !t || t.length < 1 ? React.default.createElement(components.Spinkit, null) : t ? React.default.createElement(reactNativeLargelist.LargeList, {
          ref: function (t) {
            return e["_" + e.props.type + "List"] = t;
          },
          data: [{
            items: t
          }],
          heightForIndexPath: function () {
            return constants.ITEM_HEIGHT;
          },
          renderIndexPath: this._renderIndexPath,
          onLoading: this.getMore,
          loadingFooter: module821.default
        }) : null;
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = h;
var v = ReactNative.StyleSheet.create({
  sectionHeader: {
    borderRadius: 5,
    fontSize: 14,
    fontWeight: 'bold'
  },
  text: {
    fontSize: 14,
    padding: 5
  }
});
