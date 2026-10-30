const _default = require("./../components/Text.js").default;
const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _objectSpread = require("@babel/runtime/helpers/objectSpread2");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  FadingEdge = _interopRequireDefault(require("../components/FadingEdge")),
  reactNativeLargelist = require("./../components/Scrolling.js"),
  components = require("../components/index"),
  providers = _interopRequireDefault(require("../services/providers")),
  constants = require("../theme/constants"),
  names = _interopRequireDefault(require("../events/names")),
  icons = _interopRequireDefault(require("../theme/icons")),
  locales = _interopRequireDefault(require("../locales/index")),
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
  E = class t extends React.PureComponent {
    constructor() {
      var e, a, n;
      for (var r = arguments.length, o = new Array(r), s = 0; s < r; s++) o[s] = arguments[s];
      return a = n = super(...o), n.state = {
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
      }, n.deleteFromPlaylist = async function () {
        const {
          api,
          playlistId,
          isCustom
        } = n.props;
        const ids = n.getCheckedData().map(song => song.id);
        try {
          let deleted = false;
          if (api === providers.default.netEase && playlistId) {
            const response = await services.Netease.playlist_tracks({
              op: 'del',
              pid: playlistId,
              tracks: ids
            });
            if (response.code !== 200) throw new Error(locales.default.ERROR);
            events.emitter.emit(names.default.DeleteFromPlaylist);
            deleted = true;
          } else if (isCustom && ids.length) {
            await n.props.onDeleteCustom(ids);
            deleted = true;
          }
          if (deleted) n.setState({
            checked: {},
            showModal: false
          });
        } catch (error) {
          toast('删除失败：' + error.message);
        }
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
        var t = _objectSpread({}, n.state.checked);
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
      }, a;
    }
    "render"() {
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
        }, React.default.createElement(_default, {
          style: {
            fontSize: 18
          }
        }, t.name)));
      })))));
    }
  };
exports.default = E;
var v = ReactNative.StyleSheet.create({
  container: {
    flex: 1
  }
});
