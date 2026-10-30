const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var immer = require("immer"),
  React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeLargelist = require("./../components/Scrolling.js"),
  components = require("../components/index"),
  modals = require("../modals/index"),
  constants = require("../theme/constants"),
  locales = _interopRequireDefault(require("../locales/index")),
  events = require("../events/index"),
  utils = require("../utils/index"),
  trackInfo = require("../services/trackInfo"),
  playlistFiles = _interopRequireDefault(require("../storage/playlistFiles")),
  g = constants.DEVICE_WIDTH,
  v = class t extends React.PureComponent {
    constructor(e) {
      var a;
      (a = super(e))._nativeOffset = {
        x: new ReactNative.Animated.Value(0),
        y: new ReactNative.Animated.Value(0)
      };
      a.onDeleteCustom = async function (ids) {
        const tracks = a.state.oriList.filter(song => !ids.includes(song.id));
        await a.updatePlaylist(tracks);
        a.setState({
          playlist: tracks,
          oriList: tracks
        });
      };
      a.updatePlaylist = async function (tracks) {
        const current = await playlistFiles.default.getPlaylist();
        const playlists = immer.produce(current.playlists, draft => {
          draft[a.state.playlistIndex].tracks = tracks;
        });
        await playlistFiles.default.toPlaylist({
          ...current,
          playlists
        });
      };
      a._renderIndexPath = function (e) {
        var t = e.row,
          n = a.state.playlist;
        return a._renderItem({
          item: n[t],
          index: t
        });
      };
      a._renderItem = function (e) {
        var t = e.item,
          n = e.index,
          l = (0, trackInfo.extractFullInfo)(t);
        return React.default.createElement(components.SongRow, {
          index: n,
          song: l.song,
          singer: l.singer,
          album: l.album,
          onLongPress: function () {
            return a.alertDeleteItem(n);
          },
          onPress: function () {
            return a.playMusic(t, n, t.api);
          },
          detail: function () {
            return (0, events.toDetailModal)({
              item: t,
              index: n,
              api: t.api
            });
          },
          addToQueue: function () {
            return (0, events.toInsertToList)({
              data: t,
              api: t.api
            });
          }
        });
      };
      a.alertDeleteItem = function (e) {
        ReactNative.Alert.alert(locales.default.DELETE_THIS_SONG, locales.default.CAN_NOT_RECOVER, [{
          text: locales.default.CANCEL,
          onPress: function () {
            return null;
          },
          style: 'cancel'
        }, {
          text: locales.default.CONFIRM,
          onPress: function () {
            return a.deleteItem(e);
          }
        }]);
      };
      a.deleteItem = async function (index) {
        const tracks = a.state.playlist.filter((song, i) => i !== index);
        try {
          await a.updatePlaylist(tracks);
          a.setState({
            playlist: tracks,
            oriList: tracks
          });
        } catch (error) {
          toast('保存歌单失败：' + error.message);
        }
      };
      a.searchSong = function (e) {
        var t = a.state.oriList;
        if (t) {
          var n = utils.filterHelper.quickSearch(t, e);
          a.setState({
            playlist: n,
            searching: '' !== e,
            index: null,
            showRestore: '' !== e
          });
        }
      };
      a.onTop = function () {
        var e;
        null === (e = a._list) || void 0 === e || e.scrollTo({
          x: 0,
          y: 0
        });
      };
      a.onScroll = function (e) {
        var t = e.nativeEvent.contentOffset.y,
          n = g - 100;
        t < n ? a.setState({
          showHeader: false,
          title: locales.default.MIX
        }) : t > n && a.setState({
          showHeader: true,
          title: a.state.name
        });
      };
      a.playMusic = function (e, t, n) {
        var l = a.state,
          i = l.searching,
          r = l.playlist,
          s = t;
        true === i && r.filter(function (t, a) {
          t.id === e.id && (s = a);
        });
        a.setState({
          index: s
        });
        (0, events.toPlayer)({
          item: e,
          data: r,
          index: s,
          api: n
        });
      };
      a.goBack = function () {
        a.props.navigation.goBack();
      };
      a.state = {
        title: locales.default.MIX,
        playlistIndex: null,
        playlist: [],
        oriList: [],
        loading: true,
        searching: false,
        showList: true,
        showModal: false,
        showRestore: false,
        showHeader: false,
        subscribed: false,
        showMult: false
      };
      return a;
    }
    "componentDidMount"() {
      var e = this.props.route.params,
        t = e.playlist,
        a = e.index,
        n = t.tracks;
      this.setState({
        playlistIndex: a,
        playlist: n,
        oriList: n,
        name: t.title,
        loading: false
      });
    }
    "render"() {
      var e = this,
        t = this.props.route.params.playlist.img;
      return React.default.createElement(ReactNative.View, {
        style: x.container
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
        renderHeader: function () {
          return React.default.createElement(ReactNative.View, null, React.default.createElement(components.PlaylistForeground, {
            coverImgUrl: t,
            onMult: function () {
              return e.setState({
                showMult: true
              });
            },
            disabledLastPlayedSong: true
          }));
        },
        onScroll: this.onScroll,
        onNativeContentOffsetExtract: this._nativeOffset
      }), React.default.createElement(components.HeaderBar, {
        headerStyle: x.header,
        title: this.state.title,
        goBack: this.goBack,
        onTop: this.onTop,
        textInput: !this.state.loading,
        onChangeText: function (t) {
          return e.searchSong(t);
        },
        opacity: this._nativeOffset.y.interpolate({
          inputRange: [0, g - 100],
          outputRange: [0, 1],
          extrapolate: 'clamp'
        }),
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
        api: 'local',
        isCustom: true,
        onDeleteCustom: this.onDeleteCustom
      }));
    }
  },
  x = ReactNative.StyleSheet.create({
    container: {
      flex: 1
    },
    header: {
      position: 'absolute',
      top: 0
    }
  }),
  b = v;
exports.default = b;
