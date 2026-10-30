Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  FadingEdge = babelHelpers.interopRequireDefault(require("../components/FadingEdge")),
  reactNativeSpringScrollview = require("react-native-spring-scrollview"),
  components = require("../components/index"),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  names = babelHelpers.interopRequireDefault(require("../events/names")),
  keys = babelHelpers.interopRequireDefault(require("../storage/keys")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  services = require("../services/index"),
  events = require("../events/index"),
  utils = require("../utils/index"),
  types = babelHelpers.interopRequireWildcard(require("../utils/types")),
  trackInfo = require("../services/trackInfo"),
  users = babelHelpers.interopRequireDefault(require("../storage/users")),
  module714 = babelHelpers.interopRequireDefault(require("../modules/module-714")),
  module715 = babelHelpers.interopRequireDefault(require("../modules/module-715")),
  M = function (e) {
    function t() {
      var e, l, i;
      babelHelpers.classCallCheck(this, t);
      for (var a = arguments.length, r = new Array(a), s = 0; s < a; s++) r[s] = arguments[s];
      return babelHelpers.possibleConstructorReturn(i, (l = i = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(r))), i.state = {
        playlist: [],
        modalVisible: false
      }, i.closePickPlaylistModal = function () {
        i.setState({
          modalVisible: false,
          playlist: []
        });
      }, i.songName = function (e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 'big';
        return e ? (0, trackInfo.extractFullInfo)(e, t) : null;
      }, i.getPlaylist = function () {
        var e, t, l;
        return regeneratorRuntime.async(function (a) {
          for (;;) switch (a.prev = a.next) {
            case 0:
              a.next = 2;
              return regeneratorRuntime.awrap(users.default.getUserPlayList());
            case 2:
              if (e = a.sent, types.isObject(e)) {
                a.next = 5;
                break;
              }
              return a.abrupt("return");
            case 5:
              t = e.netEase;
              l = [];
              types.isObject(t) && t.forEach(function (e) {
                e.api = providers.default.netEase;
                l.push(e);
              });
              types.isObject(e.qqMusic) && e.qqMusic.forEach(function (e) {
                e.api = providers.default.qqMusic;
                l.push(e);
              });
              l.length > 0 && i.setState({
                playlist: l
              });
            case 10:
            case "end":
              return a.stop();
          }
        }, null, this);
      }, i.onTop = function () {
        var e, t;
        null === (e = (t = i._scrollView).scrollToBegin) || void 0 === e || e.call(t);
      }, i._renderIndexPath = function (e) {
        var t = e.row,
          l = i.state.playlist;
        return i._renderItem({
          item: l[t],
          index: t
        });
      }, i.formatItem = function (e) {
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
      }, i.qqMusicItem = function (e) {
        var t = {};
        e.title ? (t.title = e.title, t.picurl = '' !== e.picurl ? e.picurl : 'http://s4.music.126.net/style/web2/img/default/default_album.jpg', t.num = '' !== e.subtitle ? e.subtitle.replace(/\u9996.+/, '') : null, t.id = e.id || e.dissid, t.dirid = e.dirid) : (t.title = e.dissname, t.num = e.songnum, t.picurl = e.logo, t.id = e.dissid, t.dirid = e.dirid);
        return t;
      }, i._renderItem = function (e) {
        var t = e.item,
          l = i.formatItem(t);
        return React.default.createElement(module714.default, {
          title: l.title,
          img: l.img,
          onPress: function () {
            return i.onChangePlaylist(t);
          },
          trackCount: l.trackCount
        });
      }, i.onChangePlaylist = function (e) {
        switch (e.api) {
          case providers.default.netEase:
            var t = e.id;
            i.getNeteasePlayListDetail(t);
            break;
          case providers.default.qqMusic:
            var l = e.id || e.dissid;
            i.getQQMusicPlayListDetail(l);
        }
      }, i.getQQMusicPlayListDetail = function (e) {
        storage.load({
          key: keys.default.userInfo
        }).then(function (t) {
          if (t) {
            var l = t.qqMusic.userId;
            services.QQMusic.disslist({
              id: e,
              qq: l
            }).then(function (e) {
              var t = e[0].songlist;
              i.qqMusicPlaylistPlay(t);
            });
          }
        }).catch(function () {
          services.QQMusic.disslist({
            id: e
          }).then(function (e) {
            if (e) {
              var t = e[0].songlist;
              i.qqMusicPlaylistPlay(t);
            }
          });
        });
      }, i.qqMusicPlaylistPlay = function (e) {
        i.emit({
          data: e,
          api: providers.default.qqMusic
        });
      }, i.getNeteasePlayListDetail = function (e) {
        var t, l;
        return regeneratorRuntime.async(function (a) {
          for (;;) switch (a.prev = a.next) {
            case 0:
              a.next = 2;
              return regeneratorRuntime.awrap(services.Netease.playlist_detail(e));
            case 2:
              (t = a.sent) && (l = t.playlist.tracks, i.emit({
                data: l,
                api: providers.default.netEase
              }));
            case 4:
            case "end":
              return a.stop();
          }
        }, null, this);
      }, i.emit = function (e) {
        var t = e.api,
          l = e.data,
          a = utils.random.getInt(1, l.length);
        (0, events.toPlayer)({
          item: l[a],
          data: l,
          index: a,
          api: t,
          type: names.default.ChangePlaylist
        });
        i.closePickPlaylistModal();
        events.emitter.emit(names.default.NowPlayingModal, {
          forceClose: true
        });
      }, l));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        var e = this;
        this.sub = events.emitter.addListener(names.default.ChangePlaylist, function () {
          e.setState({
            modalVisible: true
          });
          e.getPlaylist();
        });
      }
    }, {
      key: "componentWillUnmount",
      value: function () {
        var e, t;
        null === (e = (t = this.sub).remove) || void 0 === e || e.call(t);
      }
    }, {
      key: "render",
      value: function () {
        var e = this,
          t = this.props.songItem,
          l = this.state,
          i = l.playlist,
          a = l.modalVisible,
          c = this.songName(t, 'small');
        return React.default.createElement(ReactNative.Modal, {
          animationType: "fade",
          onRequestClose: this.closePickPlaylistModal,
          visible: a
        }, React.default.createElement(ReactNative.View, {
          style: {
            flex: 1,
            alignItems: 'center'
          }
        }, React.default.createElement(components.Background, {
          coverUrl: null === c || void 0 === c ? void 0 : c.img,
          blur: true
        }), React.default.createElement(ReactNative.TouchableWithoutFeedback, {
          onPress: this.closePickPlaylistModal
        }, React.default.createElement(ReactNative.View, {
          style: ReactNative.StyleSheet.absoluteFill
        })), React.default.createElement(module715.default, {
          onPress: this.onTop,
          content: locales.default.TOGGLE_MIX
        }), React.default.createElement(FadingEdge.default, {
          top: 30
        }, React.default.createElement(reactNativeSpringScrollview.SpringScrollView, {
          ref: function (t) {
            return e._scrollView = t;
          }
        }, (null === i || void 0 === i ? void 0 : i.length) > 0 ? i.map(function (t, l) {
          return e._renderItem({
            item: t,
            index: l
          });
        }) : React.default.createElement(components.Spinkit, null), React.default.createElement(components.EmptyFooter, null)))));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = M;
