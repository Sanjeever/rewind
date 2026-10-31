const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
const _extends = require('@babel/runtime/helpers/extends');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  reactNativeTabView = require('react-native-tab-view'),
  components = require('../components/index'),
  ParallaxList = _interopRequireDefault(require('../components/ParallaxList')),
  constants = require('../theme/constants'),
  names = _interopRequireDefault(require('../events/names')),
  locales = _interopRequireDefault(require('../locales/index')),
  services = require('../services/index'),
  events = require('../events/index'),
  types = _interopRequireWildcard(require('../utils/types')),
  UserHeader = _interopRequireDefault(require('./../modules/UserHeader.js')),
  h = constants.DEVICE_HEIGHT - constants.DEVICE_WIDTH - constants.ITEM_HEIGHT,
  v = class t extends React.PureComponent {
    constructor() {
      var e, n, r;
      for (var a = arguments.length, u = new Array(a), g = 0; g < a; g++) u[g] = arguments[g];
      return (
        (n = r = super(...u)),
        (r._nativeOffset = {
          x: new ReactNative.Animated.Value(0),
          y: new ReactNative.Animated.Value(0),
        }),
        (r._tabViewHeights = [0, 0]),
        (r.state = {
          profile: {},
          follows: [],
          followeds: [],
          userId: null,
          followed: true,
          tabViewHeight: h,
          index: 0,
          routes: [
            {
              key: '1',
              title: locales.default.FOLLOWS,
            },
            {
              key: '2',
              title: locales.default.FOLLOWER,
            },
          ],
        }),
        (r.getFollows = async function (id, offset) {
          const response = await services.Netease.user_follows(id, offset);
          if (response?.code === 200) {
            r.setState((previous) => ({
              follows: [...previous.follows, ...response.follow],
            }));
            r._list?.endLoading?.();
          }
        }),
        (r.getFolloweds = async function (id, offset) {
          const response = await services.Netease.user_followeds(id, offset);
          if (response?.code === 200) {
            r.setState((previous) => ({
              followeds: [...previous.followeds, ...response.followeds],
            }));
            r._list?.endLoading?.();
          }
        }),
        (r.getMore = function () {
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
        }),
        (r._handleIndexChange = function (e) {
          return r.setState({
            index: e,
            tabViewHeight: r._tabViewHeights[e],
          });
        }),
        (r._renderHeader = function (e) {
          return React.default.createElement(
            reactNativeTabView.TabBar,
            _extends(
              {
                pressColor: 'rgba(0,0,0,0.3)',
                renderText: r._renderText,
                tabStyle: {
                  backgroundColor: 'rgba(0,0,0,0)',
                },
                labelStyle: {
                  backgroundColor: 'rgba(0,0,0,0)',
                },
                indicatorStyle: {
                  backgroundColor: constants.COLORS.primary,
                },
                style: {
                  marginTop: 0,
                  backgroundColor: 0,
                  elevation: 0,
                },
              },
              e,
            ),
          );
        }),
        (r._renderScene = function (e) {
          var t = e.route,
            n = r.state,
            a = n.follows,
            i = n.followeds;
          switch (t.key) {
            case '1':
              return (null === a || void 0 === a ? void 0 : a.length) > 0
                ? React.default.createElement(
                    ReactNative.View,
                    {
                      onLayout: function (e) {
                        return r.onTabViewLayout(e, 0);
                      },
                    },
                    a.map(function (e, t) {
                      return r.renderItem({
                        item: e,
                        index: t,
                      });
                    }),
                  )
                : React.default.createElement(components.Spinkit, null);
            case '2':
              return (null === i || void 0 === i ? void 0 : i.length) > 0
                ? React.default.createElement(
                    ReactNative.View,
                    {
                      onLayout: function (e) {
                        return r.onTabViewLayout(e, 1);
                      },
                    },
                    i.map(function (e, t) {
                      return r.renderItem({
                        item: e,
                        index: t,
                      });
                    }),
                  )
                : React.default.createElement(components.Spinkit, null);
            default:
              return null;
          }
        }),
        (r.onTabViewLayout = function (e, t) {
          var n = e.nativeEvent.layout.height;
          n &&
            (0 === t &&
              r.setState({
                tabViewHeight: n,
              }),
            (r._tabViewHeights[t] = n));
        }),
        (r.onHeart = async function () {
          const {followed, userId} = r.state;
          const response = await services.Netease.follow_user({
            uid: userId,
            type: followed ? 0 : 1,
          });
          if (response?.code !== 200) {
            toast(locales.default.ERROR);
            return;
          }
          r.setState({
            followed: !followed,
          });
        }),
        (r.onUserInfo = function (e) {
          r.props.navigation.navigate('UserInfo', {
            userId: e.userId,
          });
        }),
        (r.onSelectedUser = function (e) {
          events.emitter.emit(names.default.SelectedUser, e);
        }),
        (r.renderItem = function (e) {
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
            },
          });
        }),
        n
      );
    }
    componentDidMount() {
      var e = this.props.route.params;
      if (types.isObject(e)) {
        var t = e.profile;
        if (types.isObject(t)) {
          var n = t.userId,
            r = t.followed;
          this.setState({
            profile: t,
            userId: n,
            followed: r,
          });
          this.getFollows(n);
          this.getFolloweds(n);
        }
      }
    }
    render() {
      var e = this,
        t = this.state,
        n = t.profile,
        r = t.followed,
        a = t.tabViewHeight;
      return React.default.createElement(
        ReactNative.View,
        {
          style: m.container,
        },
        React.default.createElement(components.Background, null),
        React.default.createElement(
          components.ParallaxScrollView,
          {
            onRef: function (t) {
              return (e._list = t);
            },
            onLoading: this.getMore,
            onNativeContentOffsetExtract: this._nativeOffset,
            loadingFooter: ParallaxList.default,
          },
          React.default.createElement(UserHeader.default, {
            nativeOffset: this._nativeOffset,
            profile: n,
            followed: r,
            onHeart: this.onHeart,
          }),
          React.default.createElement(reactNativeTabView.TabView, {
            style: {
              height: a + 50,
            },
            navigationState: this.state,
            renderScene: this._renderScene,
            renderTabBar: this._renderHeader,
            onIndexChange: this._handleIndexChange,
          }),
        ),
      );
    }
  };
exports.default = v;
var m = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
  },
});
