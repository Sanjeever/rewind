Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  FadingEdge = babelHelpers.interopRequireDefault(require("../components/FadingEdge")),
  reactNativeLargelist = require("react-native-largelist"),
  components = require("../components/index"),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  constants = require("../theme/constants"),
  names = babelHelpers.interopRequireDefault(require("../events/names")),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  services = require("../services/index"),
  events = require("../events/index"),
  trackInfo = require("../services/trackInfo"),
  C = [{
    name: locales.default.PLAY,
    key: 'play'
  }, {
    name: locales.default.ADD_TO_MIX,
    key: 'addToPlaylist'
  }, {
    name: locales.default.DELETE_FROM_PLAYLIST,
    key: 'deleteFromPlaylist'
  }],
  y = {
    encode: function (e) {
      return String('k' + e);
    },
    decode: function (e) {
      return Number(e.slice(1));
    }
  },
  E = function (e) {
    function t() {
      var e, a, n;
      babelHelpers.classCallCheck(this, t);
      for (var r = arguments.length, o = new Array(r), s = 0; s < r; s++) o[s] = arguments[s];
      return babelHelpers.possibleConstructorReturn(n, (a = n = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(o))), n.state = {
        checked: {},
        showModal: false
      }, n.handleClose = function () {
        n.setState({
          checked: {}
        });
        n.props.onClose();
      }, n.onTop = function () {
        var e;
        null === (e = n._list) || void 0 === e || e.scrollTo({
          x: 0,
          y: 0
        });
      }, n.getNeedCheckAll = function () {
        var e = n.state.checked;
        return 0 === Object.values(e).filter(function (e) {
          return e > 0;
        }).length;
      }, n._renderIndexPath = function (e) {
        var t = e.row;
        return n.renderItem({
          item: n.props.data[t],
          index: t
        });
      }, n.onTask = function (e) {
        switch (e) {
          case C[0].key:
            n.playChecked();
            break;
          case C[1].key:
            n.onCollectModal();
            break;
          case C[2].key:
            n.deleteFromPlaylist();
        }
      }, n.onDots = function (e) {
        e <= 0 || n.setState({
          showModal: true
        });
      }, n.playChecked = function () {
        var e = n.props.api,
          t = n.getCheckedData();
        t && 0 !== t.length && ((0, events.toPlayer)({
          item: t[0],
          data: t,
          index: 0,
          api: e
        }), n.setState({
          checked: {},
          showModal: false
        }), n.props.onClose());
      }, n.deleteFromPlaylist = function () {
        var e, t, a, r, l, o, s, c, i, d;
        return regeneratorRuntime.async(function (p) {
          for (;;) switch (p.prev = p.next) {
            case 0:
              if (e = n.props, t = e.api, a = e.playlistId, r = e.isCustom, l = false, t !== providers.default.netEase || !a) {
                p.next = 12;
                break;
              }
              o = n.getCheckedData();
              s = o.map(function (e) {
                return e.id;
              });
              p.next = 7;
              return regeneratorRuntime.awrap(services.Netease.playlist_tracks({
                op: 'del',
                pid: a,
                tracks: s
              }));
            case 7:
              c = p.sent;
              200 === c.code && (events.emitter.emit(names.default.DeleteFromPlaylist), l = true);
              p.next = 13;
              break;
            case 12:
              true === r && (i = n.getCheckedData(), (d = i.map(function (e) {
                return e.id;
              })).length > 0 && (n.props.onDeleteCustom(d), l = true));
            case 13:
              l && (n.setState({
                checked: {},
                showModal: false
              }), toast(locales.default.DELETE_SUCCESS));
            case 14:
            case "end":
              return p.stop();
          }
        }, null, this);
      }, n.onCollectModal = function () {
        var e = n.props.api,
          t = n.getCheckedData();
        events.emitter.emit(names.default.CollectModal, {
          api: e,
          data: t
        });
      }, n.onCheckAll = function () {
        var e = n.getNeedCheckAll(),
          t = n.state.checked;
        e ? n.props.data.map(function (e, a) {
          var n = y.encode(a);
          t[n] = 1;
        }) : t = {};
        n.setState({
          checked: t
        });
        n.forceUpdate();
      }, n.onCheck = function (e) {
        var t = babelHelpers.objectSpread({}, n.state.checked);
        t[y.encode(e)] ^= 1;
        n.setState({
          checked: t
        });
      }, n.getCheckedData = function () {
        var e = n.props.data,
          t = n.state.checked,
          a = [];
        Object.keys(t).forEach(function (n) {
          var r = y.decode(n),
            l = e[r];
          l && t[n] && a.push(l);
        });
        return a;
      }, n.isChecked = function (e) {
        var t = y.encode(e);
        return !!n.state.checked[t];
      }, n.renderItem = function (e) {
        var t = e.item,
          a = e.index,
          r = (0, trackInfo.extractFullInfo)(t),
          o = n.isChecked(a);
        return React.default.createElement(components.SongRow, {
          index: a,
          song: r.song,
          singer: r.singer,
          album: r.album,
          isChecked: o,
          onPress: function () {
            return n.onCheck(a);
          }
        });
      }, a));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        var e = this,
          t = this.props,
          a = t.visible,
          n = t.data;
        if (!a) return null;
        var r = this.state,
          u = r.checked,
          f = r.showModal,
          k = Object.values(u).filter(function (e) {
            return e > 0;
          }).length,
          b = 0 === k ? locales.default.MULT_SELECT : k + " " + locales.default.SELECTED,
          m = [{
            name: 0 === k ? icons.default.CHECK_ALL : icons.default.CANCEL,
            onPress: this.onCheckAll
          }, {
            name: icons.default.DOTS_VERTICAL,
            onPress: function () {
              return e.onDots(k);
            }
          }];
        return React.default.createElement(ReactNative.Modal, {
          animationType: "fade",
          transparent: true,
          onRequestClose: this.handleClose,
          visible: a
        }, React.default.createElement(ReactNative.View, {
          style: v.container
        }, React.default.createElement(components.Background, null), React.default.createElement(components.HeaderBar, {
          title: b,
          goBack: this.handleClose,
          backIcon: {
            name: icons.default.WINDOW_CLOSE
          },
          rightIcon: m,
          onTop: this.onTop
        }), React.default.createElement(FadingEdge.default, {
          top: 30
        }, React.default.createElement(reactNativeLargelist.LargeList, {
          ref: function (t) {
            return e._list = t;
          },
          data: [{
            items: n
          }],
          heightForIndexPath: function () {
            return constants.ITEM_HEIGHT;
          },
          renderIndexPath: this._renderIndexPath
        })), React.default.createElement(ReactNative.Modal, {
          animationType: "fade",
          transparent: true,
          onRequestClose: function () {
            return e.setState({
              showModal: false
            });
          },
          visible: f
        }, React.default.createElement(ReactNative.View, {
          style: {
            flex: 1,
            backgroundColor: '#000',
            justifyContent: 'center',
            alignItems: 'center'
          }
        }, React.default.createElement(ReactNative.TouchableWithoutFeedback, {
          onPress: function () {
            return e.setState({
              showModal: false
            });
          }
        }, React.default.createElement(ReactNative.View, {
          style: [ReactNative.StyleSheet.absoluteFill]
        })), C.map(function (t, a) {
          return React.default.createElement(ReactNative.TouchableNativeFeedback, {
            key: a,
            onPress: function () {
              return e.onTask(t.key);
            }
          }, React.default.createElement(ReactNative.View, {
            style: {
              padding: 20
            }
          }, React.default.createElement(ReactNative.Text, {
            style: {
              fontSize: 18
            }
          }, t.name)));
        })))));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = E;
var v = ReactNative.StyleSheet.create({
  container: {
    flex: 1
  }
});
