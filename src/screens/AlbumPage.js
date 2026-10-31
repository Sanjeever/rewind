const _default = require('@react-native-clipboard/clipboard').default;
const _default2 = require('./../components/Text.js').default;
const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  components = require('../components/index'),
  OverflowMenu = _interopRequireDefault(require('./../modules/OverflowMenu.js')),
  providers = _interopRequireDefault(require('../services/providers')),
  constants = require('../theme/constants'),
  icons = _interopRequireDefault(require('../theme/icons')),
  locales = _interopRequireDefault(require('../locales/index')),
  services = require('../services/index'),
  events = require('../events/index'),
  utils = require('../utils/index'),
  queue = _interopRequireDefault(require('../events/queue')),
  sharedUrlsModule = require('../services/sharedUrls'),
  Description = _interopRequireDefault(require('./album/Description')),
  y = constants.DEVICE_WIDTH,
  w = class t extends React.PureComponent {
    constructor(e) {
      var a;
      (a = super(e))._nativeOffset = {
        x: new ReactNative.Animated.Value(0),
        y: new ReactNative.Animated.Value(0),
      };
      a.getDurationSum = function (e) {
        var t = a.state.api;
        return t == providers.default.netEase
          ? e.reduce(function (e, t) {
              return e + t.duration;
            }, 0) / 1e3
          : t === providers.default.duration
            ? e.reduce(function (e, t) {
                return e + t.interval;
              }, 0)
            : void 0;
      };
      a.netEaseAlbum = async function (id) {
        const response = await services.Netease.album(id);
        if (!utils.usable(response)) return;
        if (response.code !== 200) {
          toast(locales.default.ERROR + ' -> ' + response.code);
          return;
        }
        const album = response.album;
        const songs = response.songs || album.songs;
        if (songs) {
          a.setState({
            data: songs,
            loaded: true,
            id,
            publishTime: utils.timeFormatter.localeString(album.publishTime),
            company: album.company,
            description: album.description,
            duration: a.getDurationSum(songs),
          });
          await a.netEaseIsLikedAlbum();
        }
      };
      a.qqMusicAlbum = function (e) {
        services.QQMusic.album_song(e).then(function (t) {
          var n = t.aDate,
            i = t.company,
            o = t.desc,
            l = t.list;
          l &&
            a.setState({
              data: l,
              loaded: true,
              id: e,
              publishTime: n,
              company: i,
              description: o,
              duration: a.getDurationSum(l),
            });
        });
      };
      a.getAlbum = function (e, t) {
        if (e)
          switch (t) {
            case providers.default.netEase:
              var n = e.picUrl + '?param=500y500';
              a.setState({
                title: e.name,
                albumImg: n,
              });
              a.netEaseAlbum(e.id);
              break;
            case providers.default.qqMusic:
              var i = e.albumMID || e.mid || e.albummid,
                o = e.albumName || e.name || e.albumname,
                l = 'http://y.gtimg.cn/music/photo_new/T002R500x500M000' + i + '.jpg';
              a.setState({
                title: o,
                albumImg: l,
              });
              a.qqMusicAlbum(i);
          }
      };
      a.goBack = function () {
        a.props.navigation.goBack();
      };
      a.onDesc = function () {
        a.setState({
          showModal: true,
        });
      };
      a.onPlayAll = function () {
        var e = a.state,
          t = e.api,
          n = e.data,
          i = n[0];
        (0, events.toPlayer)({
          item: i,
          data: n,
          index: 0,
          api: t,
        });
      };
      a.addToPlaylist = function () {
        var e = a.state,
          t = e.api,
          n = e.data;
        (0, events.toInsertToList)({
          data: n,
          api: t,
          type: 'array',
        });
      };
      a.onWebview = function () {
        var e = a.getSharedLink();
        a.props.navigation.navigate('WebViewPage', {
          url: e,
        });
      };
      a.onCopy = function () {
        var e = a.state.title;
        _default.setString(e);
        toast(locales.default.COPIED + ' ' + e);
      };
      a.onOpenUrl = function () {
        var e = a.getSharedLink();
        ReactNative.Linking.openURL(e);
      };
      a.onShare = function () {
        var e = a.getSharedLink();
        ReactNative.Share.share({
          message: e,
        });
      };
      a.getSharedLink = function () {
        var e = a.state,
          t = e.api,
          n = e.id;
        return sharedUrlsModule.sharedUrls[t].album + n;
      };
      a.onLikeAlbumImpl = function () {
        var e = a.state,
          t = e.api,
          n = e.followed,
          i = e.id;
        switch (t) {
          case providers.default.netEase:
            a.setState({
              followed: !n,
            });
            a.netEaseLikeAlbum(i, !n);
        }
        toast(true == !n ? '\u5df2\u6536\u85cf\u3002' : '\u53d6\u6d88\u6536\u85cf\u3002');
      };
      a.onLikeAlbum = function () {
        a.state.followed
          ? ReactNative.Alert.alert(null, '\u53d6\u6d88\u6536\u85cf\uff1f', [
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
                  a.onLikeAlbumImpl();
                },
              },
            ])
          : a.onLikeAlbumImpl();
      };
      a.netEaseIsLikedAlbum = async function () {
        const response = await services.Netease.sublist_album({
          limit: 1000,
        });
        if (response?.code === 200 && Array.isArray(response.data))
          a.setState({
            followed: response.data.some((album) => album.id === a.state.id),
          });
      };
      a.netEaseLikeAlbum = async function (id, like) {
        const response = await services.Netease.sublist_album_add({
          id,
          op: like === true ? 'sub' : 'unsub',
        });
        if (utils.usable(response) && response.code !== 200)
          toast(locales.default.ERROR + ' -> ' + response.code);
      };
      a.onTop = function () {
        var e;
        null === (e = a._list) ||
          void 0 === e ||
          e.scrollTo({
            x: 0,
            y: 0,
          });
      };
      a.formatListItem = function (e) {
        var t = {},
          n = a.state.api;
        if (n === providers.default.netEase) {
          t.song = e.name;
          t.singer = e.artists;
          t.duration = utils.timeFormatter.parseTime(e.duration / 1e3);
          t.alias = (0, utils.delve)(e, 'transNames.0');
          t.showMV = e.mvid || e.mv;
        } else if (n === providers.default.qqMusic) {
          var i;
          t.song = e.songname;
          t.singer = e.singer;
          t.duration = utils.timeFormatter.parseTime(e.interval);
          var o = (null === (i = e.mv) || void 0 === i ? void 0 : i.vid) || e.vid;
          o = 'string' == typeof o && o.length > 0;
          t.showMV = o;
        }
        return t;
      };
      a.onMV = function (e) {
        var t,
          n = a.state.api;
        if (n === providers.default.netEase) t = e.mv || e.mvid;
        else if (n === providers.default.qqMusic) {
          var i;
          t = (null === (i = e.mv) || void 0 === i ? void 0 : i.vid) || e.vid;
        }
        queue.default.playMV(t, n);
      };
      a._renderItem = function (e) {
        var t = e.item,
          n = e.index,
          i = a.state,
          l = i.api,
          u = i.data,
          s = a.formatListItem(t);
        return React.default.createElement(components.SongRow, {
          textStyle: E.songRow,
          curIndex: null,
          index: n,
          song: s.song,
          album: s.duration,
          singer: s.singer,
          onPress: function () {
            return (0, events.toPlayer)({
              item: t,
              data: u,
              index: n,
              api: l,
            });
          },
          addToQueue: function () {
            return (0, events.toInsertToList)({
              data: t,
              api: l,
            });
          },
          detail: function () {
            return (0, events.toDetailModal)({
              item: t,
              index: n,
              api: l,
            });
          },
          alias: s.alias,
          showMV: s.showMV,
          onMV: function () {
            return a.onMV(t);
          },
          songItem: t,
        });
      };
      a.state = {
        albumImg: '',
        api: providers.default.netEase,
        id: null,
        data: [],
        loaded: false,
        followed: null,
        title: '',
        publishTime: null,
        company: null,
        description: null,
        showModal: false,
        showElevation: true,
        duration: 0,
      };
      return a;
    }
    componentDidMount() {
      var e = this.props.route.params;
      if (e) {
        var t = e.item,
          a = e.api;
        a &&
          (this.setState({
            api: a,
          }),
          this.getAlbum(t, a));
      }
    }
    componentWillUnmount() {
      this.setState({
        showElevation: false,
      });
    }
    render() {
      var e = this,
        t = this.state,
        a = t.followed,
        n = t.data,
        i = t.albumImg,
        s = t.publishTime,
        d = t.company,
        f = t.title,
        p = t.loaded,
        h = t.showModal,
        g = t.description,
        w = t.duration;
      return React.default.createElement(
        ReactNative.View,
        {
          style: E.container,
        },
        React.default.createElement(components.Background, null),
        false === p &&
          React.default.createElement(components.Spinkit, {
            style: {
              paddingTop: y,
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            },
          }),
        React.default.createElement(
          components.ParallaxScrollView,
          {
            onNativeContentOffsetExtract: this._nativeOffset,
            onRef: function (t) {
              return (e._list = t);
            },
          },
          React.default.createElement(components.ParallaxForeground, {
            img: i,
            title: f,
            subtitle: [
              n.length +
                ' ' +
                locales.default.SONG_COUNT +
                ' \uff5c ' +
                utils.timeFormatter.parseTime(w),
              '' + s,
            ],
            animOffsetY: this._nativeOffset.y,
            onInfo: this.onDesc,
          }),
          n.map(function (t, a) {
            return React.default.cloneElement(
              e._renderItem({
                item: t,
                index: a,
              }),
              {key: t.id || a},
            );
          }),
          React.default.createElement(components.EmptyFooter, null),
        ),
        !!h &&
          React.default.createElement(Description.default, {
            showModal: h,
            albumImg: i,
            onClose: function () {
              return e.setState({
                showModal: false,
              });
            },
            company: d,
            publishTime: s,
            description: g,
          }),
        React.default.createElement(
          ReactNative.View,
          {
            style: E.hoverArea,
          },
          React.default.createElement(
            ReactNative.View,
            {
              style: E.hoverCon,
            },
            React.default.createElement(
              ReactNative.TouchableOpacity,
              {
                onPress: this.onPlayAll,
              },
              React.default.createElement(
                _default2,
                {
                  style: {
                    color: '#000',
                    padding: 10,
                    fontWeight: 'bold',
                  },
                },
                '\u64ad\u653e\u5168\u90e8',
              ),
            ),
            React.default.createElement(ReactNative.View, {
              style: {
                width: 1,
                height: 18,
                backgroundColor: '#000',
              },
            }),
            React.default.createElement(
              ReactNative.TouchableOpacity,
              {
                style: {
                  padding: 5,
                },
                onPress: this.addToPlaylist,
              },
              React.default.createElement(components.Icon, {
                name: icons.default.PLUS,
                color: '#000',
                style: {
                  fontWeight: 'bold',
                },
              }),
            ),
          ),
        ),
        React.default.createElement(components.HeaderBar, {
          headerStyle: [E.header, utils.animInterpolate.forHeader(this._nativeOffset.y)],
          title: f,
          goBack: this.goBack,
          onTop: this.onTop,
          rightIcon: function () {
            return React.default.createElement(OverflowMenu.default, {
              followed: a,
              onLike: e.onLikeAlbum,
              onWebview: e.onWebview,
              onCopy: e.onCopy,
              onOpenUrl: e.onOpenUrl,
              onShare: e.onShare,
            });
          },
          backIcon: {
            name: icons.default.WINDOW_CLOSE,
          },
          bold: true,
          blur: true,
        }),
      );
    }
  },
  E = ReactNative.StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      position: 'absolute',
      top: 0,
      zIndex: 10,
      paddingRight: 20,
    },
    hoverArea: {
      position: 'absolute',
      bottom: 36,
      alignSelf: 'center',
    },
    hoverCon: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderRadius: 100,
      elevation: 2,
    },
  }),
  S = w;
exports.default = S;
