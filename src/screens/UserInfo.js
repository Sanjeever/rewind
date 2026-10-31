const _default = require('./../components/Text.js').default;
const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  components = require('../components/index'),
  providers = _interopRequireDefault(require('../services/providers')),
  constants = require('../theme/constants'),
  names = _interopRequireDefault(require('../events/names')),
  icons = _interopRequireDefault(require('../theme/icons')),
  locales = _interopRequireDefault(require('../locales/index')),
  services = require('../services/index'),
  events = require('../events/index'),
  types = _interopRequireWildcard(require('../utils/types')),
  styles = _interopRequireDefault(require('./users/styles')),
  y = class t extends React.PureComponent {
    constructor() {
      var e, n, a;
      for (var r = arguments.length, y = new Array(r), I = 0; I < r; I++) y[I] = arguments[I];
      return (
        (n = a = super(...y)),
        (a.state = {
          profile: {},
          playlist: [],
          listenSongs: 0,
          peopleCanSeeMyPlayRecord: false,
        }),
        (a.getInfo = async function (id) {
          const response = await services.Netease.user_detail(id);
          if (!response) return;
          if (response.code === 301) {
            toast(locales.default.NETEASE_NOT_LOGIN);
            return;
          }
          if (!response.profile) throw new Error(response.message || locales.default.ERROR);
          a.setState({
            profile: response.profile,
            listenSongs: response.listenSongs,
            peopleCanSeeMyPlayRecord: response.peopleCanSeeMyPlayRecord,
          });
          await a.getPlaylist(id);
        }),
        (a.getPlaylist = async function (id) {
          const response = await services.Netease.user_playlist(id);
          if (response?.playlist)
            a.setState({
              playlist: response.playlist,
            });
        }),
        (a.onFollow = function () {
          var e = a.state.profile;
          a.props.navigation.navigate('FollowPage', {
            profile: e,
          });
        }),
        (a.onSelectedUser = function () {
          var e = a.state.profile;
          events.emitter.emit(names.default.SelectedUser, e);
        }),
        (a.renderForeground = function (e) {
          var t = a.state,
            n = t.profile,
            r = t.listenSongs,
            s = n.backgroundUrl,
            c = n.avatarUrl,
            f = n.nickname,
            g = n.signature,
            y = [
              {
                translateY: e.y.interpolate({
                  inputRange: [-constants.DEVICE_WIDTH, 0],
                  outputRange: [-constants.DEVICE_WIDTH / 2, 0],
                  extrapolate: 'clamp',
                }),
              },
              {
                scale: e.y.interpolate({
                  inputRange: [-constants.DEVICE_WIDTH, 0],
                  outputRange: [2, 1],
                  extrapolate: 'clamp',
                }),
              },
            ];
          return React.default.createElement(
            ReactNative.View,
            {
              style: E.foreground,
            },
            types.isString(s) &&
              React.default.createElement(ReactNative.Animated.Image, {
                source: {
                  uri: s,
                },
                style: [
                  E.background,
                  {
                    transform: y,
                  },
                ],
              }),
            React.default.createElement(ReactNative.Animated.View, {
              style: [
                E.overlay,
                {
                  transform: y,
                },
              ],
            }),
            c &&
              React.default.createElement(
                ReactNative.TouchableOpacity,
                {
                  onPress: a.onFollow,
                  onLongPress: a.onSelectedUser,
                },
                React.default.createElement(
                  ReactNative.Animated.View,
                  {
                    style: {
                      padding: 20,
                      alignItems: 'center',
                    },
                  },
                  React.default.createElement(styles.default, {
                    imgUrl: c,
                    nativeOffset: e,
                  }),
                  React.default.createElement(
                    ReactNative.Animated.View,
                    {
                      style: {
                        alignItems: 'center',
                        opacity: e.y.interpolate({
                          inputRange: [-constants.DEVICE_WIDTH / 3, 0],
                          outputRange: [0, 1],
                          extrapolate: 'clamp',
                        }),
                      },
                    },
                    f
                      ? React.default.createElement(
                          _default,
                          {
                            numberOfLines: 1,
                            style: [E.title],
                          },
                          f,
                        )
                      : null,
                    g
                      ? React.default.createElement(
                          _default,
                          {
                            numberOfLines: 2,
                            style: [E.subtitle],
                          },
                          g,
                        )
                      : null,
                  ),
                ),
              ),
            React.default.createElement(
              ReactNative.View,
              {
                style: {
                  height: 60,
                  width: '100%',
                  position: 'absolute',
                  bottom: 0,
                },
              },
              React.default.createElement(components.ListItem, {
                img: null,
                errorIconName: icons.default.CHART_BAR,
                title: locales.default.LISTEN_RECORD,
                subtitle: r + ' ' + locales.default.SONG_COUNT,
                onPress: a.onListenRecord,
              }),
            ),
          );
        }),
        (a.onListenRecord = function () {
          var e = a.state,
            t = e.profile;
          e.peopleCanSeeMyPlayRecord
            ? a.props.navigation.navigate('ListenRecord', {
                profile: t,
              })
            : toast(locales.default.INVISIBLE);
        }),
        (a.onPlaylist = function (e) {
          a.props.navigation.navigate('Playlist', {
            playlist: e,
            api: providers.default.netEase,
          });
        }),
        (a.renderItem = function (e) {
          var t = e.item,
            n = e.index;
          return React.default.createElement(components.ListItem, {
            key: n,
            img: t.coverImgUrl + '?param=200y200',
            title: 0 === n ? '♡' : t.name,
            subtitle: t.trackCount + ' ' + locales.default.SONG_COUNT,
            onPress: function () {
              return a.onPlaylist(t);
            },
            rightIcon: {
              name: icons.default.INTERSECTION,
              size: 22,
              onPress: function () {
                return a.onPlaylistIntersection(t);
              },
            },
          });
        }),
        (a.onPlaylistIntersection = function (e) {
          a.props.navigation.navigate('PlaylistIntersection', {
            item: e,
          });
        }),
        n
      );
    }
    componentDidMount() {
      var e = this.props.route.params;
      if (types.isObject(e)) {
        var t = e.userId;
        types.isNumber(t) && this.getInfo(t);
      }
    }
    render() {
      var e = this,
        t = this.state.playlist;
      return React.default.createElement(
        ReactNative.View,
        {
          style: E.container,
        },
        React.default.createElement(components.Background, null),
        React.default.createElement(
          components.ParallaxScrollView,
          {
            renderForeground: this.renderForeground,
          },
          (null === t || void 0 === t ? void 0 : t.length) > 0
            ? t.map(function (t, n) {
                return e.renderItem({
                  item: t,
                  index: n,
                });
              })
            : React.default.createElement(components.Spinkit, {
                style: E.spinkit,
              }),
          React.default.createElement(components.EmptyFooter, null),
        ),
      );
    }
  };
exports.default = y;
var E = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
  },
  foreground: {
    height: constants.DEVICE_WIDTH + 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 60,
  },
  background: {
    height: constants.DEVICE_WIDTH,
    width: '100%',
    position: 'absolute',
    top: 0,
  },
  overlay: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 15,
  },
  subtitle: {
    textAlign: 'center',
  },
  spinkit: {
    height: constants.DEVICE_HEIGHT - constants.DEVICE_WIDTH - 2 * constants.ITEM_HEIGHT,
  },
});
