Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  FadingEdge = babelHelpers.interopRequireDefault(require("../components/FadingEdge")),
  reactNativeSpringScrollview = require("react-native-spring-scrollview"),
  components = require("../components/index"),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  names = babelHelpers.interopRequireDefault(require("../events/names")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  playlistFiles = babelHelpers.interopRequireDefault(require("../storage/playlistFiles")),
  services = require("../services/index"),
  events = require("../events/index"),
  utils = require("../utils/index"),
  types = babelHelpers.interopRequireWildcard(require("../utils/types")),
  users = babelHelpers.interopRequireDefault(require("../storage/users")),
  module714 = babelHelpers.interopRequireDefault(require("../modules/module-714")),
  module715 = babelHelpers.interopRequireDefault(require("../modules/module-715")),
  E = function (e) {
    function t() {
      var e, a, l;
      babelHelpers.classCallCheck(this, t);
      for (var r = arguments.length, i = new Array(r), s = 0; s < r; s++) i[s] = arguments[s];
      return babelHelpers.possibleConstructorReturn(l, (a = l = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(i))), l.state = {
        api: '',
        data: [],
        playlist: [],
        locals: [],
        mainModalShow: false
      }, l.getLocalPlaylist = function () {
        playlistFiles.default.getPlaylist().then(function (e) {
          e.playlists.length > 0 && l.setState({
            locals: e.playlists
          });
        });
      }, l.playlist = function (e) {
        var t;
        return regeneratorRuntime.async(function (a) {
          for (;;) switch (a.prev = a.next) {
            case 0:
              a.next = 2;
              return regeneratorRuntime.awrap(users.default.getUserPlayList());
            case 2:
              if ((t = a.sent) || 0 !== Object.keys(t).length) {
                a.next = 5;
                break;
              }
              return a.abrupt("return");
            case 5:
              a.t0 = e;
              a.next = a.t0 === providers.default.netEase ? 8 : a.t0 === providers.default.qqMusic ? 10 : 12;
              break;
            case 8:
              t.netEase && l.setState({
                playlist: t.netEase
              });
              return a.abrupt("break", 14);
            case 10:
              t.qqMusic && l.setState({
                playlist: t.qqMusic
              });
              return a.abrupt("break", 14);
            case 12:
              l.setState({
                playlist: []
              });
              return a.abrupt("break", 14);
            case 14:
            case "end":
              return a.stop();
          }
        }, null, this);
      }, l.onClosed = function () {
        l.setState({
          api: '',
          mainModalShow: false,
          playlist: [],
          locals: []
        });
      }, l.onTop = function () {
        var e, t;
        null === (e = (t = l._scrollView).scrollToBegin) || void 0 === e || e.call(t);
      }, l._renderItem = function (e) {
        var t = e.item,
          a = l.formatItem(t);
        return React.default.createElement(module714.default, {
          title: a.title,
          img: a.img,
          onPress: function () {
            return l.onCollect(t);
          },
          trackCount: a.trackCount
        });
      }, l.formatItem = function (e) {
        var t = l.state.api,
          a = {};
        if (t === providers.default.netEase) {
          a.title = e.name;
          a.img = e.coverImgUrl + '?param=200y200';
          a.trackCount = e.trackCount;
        } else if (t === providers.default.qqMusic) {
          var r = l.qqMusicItem(e);
          a.title = r.title;
          a.img = r.picurl;
          a.trackCount = r.num;
        }
        return a;
      }, l.qqMusicItem = function (e) {
        var t = {};
        e.title ? (t.title = e.title, t.picurl = '' !== e.picurl ? e.picurl : 'http://s4.music.126.net/style/web2/img/default/default_album.jpg', t.num = '' !== e.subtitle ? e.subtitle.replace(/\u9996.+/, '') : null, t.id = e.id || e.dissid, t.dirid = e.dirid) : (t.title = e.dissname, t.num = e.songnum, t.picurl = e.logo, t.id = e.dissid, t.dirid = e.dirid);
        return t;
      }, l.onLocalCollect = function (e) {
        var t = l.state,
          a = t.api,
          r = t.data,
          n = t.songItem,
          i = babelHelpers.toConsumableArray(l.state.locals),
          s = null;
        if (n) {
          var u = l.state.songItem;
          u.api = a;
          s = [u];
          'local' === a && (s.img = null);
          i[e].tracks = i[e].tracks.filter(function (e) {
            return JSON.stringify(s) !== JSON.stringify(e);
          });
        } else r && (s = r.map(function (e) {
          return babelHelpers.objectSpread({}, e, {
            api: a
          });
        }));
        s && (i[e].tracks = babelHelpers.toConsumableArray(s).concat(babelHelpers.toConsumableArray(i[e].tracks)), playlistFiles.default.toPlaylist({
          playlists: i
        }), toast(locales.default.COLLECT_SUCCESS));
        l.onClosed();
      }, l.onCollect = function (e) {
        var t, a, r, n, i, s, u, o, d, p, m, g, h;
        return regeneratorRuntime.async(function (k) {
          for (;;) switch (k.prev = k.next) {
            case 0:
              if (t = l.state, a = t.songItem, r = t.api, n = t.data, r !== providers.default.netEase) {
                k.next = 12;
                break;
              }
              if (i = e.id, !(types.isArray(n) && n.length > 0)) {
                k.next = 8;
                break;
              }
              s = n.map(function (e) {
                return e.id;
              });
              toast(s.length);
              l.collectToNetease(i, s);
              return k.abrupt("return");
            case 8:
              u = a.id;
              l.collectToNetease(i, u);
              k.next = 22;
              break;
            case 12:
              if (r !== providers.default.qqMusic) {
                k.next = 22;
                break;
              }
              o = a.songmid || a.mid;
              d = e.title;
              k.next = 17;
              return regeneratorRuntime.awrap(users.default.getUserInfo());
            case 17:
              if ('object' == typeof (p = k.sent) || 0 !== Object.keys(p).length) {
                k.next = 20;
                break;
              }
              return k.abrupt("return");
            case 20:
              m = p.qqMusic;
              g = m.userId;
              (h = m.cookies) && ('\u6211\u559c\u6b22' !== d && services.QQMusic.addToDir({
                songmid: o,
                dirid: e.dirid,
                qq: g,
                cookies: h
              }).then(function (e) {
                e.title === locales.default.COLLECT_SUCCESS ? toast(locales.default.COLLECT_DONE) : toast(locales.default.COLLECT_FAILED);
              }), services.QQMusic.like({
                songmid: o,
                qq: g,
                cookies: h
              }).then(function () {
                toast(locales.default.COLLECT_DONE);
              }));
            case 22:
              l.onClosed();
            case 23:
            case "end":
              return k.stop();
          }
        }, null, this);
      }, l.collectToNetease = function (e, t) {
        var a, l;
        return regeneratorRuntime.async(function (r) {
          for (;;) switch (r.prev = r.next) {
            case 0:
              r.next = 2;
              return regeneratorRuntime.awrap(services.Netease.playlist_tracks({
                pid: e,
                tracks: t
              }));
            case 2:
              if (a = r.sent, !(0, utils.usable)(a)) {
                r.next = 11;
                break;
              }
              if (301 !== (l = a.code)) {
                r.next = 8;
                break;
              }
              toast(locales.default.NETEASE_NOT_LOGIN);
              return r.abrupt("return");
            case 8:
              502 === l && toast(locales.default.COLLECT_DUPLICATE);
              200 === l && toast(locales.default.COLLECT_DONE);
              users.default.removeNetEasePlaylistCache(e);
            case 11:
            case "end":
              return r.stop();
          }
        }, null, this);
      }, a));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        var e = this;
        this.sub = events.emitter.addListener(names.default.CollectModal, function (t) {
          var a = t.api,
            l = t.song,
            r = t.data;
          a && (e.setState({
            api: a,
            mainModalShow: true
          }), e.playlist(a), e.getLocalPlaylist(), l ? e.setState({
            songItem: l
          }) : r && e.setState({
            data: r
          }));
        });
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
          t = this.state,
          a = t.playlist,
          l = t.locals;
        return React.default.createElement(ReactNative.Modal, {
          animationType: "fade",
          transparent: true,
          onRequestClose: this.onClosed,
          visible: this.state.mainModalShow
        }, React.default.createElement(ReactNative.View, {
          style: q.container
        }, React.default.createElement(components.Background, {
          imageStyle: {
            opacity: .5
          }
        }), React.default.createElement(ReactNative.TouchableWithoutFeedback, {
          onPress: this.onClosed
        }, React.default.createElement(ReactNative.View, {
          style: [ReactNative.StyleSheet.absoluteFill]
        })), React.default.createElement(module715.default, {
          onPress: this.onTop,
          content: locales.default.ADD_TO_MIX
        }), React.default.createElement(FadingEdge.default, {
          top: 30
        }, React.default.createElement(reactNativeSpringScrollview.SpringScrollView, {
          ref: function (t) {
            return e._scrollView = t;
          }
        }, React.default.createElement(React.default.Fragment, null, l.map(function (t, a) {
          return React.default.createElement(module714.default, {
            key: a,
            title: t.title,
            img: t.img,
            onPress: function () {
              return e.onLocalCollect(a);
            },
            trackCount: t.tracks.length
          });
        })), a.map(function (t, a) {
          return e._renderItem({
            item: t,
            index: a
          });
        }), React.default.createElement(ReactNative.View, {
          style: q.footer
        }))), l.length < 1 && a.length < 1 && React.default.createElement(ReactNative.View, {
          style: q.null
        }, React.default.createElement(ReactNative.Text, {
          style: [q.text, {
            textAlign: 'center',
            opacity: .8
          }]
        }, "\u7a7a", '\n', "Null"))));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent),
  q = ReactNative.StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      alignItems: 'center'
    },
    text: {
      fontSize: 16
    },
    null: {
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    footer: {
      height: 50
    }
  }),
  v = E;
exports.default = v;
