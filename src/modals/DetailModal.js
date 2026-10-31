const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  reactNativeSpringScrollview = require('./../components/Scrolling.js'),
  rnFetchBlob = _interopRequireDefault(require('react-native-blob-util')),
  components = require('../components/index'),
  providers = _interopRequireDefault(require('../services/providers')),
  constants = require('../theme/constants'),
  TrackActions = _interopRequireDefault(require('./../modules/TrackActions.js')),
  names = _interopRequireDefault(require('../events/names')),
  icons = _interopRequireDefault(require('../theme/icons')),
  locales = _interopRequireDefault(require('../locales/index')),
  downloadModule = _interopRequireDefault(require('../services/download')),
  events = require('../events/index'),
  utils = require('../utils/index'),
  trackInfo = require('../services/trackInfo'),
  queue = _interopRequireDefault(require('../events/queue')),
  ActionRow = _interopRequireDefault(require('./../modules/ActionRow.js')),
  CloseButton = _interopRequireDefault(require('./../modules/CloseButton.js')),
  C = {
    title: locales.default.DELETE_FROM_LOCAL,
    icon: {
      name: icons.default.DELETE,
      color: constants.COLORS.secondary,
    },
  },
  D = {
    title: locales.default.DELETE_FROM_PLAYLIST,
    icon: {
      name: icons.default.DELETE,
      color: constants.COLORS.secondary,
    },
  },
  T = class t extends React.PureComponent {
    constructor() {
      var e, a, l;
      for (var n = arguments.length, r = new Array(n), u = 0; u < n; u++) r[u] = arguments[u];
      return (
        (a = l = super(...r)),
        (l.actionsMap = null),
        (l.state = {
          song: null,
          api: '',
          tools: TrackActions.default,
          artists: [],
          mainModalShow: false,
          sonModalShow: false,
          mvid: null,
        }),
        (l.getData = function (e) {
          var t;
          if ('local' !== e.api) {
            var a = l.state.tools,
              n = (0, trackInfo.extractSingerItem)(e.song, e.api);
            a[2].value = (0, trackInfo.extractSingerName)(e.song, e.api);
            a[3].value = (0, trackInfo.extractAlbumName)(e.song, e.api);
            var o =
                (null === (t = e.song.mv) || void 0 === t ? void 0 : t.vid) ||
                e.song.vid ||
                e.song.mvid ||
                e.song.mv,
              i = (0, trackInfo.extractFullInfo)(e.song, 'big');
            l.setState({
              song: i,
              songItem: e.song,
              index: e.index,
              api: e.api,
              tools: a,
              artists: n,
              playlistId: e.playlistId,
              mvid: o,
            });
          } else
            l.setState({
              api: e.api,
              song: (0, trackInfo.extractFullInfo)(e.song, 'small'),
              songItem: e.song,
              index: e.index,
              tools: [TrackActions.default[0], C],
            });
        }),
        (l.onClose = function () {
          l.setState({
            song: null,
            tools: TrackActions.default,
            artists: [],
            api: '',
            mainModalShow: false,
            sonModalShow: false,
          });
        }),
        (l.renderTools = function (e) {
          return e.map(function (e, t) {
            return e.needCheck && !Boolean(e.value)
              ? null
              : React.default.createElement(ActionRow.default, {
                  key: t,
                  title: e.title,
                  value: e.value,
                  onPress: function () {
                    return l.onListItem(t);
                  },
                });
          });
        }),
        (l.deleteFromLocalAlert = function () {
          ReactNative.Alert.alert(
            locales.default.DELETE_THIS_SONG,
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
                onPress: l.deleteFromLocal,
              },
            ],
          );
        }),
        (l.deleteFromLocal = async function () {
          var e = l.state,
            t = e.songItem,
            a = e.index,
            n = t.path;
          try {
            const removed = await require('../native/mediaStore').default.deleteAudio(t.id);
            if (removed) {
              events.emitter.emit(names.default.DeleteFromLocal, {deleteIndex: a});
              l.onClose();
            }
          } catch (error) {
            toast(locales.default.DELETE_FAILED + '：' + error.message);
          }
        }),
        (l.alertDeleteFromPlaylist = function () {
          ReactNative.Alert.alert(
            locales.default.WARN,
            locales.default.CONFIRM_DELETE_FROM_PLAYLIST,
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
                  return l.deleteFromPlaylist();
                },
              },
            ],
          );
        }),
        (l.deleteFromPlaylist = function () {
          var e,
            t = l.state,
            a = t.api,
            n = t.songItem;
          switch (a) {
            case providers.default.netEase:
              e = n.id;
              events.emitter.emit(names.default.DeleteFromPlaylist, {
                api: a,
                trackid: e,
              });
              break;
            case providers.default.qqMusic:
              e = n.songid;
              events.emitter.emit(names.default.DeleteFromPlaylist, {
                api: a,
                trackid: e,
              });
          }
        }),
        (l.onListItem = function (e) {
          var t,
            a = l.state.api,
            n = {
              0: l.insertToQueue,
              1: 'local' === a ? l.deleteFromLocalAlert : l.onCollect,
              2: l.onArtist,
              3: l.onAlbum,
              4: l.onComment,
              5: l.onShare,
              6: l.onLyric,
              7: l.onDownload,
              8: l.onMV,
            };
          null === (t = n[e]) || void 0 === t || t.call(n);
        }),
        (l.onCollect = function () {
          var e = l.state,
            t = e.api,
            a = e.songItem;
          events.emitter.emit(names.default.CollectModal, {
            api: t,
            song: a,
          });
        }),
        (l.onMV = function () {
          var e = l.state,
            t = e.mvid,
            a = e.api;
          t && (queue.default.playMV(t, a), l.onClose());
        }),
        (l.onLyric = function () {
          var e = l.state,
            t = e.api,
            a = e.songItem,
            n = (0, trackInfo.extractFullInfo)(a).uid;
          l.navigateTo('LyricPage', {
            id: n,
            item: a,
            api: t,
          });
        }),
        (l.onShare = function () {
          var e,
            t = l.state,
            a = t.api,
            n = t.songItem,
            o = (0, trackInfo.extractFullInfo)(n),
            r = (0, utils.parseArtist)(o.singer),
            s = o.uid;
          switch (a) {
            case providers.default.netEase:
              e =
                r +
                ' - ' +
                o.song +
                ' : http://music.163.com/song?id=' +
                s +
                ' (@\u7f51\u6613\u4e91\u97f3\u4e50)';
              break;
            case providers.default.qqMusic:
              e =
                r +
                ' - ' +
                o.song +
                ' : https://y.qq.com/n/yqq/song/' +
                s +
                '.html (@QQ\u97f3\u4e50)';
          }
          ReactNative.Share.share({
            message: e,
          });
        }),
        (l.navigateTo = function (e, t) {
          utils.universalNavigator.navigate(e, t);
          events.emitter.emit(names.default.PlayerClose);
          events.emitter.emit(names.default.NowPlayingModal, {
            forceClose: true,
          });
          l.onClose();
        }),
        (l.onArtist = function () {
          var e = l.state.artists;
          e.length > 1
            ? l.setState({
                sonModalShow: true,
              })
            : e.length > 0 && l.onSingleArtist(e[0]);
        }),
        (l.onSingleArtist = function (e) {
          if (e) {
            var t = l.state.api;
            l.navigateTo('ArtistPage', {
              item: e,
              api: t,
            });
          }
        }),
        (l.onAlbum = function () {
          var e = l.state,
            t = e.api,
            a = e.songItem,
            n = (0, trackInfo.extractAlbumItem)(a, t);
          l.navigateTo('AlbumPage', {
            item: n,
            api: t,
          });
        }),
        (l.onComment = function () {
          var e = l.state,
            t = e.songItem,
            a = e.api;
          l.navigateTo('CommentPage', {
            api: a,
            song: t,
          });
          l.onClose();
        }),
        (l.insertToQueue = function () {
          var e = l.state,
            t = e.songItem,
            a = e.api;
          t &&
            events.emitter.emit(names.default.InsertToList, {
              data: t,
              type: 'item',
              api: a,
            });
        }),
        (l.onDownload = function () {
          var e = l.state,
            t = e.songItem,
            a = e.api,
            n = l.props.cloneThroughLinking,
            o = (0, trackInfo.extractFullInfo)(t.mainSong ? t.mainSong : t),
            i = l.songName(o.song, o.singer),
            r = o.uid;
          downloadModule.default.download(i, r, a, o, n);
        }),
        (l.saveCover = function () {
          var e = l.state,
            t = e.song,
            a = e.songItem;
          events.emitter.emit(names.default.SavePicModal, {
            img: t.img,
            song: a.name,
          });
        }),
        (l.songName = function (e, t) {
          return (t[0].name + ' - ' + e).replace(/\//gi, 'x');
        }),
        a
      );
    }
    componentDidMount() {
      var e = this;
      this.sub = events.emitter.addListener(names.default.DetailModal, function (t) {
        e.setState({
          mainModalShow: true,
        });
        e.getData(t);
      });
    }
    componentWillUnmount() {
      var e, t;
      null === (e = (t = this.sub).remove) || void 0 === e || e.call(t);
    }
    render() {
      var e = this,
        t = this.state,
        a = t.song,
        l = t.playlistId,
        n = t.mvid,
        s = t.mainModalShow,
        d = t.sonModalShow,
        f = t.tools,
        m = t.artists,
        g = this.props.isRound;
      return React.default.createElement(
        ReactNative.Modal,
        {
          animationType: 'fade',
          onRequestClose: this.onClose,
          visible: s,
          style: s && {
            height: constants.DEVICE_HEIGHT,
            width: constants.DEVICE_WIDTH,
          },
        },
        React.default.createElement(
          ReactNative.View,
          {
            style: w.container,
          },
          React.default.createElement(components.Background, {
            imageStyle: {
              opacity: 0.5,
            },
            coverUrl: null === a || void 0 === a ? void 0 : a.img,
            blur: true,
          }),
          React.default.createElement(
            reactNativeSpringScrollview.SpringScrollView,
            {
              style: {
                padding: 10,
                flex: 1,
                width: '100%',
                paddingBottom: 0,
              },
              showsVerticalScrollIndicator: false,
              overScrollMode: 'never',
            },
            React.default.createElement(
              ReactNative.TouchableWithoutFeedback,
              {
                onPress: this.onClose,
              },
              React.default.createElement(ReactNative.View, {
                style: [ReactNative.StyleSheet.absoluteFill],
              }),
            ),
            React.default.createElement(ReactNative.View, {
              style: {
                height: 0.1 * constants.DEVICE_HEIGHT,
                width: '100%',
              },
            }),
            a
              ? React.default.createElement(
                  ReactNative.View,
                  {
                    style: w.songAvatar,
                  },
                  React.default.createElement(
                    ReactNative.TouchableOpacity,
                    {
                      onPress: this.saveCover,
                    },
                    React.default.createElement(ReactNative.Image, {
                      source: {
                        uri: a.img,
                      },
                      style: {
                        height: 150,
                        width: 150,
                        borderRadius: g ? 75 : 5,
                      },
                    }),
                  ),
                  n
                    ? React.default.createElement(CloseButton.default, {
                        onPress: this.onMV,
                        isRound: g,
                      })
                    : null,
                  React.default.createElement(
                    components.Selectable,
                    {
                      numberOfLines: 3,
                      style: [
                        w.text,
                        {
                          flex: 1,
                          fontSize: 18,
                          fontWeight: 'bold',
                          marginTop: 10,
                        },
                      ],
                    },
                    a.song,
                  ),
                  React.default.createElement(
                    components.Selectable,
                    {
                      style: [
                        w.text,
                        {
                          fontSize: 13,
                        },
                      ],
                    },
                    a.album,
                  ),
                )
              : null,
            React.default.createElement(
              ReactNative.View,
              {
                style: w.tool,
              },
              l &&
                React.default.createElement(ActionRow.default, {
                  title: D.title,
                  onPress: this.alertDeleteFromPlaylist,
                }),
              this.renderTools(f),
            ),
            React.default.createElement(ReactNative.View, {
              style: {
                height: 0.1 * constants.DEVICE_HEIGHT,
                width: '100%',
              },
            }),
          ),
          React.default.createElement(
            ReactNative.Modal,
            {
              animationType: 'fade',
              transparent: true,
              onRequestClose: function () {
                return e.setState({
                  sonModalShow: false,
                });
              },
              visible: d,
            },
            React.default.createElement(
              ReactNative.View,
              {
                style: [
                  w.container,
                  {
                    paddingTop: '80%',
                  },
                ],
              },
              React.default.createElement(
                ReactNative.TouchableWithoutFeedback,
                {
                  onPress: function () {
                    return e.setState({
                      sonModalShow: false,
                    });
                  },
                },
                React.default.createElement(ReactNative.View, {
                  style: [ReactNative.StyleSheet.absoluteFill],
                }),
              ),
              null === m || void 0 === m
                ? void 0
                : m.map(function (t, a) {
                    return React.default.createElement(ActionRow.default, {
                      key: a,
                      value: t.name,
                      title: a + 1,
                      onPress: function () {
                        return e.onSingleArtist(t);
                      },
                    });
                  }),
            ),
          ),
        ),
      );
    }
  };
exports.default = T;
var w = ReactNative.StyleSheet.create({
  container: {
    height: constants.DEVICE_HEIGHT,
    width: constants.DEVICE_WIDTH,
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,1)',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  songAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  tool: {
    flex: 1,
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
  },
});
