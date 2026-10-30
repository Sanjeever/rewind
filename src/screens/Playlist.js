const _default = require("@react-native-clipboard/clipboard").default;
const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _toConsumableArray = require("@babel/runtime/helpers/toConsumableArray");
const _appStorage = require("./../storage/index.js");
const _assertThisInitialized = require("@babel/runtime/helpers/assertThisInitialized");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeLargelist = require("./../components/Scrolling.js"),
  components = require("../components/index"),
  modals = require("../modals/index"),
  PlaylistTabs = _interopRequireDefault(require("../components/PlaylistTabs")),
  providers = _interopRequireDefault(require("../services/providers")),
  constants = require("../theme/constants"),
  names = _interopRequireDefault(require("../events/names")),
  keys = _interopRequireDefault(require("../storage/keys")),
  locales = _interopRequireDefault(require("../locales/index")),
  events = require("../events/index"),
  utils = require("../utils/index"),
  mediaStore = _interopRequireDefault(require("../native/mediaStore")),
  lastSong = _interopRequireDefault(require("../storage/lastSong")),
  sortModes = require("./playlist/sortModes"),
  actions = _interopRequireDefault(require("./playlist/actions")),
  T = class t extends React.PureComponent {
    constructor() {
      var e, a, r;
      for (var n = arguments.length, l = new Array(n), u = 0; u < n; u++) l[u] = arguments[u];
      return a = r = super(...l), r._nativeOffset = {
        x: new ReactNative.Animated.Value(0),
        y: new ReactNative.Animated.Value(0)
      }, r.state = {
        title: '',
        playlist: [],
        playlistId: null,
        oriList: [],
        loading: true,
        searching: false,
        index: null,
        showList: true,
        showMult: false,
        showRestore: false,
        subscribed: true,
        userId: 0,
        searchText: '',
        api: '',
        trackCount: 0,
        orderText: '',
        heartMode: true,
        sortMode: 'time',
        lastPlayedSong: null,
        playingIndex: -1,
        isCreatedByMe: true,
        isTopList: false
      }, r.loadLastPlayedSong = async function (api, tracks) {
        const song = await lastSong.default.get(api);
        if (song && tracks.some(item => item.id === song.id)) r.setState({
          lastPlayedSong: song
        });
      }, r.collectPlaylistOrder = function () {
        var e = r.state,
          t = e.playlistIndex,
          a = e.api;
        t && events.emitter.emit(names.default.PlaylistSetOrder, {
          index: t,
          api: a
        });
      }, r.switchPlaylist = function (e) {
        var t,
          a,
          n,
          s,
          i,
          l,
          o = e.api,
          u = e.index,
          d = e.subscribed,
          p = e.playlist;
        switch (o === providers.default.netEase ? (a = p.trackCount, n = p.coverImgUrl || p.picUrl, s = p.name, i = p.id, l = p.creator) : o === providers.default.qqMusic && (n = p.picurl || p.imgurl, s = p.title || p.dissname, a = r.state.trackCount, i = p.dissid || p.id), r.setState({
          api: o,
          playlistIndex: u,
          subscribed: d || false,
          isTopList: r.getIsTopList(e.playlist),
          coverImgUrl: n,
          name: s,
          trackCount: a,
          id: i,
          creator: l
        }), o) {
          case providers.default.netEase:
            r.netEaseStorageList(null === (t = e.playlist) || void 0 === t ? void 0 : t.id);
            r.switchNetease(e);
            break;
          case providers.default.qqMusic:
            r.switchQQMusic(e);
        }
      }, r.switchNetease = async function ({
        playlist,
        userId
      }) {
        if (!playlist.id) return;
        try {
          const data = await actions.default.getFromNetease(playlist.id);
          if (!data) return;
          r.setData(data);
          r.setState({
            userId,
            isCreatedByMe: r.getIsCreatedByMe(userId, playlist)
          });
          await r.loadMoreThanThousands(data.moreFunc);
        } catch (error) {
          toast(error.message);
        }
      }, r.loadMoreThanThousands = async function (more) {
        if (!more) return;
        const response = await more();
        if (response?.songs?.length) r.setState(previous => {
          const tracks = [...previous.oriList, ...response.songs];
          return {
            oriList: tracks,
            playlist: tracks
          };
        });
      }, r.getIsTopList = function (e) {
        if (!e) return false;
        var t = e.name,
          a = e.title,
          r = e.dissname;
        return (t || a || r).includes('\u699c');
      }, r.getIsCreatedByMe = function (e, t) {
        return !!e && e === t.creator.userId;
      }, r.switchQQMusic = async function ({
        playlist
      }) {
        const id = playlist.id || playlist.dissid;
        if (!id) return;
        try {
          const data = await actions.default.getFromQQMusic(id);
          if (data) {
            r.setData(data);
            r.setState({
              isCreatedByMe: false
            });
          }
        } catch (error) {
          toast(error.message);
        }
      }, r.setData = function (e) {
        var t = e.name,
          a = e.id,
          n = e.tracks,
          s = e.trackCount,
          i = void 0 === s ? 0 : s;
        r.setState({
          playlist: n,
          oriList: n,
          name: t,
          loading: false,
          playlistId: a,
          sortMode: 'time',
          trackCount: i
        }, function () {
          var e, t;
          null === (e = (t = r._list).endRefresh) || void 0 === e || e.call(t);
          r.attachLocalPath(n);
          r.loadLastPlayedSong(a, n);
        });
      }, r.netEaseStorageList = function (e) {
        e && _appStorage.storage.load({
          key: keys.default.netEasePlaylistCache
        }).then(function (t) {
          var a = t.find(function (t) {
              return t.id === e;
            }),
            n = a.tracks,
            s = a.name;
          n.length > 0 && r.setData({
            id: e,
            name: s,
            tracks: n
          });
        });
      }, r.attachLocalPath = function (e) {
        e.length < 1 || mediaStore.default.attachLocalPath(e).then(function (e) {
          r.setState({
            playlist: e,
            oriList: e
          });
        });
      }, r.searchSong = function (e) {
        var t,
          a = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1],
          n = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2],
          s = r.state,
          i = s.playlist,
          l = s.oriList,
          o = s.searchText;
        i ? (t = e.match(':0') || e.length < 1 ? utils.filterHelper.search(_toConsumableArray(l), e) : utils.filterHelper.search(i, e), r.setState({
          playlist: t,
          searching: '' !== e,
          showRestore: a && '' !== e,
          searchText: n ? e : o,
          orderText: '' === e ? '' : r.state.orderText
        }), r.syncPlayingIndex(i, t)) : r.setState({
          searchText: null
        });
      }, r.syncPlayingIndex = function (e, t) {
        var a = r.state.playingIndex;
        if (-1 !== a) {
          var n = e[a],
            s = t.findIndex(function (e) {
              return e.id === n.id;
            });
          r.setState({
            playingIndex: s
          });
        }
      }, r.onRestore = function () {
        var e = r.state.oriList;
        r.setState({
          playlist: e,
          showRestore: false,
          searchText: '',
          orderText: '',
          playingIndex: -1
        });
      }, r.onRefresh = function () {
        var e = r.props.route.params;
        e && r.switchPlaylist(e, true);
      }, r.onSort = function () {
        var e,
          t = r.state.sortMode,
          a = sortModes.sortModeMap[t];
        switch (a) {
          case 'time':
            e = '';
            r.searchSong(r.state.searchText + ":0", false, false);
            break;
          case 'song':
            e = sortModes.orderTexts.song;
            r.searchSong(utils.filterHelper.searchTypesMap.bySong, false, false);
            break;
          case 'singer':
            e = sortModes.orderTexts.singer;
            r.searchSong(utils.filterHelper.searchTypesMap.byArtist, false, false);
            break;
          case 'album':
            e = sortModes.orderTexts.album;
            r.searchSong(utils.filterHelper.searchTypesMap.byAlbum, false, false);
            break;
          case 'random':
            e = sortModes.orderTexts.random;
            r.searchSong(utils.filterHelper.searchTypesMap.byRandom, false, false);
        }
        r.setState({
          orderText: e,
          sortMode: a
        });
      }, r.onSortText = function () {
        var e = r.state,
          t = e.orderText,
          a = e.playlist;
        switch (t) {
          case sortModes.orderTexts.song:
          case sortModes.orderTexts.singer:
          case sortModes.orderTexts.album:
            r.setState({
              playlist: _toConsumableArray(a).reverse()
            });
            break;
          case sortModes.orderTexts.random:
            r.searchSong(':4', false, false);
        }
      }, r.onUser = function () {
        var e = r.state,
          t = e.api,
          a = e.creator;
        if (t === providers.default.netEase) {
          var n = a.userId;
          n && r.props.navigation.navigate('UserInfo', {
            userId: n
          });
        }
      }, r._renderIndexPath = function (e) {
        var t = e.row;
        return r._renderItem({
          item: r.state.playlist[t],
          index: t
        });
      }, r.onSubscribe = async function (e) {
        var t = r.state,
          a = t.api,
          n = t.subscribed,
          s = n ? 'unsubscribe' : 'subscribe';
        try {
          await actions.default.onSubscribe(e, s, a);
          r.setState({
            subscribed: !n
          });
        } catch (error) {
          toast(error.message);
        }
      }, r.onScroll = function (e) {
        var t = e.nativeEvent.contentOffset.y,
          a = sortModes.FOREGROUND_HEIGHT - 100;
        t < a ? r.setState({
          title: ''
        }) : t > a && r.setState({
          title: r.state.name
        });
      }, r.onLastPlay = function () {
        var e = r.state,
          t = e.lastPlayedSong,
          a = e.playlist;
        if (!((null === a || void 0 === a ? void 0 : a.length) <= 0)) if (t) {
          var n,
            s = a.findIndex(function (e) {
              return e.id === t.id;
            });
          if (s >= 0) {
            actions.default.playMusic(t, s, _assertThisInitialized(_assertThisInitialized(r)));
            null === (n = r._list) || void 0 === n || n.scrollTo({
              x: 0,
              y: (s + 1) * constants.ITEM_HEIGHT
            });
          }
          r.setState({
            lastPlayedSong: null
          });
        } else actions.default.playMusic(a[0], 0, _assertThisInitialized(_assertThisInitialized(r)));
      }, r._renderItem = function (e) {
        var t = e.item,
          a = e.index,
          n = r.state,
          i = n.api,
          l = n.playingIndex,
          u = n.isTopList,
          d = actions.default.formatItemData(t, i);
        return React.default.createElement(components.SongRow, {
          lastRank: t.lastRank,
          showRank: u,
          songItem: t,
          index: a,
          song: d.song,
          album: d.album,
          singer: d.artist,
          alias: d.alias,
          onPress: function () {
            return actions.default.playMusic(t, a, _assertThisInitialized(_assertThisInitialized(r)));
          },
          detail: function () {
            return actions.default.onDetail(t, a, _assertThisInitialized(_assertThisInitialized(r)));
          },
          addToQueue: function () {
            return actions.default.addToQueue(t, i);
          },
          isExist: t.localPath,
          onMV: function () {
            return actions.default.onMV(t, i);
          },
          showMV: d.showMV,
          playing: a === l
        });
      }, r.onTop = function () {
        var e;
        null === (e = r._list) || void 0 === e || e.scrollTo({
          x: 0,
          y: 0
        });
      }, r.goBack = function () {
        r.props.navigation.goBack();
      }, r.onInsertLastPlayed = function () {
        var e = r.state,
          t = e.lastPlayedSong,
          a = e.api;
        t && actions.default.addToQueue(t, a);
      }, r.getPlaylistUrl = function () {
        var e,
          t = r.state,
          a = t.api,
          n = t.playlistId;
        switch (a) {
          case providers.default.netEase:
            e = "https://music.163.com/#/playlist?id=" + n;
            break;
          case providers.default.qqMusic:
            e = "https://y.qq.com/n/yqq/playlist/" + n + ".html";
        }
        return e;
      }, r.onWebview = function () {
        var e = r.getPlaylistUrl();
        r.props.navigation.navigate('WebViewPage', {
          url: e
        });
      }, r.onCopy = function () {
        var e = r.getPlaylistUrl();
        _default.setString(e);
        toast(locales.default.COPIED + " " + e);
      }, r.onOpenUrl = function () {
        var e = r.getPlaylistUrl();
        ReactNative.Linking.openURL(e);
      }, r.onShare = function () {
        var e = r.getPlaylistUrl();
        ReactNative.Share.share({
          message: e
        });
      }, a;
    }
    "componentDidMount"() {
      var e = this,
        t = this.props.route.params;
      this.switchPlaylist(t);
      this.deleteSub = events.emitter.addListener(names.default.DeleteFromPlaylist, async function (a = {}) {
        var r = a.api,
          n = a.trackid,
          s = e.state.playlistId;
        if (r) {
          var i;
          if (r === providers.default.netEase) {
            try {
              await actions.default.deleteFromNetease({
                playlistId: s,
                trackid: n
              });
            } catch (error) {
              toast(error.message);
              return;
            }
            i = e.state.playlist.filter(function (e) {
              return e.id !== n;
            });
          } else if (r === providers.default.qqMusic) {
            var l = t.playlist;
            try {
              await actions.default.deleteFromQQMusic(n, l.dirid);
            } catch (error) {
              toast(error.message);
              return;
            }
            i = e.state.playlist.filter(function (e) {
              return e.songid !== n;
            });
          }
          e.setState({
            playlist: i
          });
          toast(locales.default.DELETE_SUCCESS);
        } else e.onRefresh();
      });
      this.playerSub = events.emitter.addListener(names.default.Player, function (t) {
        var a = t.song,
          r = t.api;
        if ('clearPlayingList' !== t.type) {
          var n = e.state.playlist;
          if (a && r === providers.default.netEase) {
            var s = n.findIndex(function (e) {
              return e.id === a.id;
            });
            s >= 0 && e.setState({
              playingIndex: s
            });
          }
        } else e.setState({
          playingIndex: -1
        });
      });
    }
    "componentWillUnmount"() {
      this.deleteSub.remove();
      this.playerSub.remove();
    }
    "render"() {
      var e = this,
        t = this.state,
        a = t.api,
        r = t.coverImgUrl,
        n = t.name,
        c = t.trackCount,
        f = t.id,
        h = t.creator;
      return React.default.createElement(ReactNative.View, {
        style: I.container
      }, React.default.createElement(components.Background, null), React.default.createElement(reactNativeLargelist.LargeList, {
        ref: function (t) {
          return e._list = t;
        },
        data: [{
          items: this.state.playlist
        }],
        heightForIndexPath: function () {
          return constants.ITEM_HEIGHT;
        },
        renderIndexPath: this._renderIndexPath,
        onScroll: this.onScroll,
        onRefresh: this.onRefresh,
        refreshHeader: PlaylistTabs.default,
        renderEmpty: function () {
          return React.default.createElement(components.Spinkit, null);
        },
        onNativeContentOffsetExtract: this._nativeOffset,
        renderHeader: function () {
          return React.default.createElement(ReactNative.View, null, React.default.createElement(components.PlaylistForeground, {
            coverImgUrl: r + '?param=800y800',
            name: n,
            api: a,
            trackCount: c,
            onRestore: e.onRestore,
            showRestore: e.state.showRestore,
            subscribed: e.state.subscribed,
            onSubscribe: function () {
              return e.onSubscribe(f);
            },
            savePic: function () {
              return actions.default.savePic(r, e.state.name);
            },
            onSort: e.onSort,
            orderText: e.state.orderText,
            onSortText: function () {
              return e.onSortText(e.state.sortMode);
            },
            onHeartMode: function () {
              return actions.default.onHeartMode(e);
            },
            heartMode: e.state.heartMode,
            onMult: function () {
              return e.setState({
                showMult: true
              });
            },
            lastPlayedSong: e.state.lastPlayedSong,
            onPlay: e.onLastPlay,
            onInsert: e.onInsertLastPlayed,
            isCreatedByMe: e.state.isCreatedByMe,
            onWebview: e.onWebview,
            creator: h,
            onUser: e.onUser,
            onCopy: e.onCopy,
            onOpenUrl: e.onOpenUrl,
            onShare: e.onShare
          }));
        }
      }), React.default.createElement(components.HeaderBar, {
        opacity: this._nativeOffset.y.interpolate({
          inputRange: [0, sortModes.FOREGROUND_HEIGHT - 100],
          outputRange: [0, 1],
          extrapolate: 'clamp'
        }),
        headerStyle: I.header,
        title: this.state.title,
        goBack: this.goBack,
        onTop: this.onTop,
        textInput: !this.state.loading,
        onChangeText: function (t) {
          return e.searchSong(t);
        },
        searchText: this.state.searchText,
        blur: true,
        bold: true
      }), React.default.createElement(modals.MultiplySelectModal, {
        visible: this.state.showMult,
        onClose: function () {
          return e.setState({
            showMult: false
          });
        },
        data: this.state.playlist,
        api: this.state.api,
        playlistId: this.state.playlistId
      }));
    }
  },
  I = ReactNative.StyleSheet.create({
    container: {
      flex: 1
    },
    header: {
      position: 'absolute',
      top: 0
    }
  }),
  M = T;
exports.default = M;
