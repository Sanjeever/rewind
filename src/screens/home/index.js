Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var immer = require("immer"),
  React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  FadingEdge = babelHelpers.interopRequireDefault(require("../../components/FadingEdge")),
  components = require("../../components/index"),
  providers = babelHelpers.interopRequireDefault(require("../../services/providers")),
  defaults = require("../../settings/defaults"),
  constants = require("../../theme/constants"),
  names = babelHelpers.interopRequireDefault(require("../../events/names")),
  pages = babelHelpers.interopRequireDefault(require("../../settings/pages")),
  keys = babelHelpers.interopRequireDefault(require("../../storage/keys")),
  endpoints = require("../../services/endpoints"),
  services = require("../../services/index"),
  events = require("../../events/index"),
  utils = require("../../utils/index"),
  types = babelHelpers.interopRequireWildcard(require("../../utils/types")),
  playlists = babelHelpers.interopRequireDefault(require("../../storage/playlists")),
  users = babelHelpers.interopRequireDefault(require("../../storage/users")),
  Playlists = babelHelpers.interopRequireDefault(require("./Playlists")),
  PlaylistHeader = babelHelpers.interopRequireDefault(require("./PlaylistHeader")),
  P = function (e) {
    function t() {
      var e, a, r;
      babelHelpers.classCallCheck(this, t);
      for (var n = arguments.length, l = new Array(n), o = 0; o < n; o++) l[o] = arguments[o];
      return babelHelpers.possibleConstructorReturn(r, (a = r = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(l))), r.showNetease = true, r.showQQMusic = true, r.state = {
        netEase: [],
        qqMusic: [],
        showList: true,
        isConnected: true,
        userId: 0,
        autoSetPlaylistOrder: defaults.defaultSettings.autoSetPlaylistOrder.on,
        pagesOrder: pages.default.pages,
        apisOrder: pages.default.apis
      }, r.dailySignin = function () {
        return regeneratorRuntime.async(function (e) {
          for (;;) switch (e.prev = e.next) {
            case 0:
              services.Netease.daily_signin();
            case 1:
            case "end":
              return e.stop();
          }
        }, null, this);
      }, r.happyBirthday = function () {
        var e, t, a, n, s, i;
        return regeneratorRuntime.async(function (u) {
          for (;;) switch (u.prev = u.next) {
            case 0:
              u.next = 2;
              return regeneratorRuntime.awrap(users.default.getUserInfo());
            case 2:
              if (e = u.sent) {
                u.next = 5;
                break;
              }
              return u.abrupt("return");
            case 5:
              t = e.netEase.userId;
              u.next = 8;
              return regeneratorRuntime.awrap(services.Netease.profile(t));
            case 8:
              a = u.sent;
              n = a.code;
              s = a.profile;
              200 === n && (i = s.birthday, utils.timeFormatter.isToday(i) && r.props.navigation.navigate('HappyBirthday', {
                profile: s
              }));
            case 11:
            case "end":
              return u.stop();
          }
        }, null, this);
      }, r.loadOrder = function () {
        storage.load({
          key: keys.default.pagesOrder
        }).then(function (e) {
          e && r.setState({
            pagesOrder: e
          });
        }).catch(function () {
          return null;
        });
        storage.load({
          key: keys.default.apisOrder
        }).then(function (e) {
          e && r.setState({
            apisOrder: e
          });
        }).catch(function () {
          return null;
        });
      }, r.alertOpenTip = function () {
        ReactNative.Alert.alert('\u9996\u6b21\u542f\u52a8', '\u9700\u8981\u67e5\u770b\u64cd\u4f5c\u6307\u5357\u5417\uff1f', [{
          text: '\u4e0d\u7528\u4e86',
          onPress: function () {
            return null;
          },
          style: 'cancel'
        }, {
          text: '\u5e94\u7528\u5185\u67e5\u770b',
          onPress: function () {
            return r.props.navigation.navigate('Tip');
          }
        }, {
          text: '\u7528\u6d4f\u89c8\u5668\u6253\u5f00',
          onPress: function () {
            return ReactNative.Linking.openURL(endpoints.HOST_PAGE + "/tutorial");
          }
        }]);
      }, r.isValid = function (e, t) {
        return e && e[t] && types.isObject(e[t]);
      }, r.loadStorage = function () {
        var e;
        return regeneratorRuntime.async(function (t) {
          for (;;) switch (t.prev = t.next) {
            case 0:
              t.next = 2;
              return regeneratorRuntime.awrap(users.default.getUserPlayList());
            case 2:
              if (e = t.sent, types.isObject(e) || true === r.state.isConnected) {
                t.next = 6;
                break;
              }
              r.loadPlaylistById();
              return t.abrupt("return");
            case 6:
              r.isValid(e, providers.default.netEase) && r.setState({
                netEase: e.netEase
              });
              r.isValid(e, providers.default.qqMusic) && r.setState({
                qqMusic: e.qqMusic
              });
            case 8:
            case "end":
              return t.stop();
          }
        }, null, this);
      }, r.loadPlaylistById = function (e, t) {
        var a, n;
        return regeneratorRuntime.async(function (s) {
          for (;;) switch (s.prev = s.next) {
            case 0:
              if (true === r.state.isConnected) {
                s.next = 3;
                break;
              }
              return s.abrupt("return");
            case 3:
              s.next = 5;
              return regeneratorRuntime.awrap(users.default.getUserInfo());
            case 5:
              if (n = s.sent, !types.isObject(n)) {
                s.next = 16;
                break;
              }
              if (!e) {
                s.next = 12;
                break;
              }
              s.next = 10;
              return regeneratorRuntime.awrap(r["loadPlaylist_" + e](n));
            case 10:
              s.next = 16;
              break;
            case 12:
              s.next = 14;
              return regeneratorRuntime.awrap(r.loadPlaylist_netEase(n));
            case 14:
              s.next = 16;
              return regeneratorRuntime.awrap(r.loadPlaylist_qqMusic(n));
            case 16:
              null === t || void 0 === t || null === (a = t.endRefresh) || void 0 === a || a.call(t);
            case 17:
            case "end":
              return s.stop();
          }
        }, null, this);
      }, r.loadPlaylist_netEase = function (e) {
        var t;
        return regeneratorRuntime.async(function (a) {
          for (;;) switch (a.prev = a.next) {
            case 0:
              if (!r.isValid(e, providers.default.netEase)) {
                a.next = 9;
                break;
              }
              if (t = e.netEase.userId) {
                a.next = 4;
                break;
              }
              return a.abrupt("return");
            case 4:
              r.setState({
                userId: t
              });
              a.next = 7;
              return regeneratorRuntime.awrap(r.getNeteasePlaylist(t));
            case 7:
              a.next = 9;
              return regeneratorRuntime.awrap(r.netEaselikelist(t));
            case 9:
            case "end":
              return a.stop();
          }
        }, null, this);
      }, r.loadPlaylist_qqMusic = function (e) {
        return regeneratorRuntime.async(function (t) {
          for (;;) switch (t.prev = t.next) {
            case 0:
              if (!r.isValid(e, providers.default.qqMusic)) {
                t.next = 5;
                break;
              }
              t.next = 3;
              return regeneratorRuntime.awrap(r.getQQMusicPlaylist(e.qqMusic.userId));
            case 3:
              t.next = 5;
              return regeneratorRuntime.awrap(r.qqMusicLikelist());
            case 5:
            case "end":
              return t.stop();
          }
        }, null, this);
      }, r.setDefaultState = function () {
        r.setState({
          netEase: [],
          qqMusic: [],
          showList: true,
          isConnected: true,
          userId: 0
        });
      }, r.netEaseRefreshLogin = function () {
        return regeneratorRuntime.async(function (e) {
          for (;;) switch (e.prev = e.next) {
            case 0:
              if (true === r.state.isConnected) {
                e.next = 2;
                break;
              }
              return e.abrupt("return");
            case 2:
              services.Netease.login_refresh();
            case 3:
            case "end":
              return e.stop();
          }
        }, null, this);
      }, r.netEaselikelist = function (e) {
        var t, a;
        return regeneratorRuntime.async(function (r) {
          for (;;) switch (r.prev = r.next) {
            case 0:
              if (e) {
                r.next = 2;
                break;
              }
              return r.abrupt("return");
            case 2:
              r.next = 4;
              return regeneratorRuntime.awrap(services.Netease.likelist(e));
            case 4:
              t = r.sent;
              (0, utils.usable)(t) && (a = t.ids, 200 === t.code && users.default.saveUserLikeList(a, providers.default.netEase));
            case 6:
            case "end":
              return r.stop();
          }
        }, null, this);
      }, r.qqMusicLikelist = function () {
        storage.load({
          key: keys.default.playlist
        }).then(function (e) {
          if (e.qqMusic) {
            var t = (0, utils.delve)(e, 'qqMusic.0.id');
            services.QQMusic.disslist({
              id: t
            }).then(function (e) {
              if (types.isArray(e) && !(e.length < 1)) {
                var t = [];
                e[0].songlist.map(function (e) {
                  t.push(e.songmid);
                });
                users.default.saveUserLikeList(t, providers.default.qqMusic);
              }
            });
          }
        }).catch(function (e) {
          return e;
        });
      }, r.getQQMusicPlaylist = function (e) {
        var t, a, n, s, i, u, l;
        return regeneratorRuntime.async(function (o) {
          for (;;) switch (o.prev = o.next) {
            case 0:
              if (e) {
                o.next = 2;
                break;
              }
              return o.abrupt("return");
            case 2:
              o.next = 4;
              return regeneratorRuntime.awrap(services.QQMusic.profile(e));
            case 4:
              t = o.sent;
              o.next = 7;
              return regeneratorRuntime.awrap(services.QQMusic.user_created_list(e));
            case 7:
              if (a = o.sent, n = t.mymusic, s = t.mydiss, n) {
                o.next = 11;
                break;
              }
              return o.abrupt("return");
            case 11:
              i = n.find(function (e) {
                return '\u559c\u6b22' === e.title || '\u6211\u559c\u6b22' === e.title;
              });
              u = [i].concat(babelHelpers.toConsumableArray(s.list), babelHelpers.toConsumableArray(a));
              o.next = 15;
              return regeneratorRuntime.awrap(playlists.default.newOrder({
                api: providers.default.qqMusic,
                newArr: u,
                on: r.state.autoSetPlaylistOrder
              }));
            case 15:
              l = o.sent;
              r.setState({
                qqMusic: l
              });
              users.default.saveUserPlayList(l, providers.default.qqMusic);
            case 18:
            case "end":
              return o.stop();
          }
        }, null, this);
      }, r.getNeteasePlaylist = function (e) {
        var t, a;
        return regeneratorRuntime.async(function (n) {
          for (;;) switch (n.prev = n.next) {
            case 0:
              if (e) {
                n.next = 2;
                break;
              }
              return n.abrupt("return");
            case 2:
              n.next = 4;
              return regeneratorRuntime.awrap(services.Netease.user_playlist(e));
            case 4:
              if (t = n.sent, !(0, utils.usable)(t)) {
                n.next = 11;
                break;
              }
              n.next = 8;
              return regeneratorRuntime.awrap(playlists.default.newOrder({
                api: providers.default.netEase,
                newArr: t.playlist,
                on: r.state.autoSetPlaylistOrder
              }));
            case 8:
              a = n.sent;
              r.setState({
                netEase: a
              });
              users.default.saveUserPlayList(a, providers.default.netEase);
            case 11:
            case "end":
              return n.stop();
          }
        }, null, this);
      }, r.Playlist = function (e, t, a) {
        var n = r.state.userId;
        switch (t) {
          case providers.default.netEase:
            r.props.navigation.navigate('Playlist', {
              playlist: e,
              userId: n,
              api: providers.default.netEase,
              index: a,
              subscribed: true
            });
            break;
          case providers.default.qqMusic:
            r.props.navigation.navigate('Playlist', {
              playlist: e,
              api: providers.default.qqMusic,
              index: a,
              subscribed: true
            });
            break;
          case providers.default.local:
            r.props.navigation.navigate('CustomPlaylist', {
              playlist: e,
              index: a
            });
        }
      }, r.collectPlaylistOrder = function (e) {
        var t, a, n, i, u, l;
        return regeneratorRuntime.async(function (o) {
          for (;;) switch (o.prev = o.next) {
            case 0:
              t = e.api;
              a = e.index;
              n = r.state;
              i = n.netEase;
              u = n.qqMusic;
              o.next = 4;
              return regeneratorRuntime.awrap(playlists.default.collect({
                playlist: {
                  netEase: i,
                  qqMusic: u
                },
                api: t,
                index: a
              }));
            case 4:
              (l = o.sent) && r.setState((0, immer.produce)(function (e) {
                e[t] = l;
              }));
            case 6:
            case "end":
              return o.stop();
          }
        }, null, this);
      }, r.renderPager = function () {
        var e = r.state.pagesOrder;
        return (0, utils.groupedArray)(e, 4).map(function (e, t) {
          return React.default.createElement(ReactNative.View, {
            style: M.compCon,
            key: t
          }, e.map(function (e, t) {
            return React.default.createElement(PlaylistHeader.default, {
              icon: e.icon,
              key: t,
              onPress: function () {
                return r.goToPage(e.page);
              }
            });
          }));
        });
      }, r.renderHeader = function () {
        return React.default.createElement(ReactNative.ViewPagerAndroid, {
          initialPage: 0,
          style: {
            height: 100,
            width: '100%'
          }
        }, r.renderPager());
      }, r.goToPage = function (e) {
        switch (e) {
          case 'localMusic':
            r.props.navigation.navigate('LocalMusic');
            break;
          case 'history':
            r.props.navigation.navigate('MusicHistory');
            break;
          case 'recommend':
            r.props.navigation.navigate('MusicRecommend');
            break;
          case 'radio':
            r.props.navigation.navigate('Radio');
            break;
          case 'privateFM':
            events.emitter.emit(names.default.FM_MODE);
            break;
          case 'charts':
            r.props.navigation.navigate('Charts');
            break;
          case 'favs':
            r.props.navigation.navigate('Favs');
            break;
          case 'hotPlaylist':
            r.props.navigation.navigate('HotPlaylist');
            break;
          case 'subNewSongs':
            r.props.navigation.navigate('SubNewSongs');
        }
      }, a));
    }
    babelHelpers.createClass(t, [{
      key: "UNSAFE_componentWillMount",
      value: function () {
        var e = this;
        utils.firstTimeChecker.check().then(function (t) {
          true === t && e.alertOpenTip();
        });
      }
    }, {
      key: "componentDidMount",
      value: function () {
        var e = this;
        ReactNative.NetInfo.isConnected.fetch().done(function (t) {
          e.setState({
            isConnected: t
          }, function () {
            e.loadStorage();
            e.loadPlaylistById();
            e.dailySignin();
          });
        });
        this.loginedListener = events.emitter.addListener(names.default.UserLogined, function () {
          setTimeout(function () {
            e.loadStorage();
            e.loadPlaylistById();
          }, 500);
        });
        this.playlistSetOrderListener = events.emitter.addListener(names.default.PlaylistSetOrder, function (t) {
          var a = t.index,
            r = t.api;
          true === e.state.autoSetPlaylistOrder && e.collectPlaylistOrder({
            index: a,
            api: r
          });
        });
        this.setStateListener = events.emitter.addListener(names.default.SetHomeState, function (t) {
          e.setState((0, immer.produce)(function (e) {
            Object.keys(t).forEach(function (a) {
              e[a] = t[a];
            });
          }));
        });
        this.loadOrder();
        this.happyBirthday();
        this.netEaseRefreshLogin();
      }
    }, {
      key: "componentWillUnmount",
      value: function () {
        this.loginedListener.remove();
        this.playlistSetOrderListener.remove();
        this.setStateListener.remove();
      }
    }, {
      key: "render",
      value: function () {
        var e = this.state,
          t = e.netEase,
          a = e.qqMusic,
          r = e.apisOrder;
        return React.default.createElement(ReactNative.View, {
          style: M.container
        }, React.default.createElement(components.Background, null), this.renderHeader(), React.default.createElement(FadingEdge.default, {
          top: 30
        }, React.default.createElement(Playlists.default, {
          apisOrder: r,
          navigation: this.props.navigation,
          netEase: t,
          qqMusic: a,
          Playlist: this.Playlist,
          onRefresh: this.loadPlaylistById
        })));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = P;
var M = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: constants.STATUS_BAR_HEIGHT + 40
  },
  compCon: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});
