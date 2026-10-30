Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var immer = require("immer"),
  React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeLargelist = require("react-native-largelist"),
  components = require("../components/index"),
  modals = require("../modals/index"),
  constants = require("../theme/constants"),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  events = require("../events/index"),
  utils = require("../utils/index"),
  trackInfo = require("../services/trackInfo"),
  playlistFiles = babelHelpers.interopRequireDefault(require("../storage/playlistFiles")),
  g = constants.DEVICE_WIDTH,
  v = function (e) {
    function t(e) {
      var a;
      babelHelpers.classCallCheck(this, t);
      (a = babelHelpers.possibleConstructorReturn(this, babelHelpers.getPrototypeOf(t).call(this, e)))._nativeOffset = {
        x: new ReactNative.Animated.Value(0),
        y: new ReactNative.Animated.Value(0)
      };
      a.onDeleteCustom = function (e) {
        var t = a.state.oriList.filter(function (t) {
          return -1 === e.indexOf(t.id);
        });
        t && (a.setState({
          playlist: t,
          oriList: t
        }), a.updatePlaylist(t));
      };
      a.updatePlaylist = function (e) {
        var t, n, l, r;
        return regeneratorRuntime.async(function (s) {
          for (;;) switch (s.prev = s.next) {
            case 0:
              n = a.state.playlistIndex;
              s.next = 3;
              return regeneratorRuntime.awrap(playlistFiles.default.getPlaylist());
            case 3:
              l = s.sent;
              (null === (t = l.playlists) || void 0 === t ? void 0 : t.length) > 0 && (r = (0, immer.produce)(l.playlists, function (t) {
                t[n].tracks = e;
              }), playlistFiles.default.toPlaylist({
                playlists: r
              }));
            case 5:
            case "end":
              return s.stop();
          }
        }, null, this);
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
      a.deleteItem = function (e) {
        var t = a.state.playlistIndex,
          n = a.state.playlist.filter(function (t, a) {
            return a !== e;
          });
        a.setState({
          playlist: n,
          oriList: n
        });
        playlistFiles.default.getPlaylist().then(function (e) {
          var a = e.playlists;
          a && (a[t].tracks = n, playlistFiles.default.toPlaylist({
            playlists: a
          }));
        });
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
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        var e = this.props.navigation.state.params,
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
    }, {
      key: "render",
      value: function () {
        var e = this,
          t = this.props.navigation.state.params.playlist.img;
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
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent),
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
