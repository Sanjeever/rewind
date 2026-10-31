const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
const _appStorage = require('./../storage/index.js');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  FadingEdge = _interopRequireDefault(require('../components/FadingEdge')),
  reactNativeSpringScrollview = require('./../components/Scrolling.js'),
  components = require('../components/index'),
  providers = _interopRequireDefault(require('../services/providers')),
  names = _interopRequireDefault(require('../events/names')),
  keys = _interopRequireDefault(require('../storage/keys')),
  locales = _interopRequireDefault(require('../locales/index')),
  services = require('../services/index'),
  events = require('../events/index'),
  utils = require('../utils/index'),
  types = _interopRequireWildcard(require('../utils/types')),
  trackInfo = require('../services/trackInfo'),
  users = _interopRequireDefault(require('../storage/users')),
  CustomPlaylistHeader = _interopRequireDefault(require('./../modules/CustomPlaylistHeader.js')),
  PlaylistChoice = _interopRequireDefault(require('./../modules/PlaylistChoice.js')),
  M = class t extends React.PureComponent {
    constructor() {
      var e, l, i;
      for (var a = arguments.length, r = new Array(a), s = 0; s < a; s++) r[s] = arguments[s];
      return (
        (l = i = super(...r)),
        (i.state = {
          playlist: [],
          modalVisible: false,
        }),
        (i.closePickPlaylistModal = function () {
          i.setState({
            modalVisible: false,
            playlist: [],
          });
        }),
        (i.songName = function (e) {
          var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 'big';
          return e ? (0, trackInfo.extractFullInfo)(e, t) : null;
        }),
        (i.getPlaylist = async function () {
          const stored = await users.default.getUserPlayList();
          const playlist = [];
          for (const api of [providers.default.netEase, providers.default.qqMusic])
            for (const item of stored?.[api] || [])
              playlist.push({
                ...item,
                api,
              });
          i.setState({
            playlist,
          });
        }),
        (i.onTop = function () {
          var e, t;
          null === (e = (t = i._scrollView).scrollToBegin) || void 0 === e || e.call(t);
        }),
        (i._renderIndexPath = function (e) {
          var t = e.row,
            l = i.state.playlist;
          return i._renderItem({
            item: l[t],
            index: t,
          });
        }),
        (i.formatItem = function (e) {
          var t = {};
          if (e.api === providers.default.netEase) {
            t.title = e.name;
            t.img = e.coverImgUrl + '?param=200y200';
            t.trackCount = e.trackCount;
          } else if (e.api === providers.default.qqMusic) {
            var l = i.qqMusicItem(e);
            t.title = l.title;
            t.img = l.picurl;
            t.trackCount = l.num;
          }
          return t;
        }),
        (i.qqMusicItem = function (e) {
          var t = {};
          e.title
            ? ((t.title = e.title),
              (t.picurl =
                '' !== e.picurl
                  ? e.picurl
                  : 'http://s4.music.126.net/style/web2/img/default/default_album.jpg'),
              (t.num = '' !== e.subtitle ? e.subtitle.replace(/\u9996.+/, '') : null),
              (t.id = e.id || e.dissid),
              (t.dirid = e.dirid))
            : ((t.title = e.dissname),
              (t.num = e.songnum),
              (t.picurl = e.logo),
              (t.id = e.dissid),
              (t.dirid = e.dirid));
          return t;
        }),
        (i._renderItem = function (e) {
          var t = e.item,
            l = i.formatItem(t);
          return React.default.createElement(CustomPlaylistHeader.default, {
            title: l.title,
            img: l.img,
            onPress: function () {
              return i.onChangePlaylist(t);
            },
            trackCount: l.trackCount,
          });
        }),
        (i.onChangePlaylist = function (e) {
          switch (e.api) {
            case providers.default.netEase:
              var t = e.id;
              i.getNeteasePlayListDetail(t);
              break;
            case providers.default.qqMusic:
              var l = e.id || e.dissid;
              i.getQQMusicPlayListDetail(l);
          }
        }),
        (i.getQQMusicPlayListDetail = function (e) {
          _appStorage.storage
            .load({
              key: keys.default.userInfo,
            })
            .then(function (t) {
              if (t) {
                var l = t.qqMusic.userId;
                services.QQMusic.disslist({
                  id: e,
                  qq: l,
                }).then(function (e) {
                  var t = e[0].songlist;
                  i.qqMusicPlaylistPlay(t);
                });
              }
            })
            .catch(function () {
              services.QQMusic.disslist({
                id: e,
              }).then(function (e) {
                if (e) {
                  var t = e[0].songlist;
                  i.qqMusicPlaylistPlay(t);
                }
              });
            });
        }),
        (i.qqMusicPlaylistPlay = function (e) {
          i.emit({
            data: e,
            api: providers.default.qqMusic,
          });
        }),
        (i.getNeteasePlayListDetail = async function (id) {
          const response = await services.Netease.playlist_detail(id);
          if (response?.playlist)
            i.emit({
              data: response.playlist.tracks,
              api: providers.default.netEase,
            });
        }),
        (i.emit = function (e) {
          var t = e.api,
            l = e.data,
            a = utils.random.getInt(1, l.length);
          (0, events.toPlayer)({
            item: l[a],
            data: l,
            index: a,
            api: t,
            type: names.default.ChangePlaylist,
          });
          i.closePickPlaylistModal();
          events.emitter.emit(names.default.NowPlayingModal, {
            forceClose: true,
          });
        }),
        l
      );
    }
    componentDidMount() {
      var e = this;
      this.sub = events.emitter.addListener(names.default.ChangePlaylist, function () {
        e.setState({
          modalVisible: true,
        });
        e.getPlaylist();
      });
    }
    componentWillUnmount() {
      var e, t;
      null === (e = (t = this.sub).remove) || void 0 === e || e.call(t);
    }
    render() {
      var e = this,
        t = this.props.songItem,
        l = this.state,
        i = l.playlist,
        a = l.modalVisible,
        c = this.songName(t, 'small');
      return React.default.createElement(
        ReactNative.Modal,
        {
          animationType: 'fade',
          onRequestClose: this.closePickPlaylistModal,
          visible: a,
        },
        React.default.createElement(
          ReactNative.View,
          {
            style: {
              flex: 1,
              alignItems: 'center',
            },
          },
          React.default.createElement(components.Background, {
            coverUrl: null === c || void 0 === c ? void 0 : c.img,
            blur: true,
          }),
          React.default.createElement(
            ReactNative.TouchableWithoutFeedback,
            {
              onPress: this.closePickPlaylistModal,
            },
            React.default.createElement(ReactNative.View, {
              style: ReactNative.StyleSheet.absoluteFill,
            }),
          ),
          React.default.createElement(PlaylistChoice.default, {
            onPress: this.onTop,
            content: locales.default.TOGGLE_MIX,
          }),
          React.default.createElement(
            FadingEdge.default,
            {
              top: 30,
            },
            React.default.createElement(
              reactNativeSpringScrollview.SpringScrollView,
              {
                ref: function (t) {
                  return (e._scrollView = t);
                },
              },
              (null === i || void 0 === i ? void 0 : i.length) > 0
                ? i.map(function (t, l) {
                    return e._renderItem({
                      item: t,
                      index: l,
                    });
                  })
                : React.default.createElement(components.Spinkit, null),
              React.default.createElement(components.EmptyFooter, null),
            ),
          ),
        ),
      );
    }
  };
exports.default = M;
