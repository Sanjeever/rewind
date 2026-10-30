Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.RELEASE_MODE = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  components = require("../components/index"),
  module811 = babelHelpers.interopRequireDefault(require("../modules/module-811")),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  constants = require("../theme/constants"),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  services = require("../services/index"),
  utils = require("../utils/index"),
  types = babelHelpers.interopRequireWildcard(require("../utils/types")),
  sharedUrls = require("../services/sharedUrls"),
  users = babelHelpers.interopRequireDefault(require("../storage/users")),
  module814 = babelHelpers.interopRequireDefault(require("../modules/module-814")),
  module815 = babelHelpers.interopRequireDefault(require("../modules/module-815")),
  module816 = babelHelpers.interopRequireDefault(require("../modules/module-816")),
  module817 = babelHelpers.interopRequireDefault(require("../modules/module-817")),
  module818 = babelHelpers.interopRequireDefault(require("../modules/module-818")),
  styles = babelHelpers.interopRequireDefault(require("./artist/styles")),
  R = {
    all: 'all',
    albums: 'albums',
    singlesAndEps: 'singlesAndEps'
  };
exports.RELEASE_MODE = R;
var x = {
    all: '\u4f5c\u54c1',
    albums: '\u4e13\u8f91',
    singlesAndEps: '\u5355\u66f2 & EPs'
  },
  k = function (e) {
    function t() {
      var e, n, a;
      babelHelpers.classCallCheck(this, t);
      for (var r = arguments.length, i = new Array(r), o = 0; o < r; o++) i[o] = arguments[o];
      return babelHelpers.possibleConstructorReturn(a, (n = a = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(i))), a._nativeOffset = {
        x: new ReactNative.Animated.Value(0),
        y: new ReactNative.Animated.Value(0)
      }, a.state = {
        artistName: '',
        artistImg: '',
        subtitle: '',
        index: 0,
        api: providers.default.netEase,
        id: null,
        hotSongs: [],
        albums: [],
        mvs: [],
        followed: null,
        releaseMode: R.all,
        albumsGroup: [],
        singlesAndEpsGroup: []
      }, a.getNeteaseArtistSongs = function (e) {
        var t, n, r, s, l, i;
        return regeneratorRuntime.async(function (o) {
          for (;;) switch (o.prev = o.next) {
            case 0:
              o.next = 2;
              return regeneratorRuntime.awrap(services.Netease.artist(e));
            case 2:
              (t = o.sent) && (n = t.hotSongs, r = t.artist, s = r.img1v1Url ? r.img1v1Url + '?param=500y500' : null, l = r.followed || false, i = (0, module817.default)(r), a.setState({
                hotSongs: n,
                followed: l,
                subtitle: i
              }), a.setImgUrl(s));
            case 4:
            case "end":
              return o.stop();
          }
        }, null, this);
      }, a.getQQmusicArtistSongs = function (e) {
        services.QQMusic.artist_song(e).then(function (e) {
          (null === e || void 0 === e ? void 0 : e.length) > 0 && a.setState({
            hotSongs: e.map(function (e) {
              return e.songInfo;
            })
          });
        }).catch(function () {
          return null;
        });
      }, a.getArtistInfo = function (e, t) {
        if (e) switch (t) {
          case providers.default.netEase:
            a.setState({
              artistName: e.name,
              id: e.id
            });
            a.getNeteaseArtistSongs(e.id);
            a.getAlbums(e.id, t);
            a.getMVs(e.id, t);
            break;
          case providers.default.qqMusic:
            var n = e.singerMID || e.mid,
              r = "http://y.gtimg.cn/music/photo_new/T001R500x500M000" + n + ".jpg",
              s = e.singerName || e.name;
            a.setState({
              artistName: s,
              id: n
            });
            a.setImgUrl(r);
            a.getQQmusicArtistSongs(n);
            a.getAlbums(n, t);
            a.getMVs(n, t);
        }
      }, a.getAlbums = function (e, t) {
        var n, r, s;
        return regeneratorRuntime.async(function (l) {
          for (;;) switch (l.prev = l.next) {
            case 0:
              l.next = 2;
              return regeneratorRuntime.awrap(module816.default.albums({
                id: e,
                api: t
              }));
            case 2:
              n = l.sent;
              r = [];
              s = [];
              t === providers.default.qqMusic ? n.forEach(function (e) {
                e.albumtype.includes('\u4e13\u8f91') ? r.push(e) : s.push(e);
              }) : n.forEach(function (e) {
                '\u4e13\u8f91' === e.type ? r.push(e) : s.push(e);
              });
              a.setState({
                albums: n,
                albumsGroup: r,
                singlesAndEpsGroup: s
              });
            case 7:
            case "end":
              return l.stop();
          }
        }, null, this);
      }, a.getMVs = function (e, t) {
        var n;
        return regeneratorRuntime.async(function (r) {
          for (;;) switch (r.prev = r.next) {
            case 0:
              r.next = 2;
              return regeneratorRuntime.awrap(module816.default.mvs({
                api: t,
                id: e
              }));
            case 2:
              n = r.sent;
              a.setState({
                mvs: n
              });
            case 4:
            case "end":
              return r.stop();
          }
        }, null, this);
      }, a.setImgUrl = function (e) {
        e && a.setState({
          artistImg: e
        });
      }, a.onLikeArtistImpl = function () {
        var e = a.state,
          t = e.api,
          n = e.followed,
          r = e.id;
        switch (t) {
          case providers.default.netEase:
            a.netEaseLikeArtist(r, !n);
            break;
          case providers.default.qqMusic:
            a.qqMusicLikeArtist(r, !n);
        }
        a.setState({
          followed: !n
        });
        toast(true == !n ? '\u5df2\u6536\u85cf\u3002' : '\u53d6\u6d88\u6536\u85cf\u3002');
      }, a.onLikeArtist = function () {
        var e = a.state,
          t = (e.api, e.followed);
        e.id;
        t ? ReactNative.Alert.alert(null, '\u53d6\u6d88\u6536\u85cf\uff1f', [{
          text: locales.default.CANCEL,
          onPress: function () {
            return null;
          },
          style: 'cancel'
        }, {
          text: locales.default.CONFIRM,
          onPress: function () {
            a.onLikeArtistImpl();
          }
        }]) : a.onLikeArtistImpl();
      }, a.qqMusicLikeArtist = function (e, t) {
        var n, a, r, s;
        return regeneratorRuntime.async(function (l) {
          for (;;) switch (l.prev = l.next) {
            case 0:
              l.next = 2;
              return regeneratorRuntime.awrap(users.default.getUserInfo());
            case 2:
              if ('object' != typeof (n = l.sent)) {
                l.next = 7;
                break;
              }
              a = n.qqMusic;
              r = a.userId;
              s = a.cookies;
              l.next = 7;
              return regeneratorRuntime.awrap(services.QQMusic.like_artist({
                mid: e,
                cookies: s,
                userId: r,
                isLike: t
              }));
            case 7:
            case "end":
              return l.stop();
          }
        }, null, this);
      }, a.netEaseLikeArtist = function (e, t) {
        var n;
        return regeneratorRuntime.async(function (a) {
          for (;;) switch (a.prev = a.next) {
            case 0:
              a.next = 2;
              return regeneratorRuntime.awrap(services.Netease.sublist_artist_add({
                id: e,
                op: true === t ? 'sub' : 'unsub'
              }));
            case 2:
              n = a.sent;
              (0, utils.usable)(n) && 200 !== n.code && toast(locales.default.ERROR);
            case 4:
            case "end":
              return a.stop();
          }
        }, null, this);
      }, a.onTop = function () {
        var e, t;
        null === (e = (t = a._list).scrollToBegin) || void 0 === e || e.call(t);
      }, a.onReleaseTab = function () {
        var e,
          t = a.state,
          n = t.index,
          r = t.releaseMode;
        1 !== n ? a.setState({
          index: 1
        }) : (r === R.albums ? e = R.singlesAndEps : r === R.singlesAndEps ? e = R.all : r === R.all && (e = R.albums), a.setState({
          releaseMode: e
        }));
      }, a.onCopy = function () {
        var e = a.state.artistName;
        ReactNative.Clipboard.setString(e);
        toast(locales.default.COPIED + " " + e);
      }, a.onWebview = function () {
        var e = a.getSharedLink();
        a.props.navigation.navigate('WebViewPage', {
          url: e
        });
      }, a.onOpenUrl = function () {
        var e = a.getSharedLink();
        ReactNative.Linking.openURL(e);
      }, a.onShare = function () {
        var e = a.getSharedLink();
        ReactNative.Share.share({
          message: e
        });
      }, a.getSharedLink = function () {
        var e = a.state,
          t = e.api,
          n = e.id;
        return sharedUrls.sharedUrls[t].artist + n;
      }, a.getAlbumData = function (e, t, n) {
        var r = a.state,
          s = r.albumsGroup,
          l = r.singlesAndEpsGroup;
        return n === R.all ? e : n === R.albums ? s : l;
      }, a.renderTabs = function () {
        var e = a.props.navigation,
          t = a.state,
          n = t.index,
          r = t.hotSongs,
          l = t.albums,
          i = t.mvs,
          o = t.api,
          u = t.releaseMode;
        switch (n) {
          case 0:
            return r.length > 0 ? React.default.createElement(module818.default, {
              hotSongs: r,
              api: o,
              navigation: e
            }) : null;
          case 1:
            return l.length > 0 ? React.default.createElement(module814.default, {
              albums: a.getAlbumData(l, o, u),
              api: o,
              navigation: e,
              releaseMode: u
            }) : null;
          case 2:
            return i.length > 0 ? React.default.createElement(module815.default, {
              api: o,
              mvs: i,
              navigation: e
            }) : null;
        }
      }, a.goBack = function () {
        a.props.navigation.goBack();
      }, n));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        var e = this.props.navigation.state.params;
        if (e) {
          var t = e.item,
            n = e.api;
          n && (this.getArtistInfo(t, n), this.setState({
            api: n,
            followed: 1 === t.is_follow
          }));
        }
      }
    }, {
      key: "render",
      value: function () {
        var e = this,
          t = this.state,
          n = t.index,
          a = t.hotSongs,
          r = t.followed,
          u = t.artistImg,
          p = t.artistName,
          b = t.subtitle,
          h = t.albums,
          v = t.mvs,
          E = t.releaseMode;
        return React.default.createElement(ReactNative.View, {
          style: styles.default.container
        }, React.default.createElement(components.Background, null), React.default.createElement(components.ParallaxScrollView, {
          onNativeContentOffsetExtract: this._nativeOffset,
          onRef: function (t) {
            return e._list = t;
          }
        }, React.default.createElement(components.ParallaxForeground, {
          img: u,
          title: p,
          alias: b,
          subtitle: [types.isArray(h) && h.length + " " + locales.default.ALBUM_COUNT, types.isArray(v) && v.length + " " + locales.default.MV_COUNT],
          animOffsetY: this._nativeOffset.y
        }), React.default.createElement(ReactNative.View, {
          style: {
            margin: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around'
          }
        }, React.default.createElement(components.TextButton, {
          text: locales.default.ARTIST_SONGS,
          style: styles.default.btnCon,
          textStyle: 0 === n && styles.default.strong,
          onPress: function () {
            return e.setState({
              index: 0
            });
          }
        }), React.default.createElement(ReactNative.View, {
          style: {
            alignItems: 'center'
          }
        }, React.default.createElement(components.TextButton, {
          text: x[E],
          style: styles.default.btnCon,
          textStyle: 1 === n && styles.default.strong,
          onPress: this.onReleaseTab
        }), React.default.createElement(ReactNative.View, {
          style: styles.default.dotContainer
        }, [R.all, R.albums, R.singlesAndEps].map(function (e, t) {
          return React.default.createElement(ReactNative.View, {
            key: t,
            style: [styles.default.dot, e !== E && {
              opacity: .4
            }]
          });
        }))), React.default.createElement(components.TextButton, {
          text: locales.default.ARTIST_MV,
          style: styles.default.btnCon,
          textStyle: 2 === n && styles.default.strong,
          onPress: function () {
            return e.setState({
              index: 2
            });
          }
        })), (null === a || void 0 === a ? void 0 : a.length) > 0 ? this.renderTabs() : React.default.createElement(components.Spinkit, {
          style: [ReactNative.StyleSheet.absoluteFill, {
            paddingTop: constants.DEVICE_WIDTH + 200
          }]
        }), React.default.createElement(components.EmptyFooter, null)), React.default.createElement(components.HeaderBar, {
          headerStyle: [styles.default.header, utils.animInterpolate.forHeader(this._nativeOffset.y)],
          title: p,
          goBack: this.goBack,
          onTop: this.onTop,
          iconColor: '#eee',
          fontColor: "#fff",
          rightIcon: function () {
            return React.default.createElement(module811.default, {
              followed: r,
              onLike: e.onLikeArtist,
              onWebview: e.onWebview,
              onCopy: e.onCopy,
              onOpenUrl: e.onOpenUrl,
              onShare: e.onShare
            });
          },
          backIcon: {
            name: icons.default.WINDOW_CLOSE
          },
          blur: true,
          bold: true
        }));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = k;
