const _default = require('./../components/Text.js').default;
const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
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
  locales = _interopRequireDefault(require('../locales/index')),
  playlistFiles = _interopRequireDefault(require('../storage/playlistFiles')),
  services = require('../services/index'),
  events = require('../events/index'),
  utils = require('../utils/index'),
  types = _interopRequireWildcard(require('../utils/types')),
  users = _interopRequireDefault(require('../storage/users')),
  CustomPlaylistHeader = _interopRequireDefault(require('./../modules/CustomPlaylistHeader.js')),
  PlaylistChoice = _interopRequireDefault(require('./../modules/PlaylistChoice.js')),
  E = class t extends React.PureComponent {
    constructor() {
      var e, a, l;
      for (var r = arguments.length, i = new Array(r), s = 0; s < r; s++) i[s] = arguments[s];
      return (
        (a = l = super(...i)),
        (l.state = {
          api: '',
          data: [],
          playlist: [],
          locals: [],
          mainModalShow: false,
        }),
        (l.getLocalPlaylist = function () {
          playlistFiles.default.getPlaylist().then(function (e) {
            e.playlists.length > 0 &&
              l.setState({
                locals: e.playlists,
              });
          });
        }),
        (l.playlist = async function (api) {
          const stored = await users.default.getUserPlayList();
          l.setState({
            playlist: stored?.[api] || [],
          });
        }),
        (l.onClosed = function () {
          l.setState({
            api: '',
            mainModalShow: false,
            playlist: [],
            locals: [],
          });
        }),
        (l.onTop = function () {
          var e, t;
          null === (e = (t = l._scrollView).scrollToBegin) || void 0 === e || e.call(t);
        }),
        (l._renderItem = function (e) {
          var t = e.item,
            a = l.formatItem(t);
          return React.default.createElement(CustomPlaylistHeader.default, {
            title: a.title,
            img: a.img,
            onPress: function () {
              return l.onCollect(t);
            },
            trackCount: a.trackCount,
          });
        }),
        (l.formatItem = function (e) {
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
        }),
        (l.qqMusicItem = function (e) {
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
        (l.onLocalCollect = async function (index) {
          try {
            const {api, data, songItem} = l.state;
            const additions = songItem
              ? [
                  {
                    ...songItem,
                    api,
                  },
                ]
              : data?.map((song) => ({
                  ...song,
                  api,
                }));
            if (!additions?.length) return;
            const current = await playlistFiles.default.getPlaylist();
            const playlists = current.playlists.map((playlist, i) =>
              i === index
                ? {
                    ...playlist,
                    tracks: [
                      ...additions,
                      ...playlist.tracks.filter(
                        (song) =>
                          !additions.some((next) => next.id === song.id && next.api === song.api),
                      ),
                    ],
                  }
                : playlist,
            );
            await playlistFiles.default.toPlaylist({
              ...current,
              playlists,
            });
            l.onClosed();
          } catch (error) {
            toast('收藏失败：' + error.message);
          }
        }),
        (l.onCollect = async function (playlist) {
          try {
            const {songItem, api, data} = l.state;
            if (api === providers.default.netEase) {
              await l.collectToNetease(
                playlist.id,
                Array.isArray(data) && data.length ? data.map((song) => song.id) : songItem.id,
              );
            } else if (api === providers.default.qqMusic) {
              const account = (await users.default.getUserInfo())?.qqMusic;
              if (!account?.cookies) throw new Error('请先登录 QQ 音乐');
              const songmid = songItem.songmid || songItem.mid;
              const response =
                playlist.title === '我喜欢'
                  ? await services.QQMusic.like({
                      songmid,
                      qq: account.userId,
                      cookies: account.cookies,
                    })
                  : await services.QQMusic.addToDir({
                      songmid,
                      dirid: playlist.dirid,
                      qq: account.userId,
                      cookies: account.cookies,
                    });
              if (response?.code !== 0 && response?.title !== locales.default.COLLECT_SUCCESS)
                throw new Error(locales.default.COLLECT_FAILED);
            }
            l.onClosed();
          } catch (error) {
            toast('收藏失败：' + error.message);
          }
        }),
        (l.collectToNetease = async function (id, tracks) {
          const response = await services.Netease.playlist_tracks({
            pid: id,
            tracks,
          });
          if (!utils.usable(response)) throw new Error(locales.default.COLLECT_FAILED);
          if (response.code === 301) throw new Error(locales.default.NETEASE_NOT_LOGIN);
          if (response.code === 502) {
            toast(locales.default.COLLECT_DUPLICATE);
            return;
          }
          if (response.code !== 200)
            throw new Error(locales.default.COLLECT_FAILED + ' (' + response.code + ')');
          await users.default.removeNetEasePlaylistCache(id);
        }),
        a
      );
    }
    componentDidMount() {
      var e = this;
      this.sub = events.emitter.addListener(names.default.CollectModal, function (t) {
        var a = t.api,
          l = t.song,
          r = t.data;
        a &&
          (e.setState({
            api: a,
            mainModalShow: true,
          }),
          e.playlist(a),
          e.getLocalPlaylist(),
          l
            ? e.setState({
                songItem: l,
              })
            : r &&
              e.setState({
                data: r,
              }));
      });
    }
    componentWillUnmount() {
      var e, t;
      null === (e = (t = this.sub).remove) || void 0 === e || e.call(t);
    }
    render() {
      var e = this,
        t = this.state,
        a = t.playlist,
        l = t.locals;
      return React.default.createElement(
        ReactNative.Modal,
        {
          animationType: 'fade',
          transparent: true,
          onRequestClose: this.onClosed,
          visible: this.state.mainModalShow,
        },
        React.default.createElement(
          ReactNative.View,
          {
            style: q.container,
          },
          React.default.createElement(components.Background, {
            imageStyle: {
              opacity: 0.5,
            },
          }),
          React.default.createElement(
            ReactNative.TouchableWithoutFeedback,
            {
              onPress: this.onClosed,
            },
            React.default.createElement(ReactNative.View, {
              style: [ReactNative.StyleSheet.absoluteFill],
            }),
          ),
          React.default.createElement(PlaylistChoice.default, {
            onPress: this.onTop,
            content: locales.default.ADD_TO_MIX,
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
              React.default.createElement(
                React.default.Fragment,
                null,
                l.map(function (t, a) {
                  return React.default.createElement(CustomPlaylistHeader.default, {
                    key: a,
                    title: t.title,
                    img: t.img,
                    onPress: function () {
                      return e.onLocalCollect(a);
                    },
                    trackCount: t.tracks.length,
                  });
                }),
              ),
              a.map(function (t, a) {
                return e._renderItem({
                  item: t,
                  index: a,
                });
              }),
              React.default.createElement(ReactNative.View, {
                style: q.footer,
              }),
            ),
          ),
          l.length < 1 &&
            a.length < 1 &&
            React.default.createElement(
              ReactNative.View,
              {
                style: q.null,
              },
              React.default.createElement(
                _default,
                {
                  style: [
                    q.text,
                    {
                      textAlign: 'center',
                      opacity: 0.8,
                    },
                  ],
                },
                '\u7a7a',
                '\n',
                'Null',
              ),
            ),
        ),
      );
    }
  },
  q = ReactNative.StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      alignItems: 'center',
    },
    text: {
      fontSize: 16,
    },
    null: {
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    footer: {
      height: 50,
    },
  }),
  v = E;
exports.default = v;
