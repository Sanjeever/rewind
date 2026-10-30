Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  components = require("../components/index"),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  constants = require("../theme/constants"),
  names = babelHelpers.interopRequireDefault(require("../events/names")),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  services = require("../services/index"),
  events = require("../events/index"),
  types = babelHelpers.interopRequireWildcard(require("../utils/types")),
  module920 = babelHelpers.interopRequireDefault(require("../modules/module-920")),
  y = function (e) {
    function t() {
      var e, n, a;
      babelHelpers.classCallCheck(this, t);
      for (var r = arguments.length, y = new Array(r), I = 0; I < r; I++) y[I] = arguments[I];
      return babelHelpers.possibleConstructorReturn(a, (n = a = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(y))), a.state = {
        profile: {},
        playlist: [],
        listenSongs: 0,
        peopleCanSeeMyPlayRecord: false
      }, a.getInfo = function (e) {
        var t, n, r, l, i;
        return regeneratorRuntime.async(function (o) {
          for (;;) switch (o.prev = o.next) {
            case 0:
              o.next = 2;
              return regeneratorRuntime.awrap(services.Netease.user_detail(e));
            case 2:
              if (t = o.sent, !types.isObject(t)) {
                o.next = 10;
                break;
              }
              if (n = t.profile, r = t.code, l = t.listenSongs, i = t.peopleCanSeeMyPlayRecord, 301 !== r) {
                o.next = 8;
                break;
              }
              toast(locales.default.NETEASE_NOT_LOGIN);
              return o.abrupt("return");
            case 8:
              a.setState({
                profile: n,
                listenSongs: l,
                peopleCanSeeMyPlayRecord: i
              });
              a.getPlaylist(e);
            case 10:
            case "end":
              return o.stop();
          }
        }, null, this);
      }, a.getPlaylist = function (e) {
        var t, n;
        return regeneratorRuntime.async(function (r) {
          for (;;) switch (r.prev = r.next) {
            case 0:
              r.next = 2;
              return regeneratorRuntime.awrap(services.Netease.user_playlist(e));
            case 2:
              t = r.sent;
              types.isObject(t) && (n = t.playlist, a.setState({
                playlist: n
              }));
            case 4:
            case "end":
              return r.stop();
          }
        }, null, this);
      }, a.onFollow = function () {
        var e = a.state.profile;
        a.props.navigation.navigate('FollowPage', {
          profile: e
        });
      }, a.onSelectedUser = function () {
        var e = a.state.profile;
        events.emitter.emit(names.default.SelectedUser, e);
      }, a.renderForeground = function (e) {
        var t = a.state,
          n = t.profile,
          r = t.listenSongs,
          s = n.backgroundUrl,
          c = n.avatarUrl,
          f = n.nickname,
          g = n.signature,
          y = [{
            translateY: e.y.interpolate({
              inputRange: [-constants.DEVICE_WIDTH, 0],
              outputRange: [-constants.DEVICE_WIDTH / 2, 0],
              extrapolate: 'clamp'
            })
          }, {
            scale: e.y.interpolate({
              inputRange: [-constants.DEVICE_WIDTH, 0],
              outputRange: [2, 1],
              extrapolate: 'clamp'
            })
          }];
        return React.default.createElement(ReactNative.View, {
          style: E.foreground
        }, types.isString(s) && React.default.createElement(ReactNative.Animated.Image, {
          source: {
            uri: s
          },
          style: [E.background, {
            transform: y
          }]
        }), React.default.createElement(ReactNative.Animated.View, {
          style: [E.overlay, {
            transform: y
          }]
        }), c && React.default.createElement(ReactNative.TouchableOpacity, {
          onPress: a.onFollow,
          onLongPress: a.onSelectedUser
        }, React.default.createElement(ReactNative.Animated.View, {
          style: {
            padding: 20,
            alignItems: 'center'
          }
        }, React.default.createElement(module920.default, {
          imgUrl: c,
          nativeOffset: e
        }), React.default.createElement(ReactNative.Animated.View, {
          style: {
            alignItems: 'center',
            opacity: e.y.interpolate({
              inputRange: [-constants.DEVICE_WIDTH / 3, 0],
              outputRange: [0, 1],
              extrapolate: 'clamp'
            })
          }
        }, f ? React.default.createElement(ReactNative.Text, {
          numberOfLines: 1,
          style: [E.title]
        }, f) : null, g ? React.default.createElement(ReactNative.Text, {
          numberOfLines: 2,
          style: [E.subtitle]
        }, g) : null))), React.default.createElement(ReactNative.View, {
          style: {
            height: 60,
            width: '100%',
            position: 'absolute',
            bottom: 0
          }
        }, React.default.createElement(components.ListItem, {
          img: null,
          errorIconName: icons.default.CHART_BAR,
          title: locales.default.LISTEN_RECORD,
          subtitle: r + " " + locales.default.SONG_COUNT,
          onPress: a.onListenRecord
        })));
      }, a.onListenRecord = function () {
        var e = a.state,
          t = e.profile;
        e.peopleCanSeeMyPlayRecord ? a.props.navigation.navigate('ListenRecord', {
          profile: t
        }) : toast(locales.default.INVISIBLE);
      }, a.onPlaylist = function (e) {
        a.props.navigation.navigate('Playlist', {
          playlist: e,
          api: providers.default.netEase
        });
      }, a.renderItem = function (e) {
        var t = e.item,
          n = e.index;
        return React.default.createElement(components.ListItem, {
          key: n,
          img: t.coverImgUrl + '?param=200y200',
          title: 0 === n ? '\u2661' : t.name,
          subtitle: t.trackCount + " " + locales.default.SONG_COUNT,
          onPress: function () {
            return a.onPlaylist(t);
          },
          rightIcon: {
            name: icons.default.INTERSECTION,
            size: 22,
            onPress: function () {
              return a.onPlaylistIntersection(t);
            }
          }
        });
      }, a.onPlaylistIntersection = function (e) {
        a.props.navigation.navigate('PlaylistIntersection', {
          item: e
        });
      }, n));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        var e = this.props.navigation.state.params;
        if (types.isObject(e)) {
          var t = e.userId;
          types.isNumber(t) && this.getInfo(t);
        }
      }
    }, {
      key: "render",
      value: function () {
        var e = this,
          t = this.state.playlist;
        return React.default.createElement(ReactNative.View, {
          style: E.container
        }, React.default.createElement(components.Background, null), React.default.createElement(components.ParallaxScrollView, {
          renderForeground: this.renderForeground
        }, (null === t || void 0 === t ? void 0 : t.length) > 0 ? t.map(function (t, n) {
          return e.renderItem({
            item: t,
            index: n
          });
        }) : React.default.createElement(components.Spinkit, {
          style: E.spinkit
        }), React.default.createElement(components.EmptyFooter, null)));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = y;
var E = ReactNative.StyleSheet.create({
  container: {
    flex: 1
  },
  foreground: {
    height: constants.DEVICE_WIDTH + 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 60
  },
  background: {
    height: constants.DEVICE_WIDTH,
    width: '100%',
    position: 'absolute',
    top: 0
  },
  overlay: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 15
  },
  subtitle: {
    textAlign: 'center'
  },
  spinkit: {
    height: constants.DEVICE_HEIGHT - constants.DEVICE_WIDTH - 2 * constants.ITEM_HEIGHT
  }
});
