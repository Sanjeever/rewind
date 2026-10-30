Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeTabView = require("react-native-tab-view"),
  components = require("../components/index"),
  module821 = babelHelpers.interopRequireDefault(require("../modules/module-821")),
  constants = require("../theme/constants"),
  names = babelHelpers.interopRequireDefault(require("../events/names")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  services = require("../services/index"),
  events = require("../events/index"),
  types = babelHelpers.interopRequireWildcard(require("../utils/types")),
  module919 = babelHelpers.interopRequireDefault(require("../modules/module-919")),
  h = constants.DEVICE_HEIGHT - constants.DEVICE_WIDTH - constants.ITEM_HEIGHT,
  v = function (e) {
    function t() {
      var e, n, r;
      babelHelpers.classCallCheck(this, t);
      for (var a = arguments.length, u = new Array(a), g = 0; g < a; g++) u[g] = arguments[g];
      return babelHelpers.possibleConstructorReturn(r, (n = r = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(u))), r._nativeOffset = {
        x: new ReactNative.Animated.Value(0),
        y: new ReactNative.Animated.Value(0)
      }, r._tabViewHeights = [0, 0], r.state = {
        profile: {},
        follows: [],
        followeds: [],
        userId: null,
        followed: true,
        tabViewHeight: h,
        index: 0,
        routes: [{
          key: '1',
          title: locales.default.FOLLOWS
        }, {
          key: '2',
          title: locales.default.FOLLOWER
        }]
      }, r.getFollows = function (e, t) {
        var n, a, l, o, i;
        return regeneratorRuntime.async(function (s) {
          for (;;) switch (s.prev = s.next) {
            case 0:
              s.next = 2;
              return regeneratorRuntime.awrap(services.Netease.user_follows(e, t));
            case 2:
              n = s.sent;
              types.isObject(n) && (a = n.code, l = n.follow, 200 === a && (r.setState({
                follows: babelHelpers.toConsumableArray(r.state.follows).concat(babelHelpers.toConsumableArray(l))
              }), null === (o = (i = r._list).endLoading) || void 0 === o || o.call(i)));
            case 4:
            case "end":
              return s.stop();
          }
        }, null, this);
      }, r.getFolloweds = function (e, t) {
        var n, a, l, o, i;
        return regeneratorRuntime.async(function (s) {
          for (;;) switch (s.prev = s.next) {
            case 0:
              s.next = 2;
              return regeneratorRuntime.awrap(services.Netease.user_followeds(e, t));
            case 2:
              n = s.sent;
              types.isObject(n) && (a = n.code, l = n.followeds, 200 === a && (r.setState({
                followeds: babelHelpers.toConsumableArray(r.state.followeds).concat(babelHelpers.toConsumableArray(l))
              }), null === (o = (i = r._list).endLoading) || void 0 === o || o.call(i)));
            case 4:
            case "end":
              return s.stop();
          }
        }, null, this);
      }, r.getMore = function () {
        var e = r.state,
          t = e.follows,
          n = e.followeds,
          a = e.userId,
          l = e.index;
        if (0 === l) {
          var o = t.length;
          r.getFollows(a, o);
        } else if (1 === l) {
          var i = n.length;
          r.getFolloweds(a, i);
        }
      }, r._handleIndexChange = function (e) {
        return r.setState({
          index: e,
          tabViewHeight: r._tabViewHeights[e]
        });
      }, r._renderHeader = function (e) {
        return React.default.createElement(reactNativeTabView.TabBar, babelHelpers.extends({
          pressColor: 'rgba(0,0,0,0.3)',
          renderText: r._renderText,
          tabStyle: {
            backgroundColor: 'rgba(0,0,0,0)'
          },
          labelStyle: {
            backgroundColor: 'rgba(0,0,0,0)'
          },
          indicatorStyle: {
            backgroundColor: constants.COLORS.primary
          },
          style: {
            marginTop: 0,
            backgroundColor: 0,
            elevation: 0
          }
        }, e));
      }, r._renderScene = function (e) {
        var t = e.route,
          n = r.state,
          a = n.follows,
          i = n.followeds;
        switch (t.key) {
          case '1':
            return (null === a || void 0 === a ? void 0 : a.length) > 0 ? React.default.createElement(ReactNative.View, {
              onLayout: function (e) {
                return r.onTabViewLayout(e, 0);
              }
            }, a.map(function (e, t) {
              return r.renderItem({
                item: e,
                index: t
              });
            })) : React.default.createElement(components.Spinkit, null);
          case '2':
            return (null === i || void 0 === i ? void 0 : i.length) > 0 ? React.default.createElement(ReactNative.View, {
              onLayout: function (e) {
                return r.onTabViewLayout(e, 1);
              }
            }, i.map(function (e, t) {
              return r.renderItem({
                item: e,
                index: t
              });
            })) : React.default.createElement(components.Spinkit, null);
          default:
            return null;
        }
      }, r.onTabViewLayout = function (e, t) {
        var n = e.nativeEvent.layout.height;
        n && (0 === t && r.setState({
          tabViewHeight: n
        }), r._tabViewHeights[t] = n);
      }, r.onHeart = function () {
        var e, t, n, a, l;
        return regeneratorRuntime.async(function (o) {
          for (;;) switch (o.prev = o.next) {
            case 0:
              e = r.state;
              t = e.followed;
              n = e.userId;
              a = true === t ? 0 : 1;
              o.next = 4;
              return regeneratorRuntime.awrap(services.Netease.follow_user({
                uid: n,
                type: a
              }));
            case 4:
              (l = o.sent) && 200 !== l.code && toast(locales.default.ERROR);
              r.setState({
                followed: !t
              });
            case 7:
            case "end":
              return o.stop();
          }
        }, null, this);
      }, r.onUserInfo = function (e) {
        r.props.navigation.navigate('UserInfo', {
          userId: e.userId
        });
      }, r.onSelectedUser = function (e) {
        events.emitter.emit(names.default.SelectedUser, e);
      }, r.renderItem = function (e) {
        var t = e.item;
        return React.default.createElement(components.ListItem, {
          img: t.avatarUrl + '?param=200y200',
          title: t.nickname,
          subtitle: t.signature,
          vip: 0 !== t.userType,
          onPress: function () {
            return r.onUserInfo(t);
          },
          onLongPress: function () {
            return r.onSelectedUser(t);
          }
        });
      }, n));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        var e = this.props.navigation.state.params;
        if (types.isObject(e)) {
          var t = e.profile;
          if (types.isObject(t)) {
            var n = t.userId,
              r = t.followed;
            this.setState({
              profile: t,
              userId: n,
              followed: r
            });
            this.getFollows(n);
            this.getFolloweds(n);
          }
        }
      }
    }, {
      key: "render",
      value: function () {
        var e = this,
          t = this.state,
          n = t.profile,
          r = t.followed,
          a = t.tabViewHeight;
        return React.default.createElement(ReactNative.View, {
          style: m.container
        }, React.default.createElement(components.Background, null), React.default.createElement(components.ParallaxScrollView, {
          onRef: function (t) {
            return e._list = t;
          },
          onLoading: this.getMore,
          onNativeContentOffsetExtract: this._nativeOffset,
          loadingFooter: module821.default
        }, React.default.createElement(module919.default, {
          nativeOffset: this._nativeOffset,
          profile: n,
          followed: r,
          onHeart: this.onHeart
        }), React.default.createElement(reactNativeTabView.TabViewAnimated, {
          style: {
            height: a + 50
          },
          navigationState: this.state,
          renderScene: this._renderScene,
          renderHeader: this._renderHeader,
          onIndexChange: this._handleIndexChange
        })));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = v;
var m = ReactNative.StyleSheet.create({
  container: {
    flex: 1
  }
});
