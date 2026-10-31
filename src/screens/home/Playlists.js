const _default = require('./../../components/Text.js').default;
const _default2 = require('./../../components/Pager.js').default;
const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var immer = require('immer'),
  React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  reactNativeLargelist = require('./../../components/Scrolling.js'),
  reactNativeSpringScrollview = require('./../../components/Scrolling.js'),
  components = require('../../components/index'),
  PlaylistTabs = _interopRequireDefault(require('../../components/PlaylistTabs')),
  constants = require('../../theme/constants'),
  icons = _interopRequireDefault(require('../../theme/icons')),
  locales = _interopRequireDefault(require('../../locales/index')),
  playlistFiles = _interopRequireDefault(require('../../storage/playlistFiles')),
  CreatePlaylist = _interopRequireDefault(require('../../modals/CreatePlaylist')),
  netease = require('../../../assets/images/netease.png'),
  qqmusic = require('../../../assets/images/qqmusic.png'),
  b = {
    custom: '无本地歌单，点击创建。',
    netEase: '无网易云歌单，点击获取',
    qqMusic: '无QQ音乐歌单，点击获取',
  },
  E = class t extends React.PureComponent {
    constructor() {
      var e, n, r;
      for (var a = arguments.length, g = new Array(a), E = 0; E < a; E++) g[E] = arguments[E];
      return (
        (n = r = super(...g)),
        (r._nativeOffset = {
          x: new ReactNative.Animated.Value(0),
          y: new ReactNative.Animated.Value(0),
        }),
        (r.state = {
          custom: [],
          showModal: false,
        }),
        (r.renderPagerContent = function () {
          return r.props.apisOrder.map(function (e) {
            return r.renderContent(e);
          });
        }),
        (r.renderContent = function (e) {
          if ('custom' === e) return r.renderCustomContainer();
          var t = r.props.onRefresh,
            n = r.props[e];
          return React.default.createElement(
            ReactNative.View,
            {
              key: e,
            },
            (null === n || void 0 === n ? void 0 : n.length) > 0
              ? React.default.createElement(reactNativeLargelist.LargeList, {
                  ref: function (t) {
                    return (r['_' + e + 'ScrollView]'] = t);
                  },
                  onRefresh: function () {
                    return t(e, r['_' + e + 'ScrollView]']);
                  },
                  refreshHeader: PlaylistTabs.default,
                  renderHeader: function () {
                    return r.renderHeader(e);
                  },
                  data: [
                    {
                      items: n,
                    },
                  ],
                  heightForIndexPath: function () {
                    return constants.ITEM_HEIGHT;
                  },
                  renderIndexPath: function (t) {
                    var a = t.row;
                    return r['_render_' + e]({
                      item: n[a],
                      index: a,
                    });
                  },
                  onNativeContentOffsetExtract: r._nativeOffset,
                })
              : r.emptyTip(e),
          );
        }),
        (r.renderCustomContainer = function () {
          var e = r.state.custom;
          return React.default.createElement(
            ReactNative.View,
            {
              key: 'custom',
            },
            (null === e || void 0 === e ? void 0 : e.length) > 0
              ? React.default.createElement(reactNativeLargelist.LargeList, {
                  ref: function (e) {
                    return (r._customScrollView = e);
                  },
                  onRefresh: r.refreshLocal,
                  refreshHeader: PlaylistTabs.default,
                  renderHeader: function () {
                    return r.renderHeader('custom');
                  },
                  data: [
                    {
                      items: e,
                    },
                  ],
                  heightForIndexPath: function () {
                    return constants.ITEM_HEIGHT;
                  },
                  renderIndexPath: function (t) {
                    var n = t.row;
                    return r._renderLocal({
                      item: e[n],
                      index: n,
                    });
                  },
                  onNativeContentOffsetExtract: r._nativeOffset,
                })
              : r.emptyTip('custom'),
          );
        }),
        (r.onHeader = function (e) {
          var t;
          switch (e) {
            case 'netEase':
              r.props.navigation.navigate('UserManager');
              break;
            case 'qqMusic':
              t = 'https://y.qq.com/';
              r.props.navigation.navigate('WebViewPage', {
                url: t,
              });
              break;
            case 'custom':
              r.createLocal();
          }
        }),
        (r.createLocal = function () {
          r.setState({
            showModal: !r.state.showModal,
          });
        }),
        (r.createPL = async function ({title, img}) {
          const playlists = [...r.state.custom, {title, img, tracks: []}];
          await playlistFiles.default.toPlaylist({playlists});
          r.setState({custom: playlists, showModal: false});
        }),
        (r.refreshLocal = function () {
          return r.loadLocalPlaylist();
        }),
        (r.loadLocalPlaylist = async function () {
          try {
            const {playlists} = await playlistFiles.default.getPlaylist();
            r.setState({custom: playlists});
          } finally {
            r._customScrollView?.endRefresh();
          }
        }),
        (r.alertDeleteLocalPL = function (e, t) {
          ReactNative.Alert.alert(
            locales.default.CONFIRM_DELETE_CUSTOM_MIX,
            locales.default.CAN_NOT_RECOVER,
            [
              {
                text: locales.default.CANCEL,
                onPress: function () {
                  return null;
                },
                style: 'cancel',
              },
              {
                text: locales.default.CONFIRM,
                onPress: function () {
                  return r.deleteLocalPL(t);
                },
              },
            ],
          );
        }),
        (r.deleteLocalPL = async function (e) {
          var t = (0, immer.produce)(r.state.custom, function (t) {
            t.splice(e, 1);
          });
          await playlistFiles.default.toPlaylist({
            playlists: t,
          });
          r.setState({custom: t});
        }),
        (r.emptyTip = function (e) {
          return React.default.createElement(
            reactNativeSpringScrollview.SpringScrollView,
            {
              contentStyle: {
                flex: 1,
              },
            },
            r.renderHeader(e),
            React.default.createElement(
              ReactNative.View,
              {
                style: {
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                },
              },
              React.default.createElement(
                ReactNative.TouchableNativeFeedback,
                {
                  onPress: function () {
                    return r.onEmptyTip(e);
                  },
                },
                React.default.createElement(
                  ReactNative.View,
                  {
                    style: P.btnCon,
                  },
                  React.default.createElement(
                    _default,
                    {
                      style: P.labelText,
                    },
                    b[e],
                  ),
                ),
              ),
            ),
          );
        }),
        (r.onEmptyTip = function (e) {
          switch (e) {
            case 'netEase':
              r.props.navigation.navigate('NeteaseLogin');
              break;
            case 'qqMusic':
              r.props.navigation.navigate('QQMusicLogin');
              break;
            case 'custom':
              r.createLocal();
          }
        }),
        (r.renderHeader = function (e) {
          var t;
          switch (e) {
            case 'netEase':
              t = netease;
              break;
            case 'qqMusic':
              t = qqmusic;
          }
          return React.default.createElement(
            ReactNative.Animated.View,
            {
              style: [
                P.headerCon,
                {
                  alignItems: 'center',
                  justifyContent: 'center',
                },
                {
                  opacity: r._nativeOffset.y.interpolate({
                    inputRange: [-80, 0],
                    outputRange: [0, 1],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
            t
              ? React.default.createElement(
                  ReactNative.TouchableOpacity,
                  {
                    onPress: function () {
                      return r.onHeader(e);
                    },
                  },
                  React.default.createElement(ReactNative.Image, {
                    source: t,
                    style: {
                      height: 22,
                      width: 22,
                    },
                  }),
                )
              : React.default.createElement(components.Icon, {
                  name: icons.default.DISC,
                  onPress: function () {
                    return r.onHeader(e);
                  },
                }),
          );
        }),
        (r._renderLocal = function (e) {
          var t = e.item,
            n = e.index;
          return React.default.createElement(components.ListItem, {
            errorIconName: icons.default.DISC,
            img: t.img,
            key: n,
            title: t.title,
            subtitle: t.tracks.length,
            onPress: function () {
              return r.props.Playlist(t, 'local', n);
            },
            onLongPress: function () {
              return r.alertDeleteLocalPL(t, n);
            },
          });
        }),
        (r._render_netEase = function (e) {
          var t,
            n = e.item,
            a = e.index,
            l =
              (null === (t = n.name) || void 0 === t ? void 0 : t.length) > 0 && 0 === a
                ? '♡'
                : n.name;
          (l = l.replace(/\s\u6700\u61c2\u4f60.+\u9996$/, '')).includes('私人雷达') &&
            (l = '[私人雷达]');
          return React.default.createElement(components.ListItem, {
            img: n.coverImgUrl + '?param=200y200',
            title: l,
            subtitle: n.trackCount + ' ' + locales.default.SONG_COUNT,
            onPress: function () {
              return r.props.Playlist(n, 'netEase', a);
            },
          });
        }),
        (r._render_qqMusic = function (e) {
          var t = e.item,
            n = e.index,
            a = r.formatItem(t, n);
          return React.default.createElement(components.ListItem, {
            img: a.picurl,
            title: a.title,
            subtitle: a.num,
            onPress: function () {
              return r.props.Playlist(a, 'qqMusic', n);
            },
          });
        }),
        (r.formatItem = function (e, t) {
          var n,
            r = {};
          e.title
            ? ((r.title =
                (null === (n = e.title) || void 0 === n ? void 0 : n.length) > 0 && 0 === t
                  ? '♡'
                  : e.title),
              (r.picurl = '' !== e.picurl ? e.picurl : null),
              (r.num = '' !== e.subtitle ? e.subtitle.replace(/\u9996.+/, '') : null),
              (r.id = e.id || e.dissid),
              (r.dirid = e.dirid))
            : ((r.title = e.dissname),
              (r.num = e.songnum),
              (r.picurl = e.logo),
              (r.id = e.dissid),
              (r.dirid = e.dirid));
          return r;
        }),
        n
      );
    }
    componentDidMount() {
      this.loadLocalPlaylist();
    }
    render() {
      var e = this;
      return React.default.createElement(
        ReactNative.View,
        {
          style: {
            flex: 1,
          },
        },
        React.default.createElement(
          _default2,
          {
            ref: (instance) => (this.viewPager = instance),
            style: {
              flex: 1,
            },
            initialPage: 1,
          },
          this.renderPagerContent(),
        ),
        React.default.createElement(CreatePlaylist.default, {
          showModal: this.state.showModal,
          closeModal: function () {
            return e.setState({
              showModal: false,
            });
          },
          createPL: this.createPL,
        }),
      );
    }
  };
exports.default = E;
var P = ReactNative.StyleSheet.create({
  headerCon: {
    height: 30,
    padding: 5,
    alignItems: 'center',
    flexDirection: 'row',
  },
  labelText: {
    fontSize: 13,
    opacity: 0.9,
  },
  btnCon: {
    height: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
