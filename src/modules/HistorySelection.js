const _default = require("./../components/Text.js").default;
const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _appStorage = require("./../storage/index.js");
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
  keysModule = _interopRequireDefault(require("../storage/keys")),
  locales = _interopRequireDefault(require("../locales/index")),
  events = require("../events/index"),
  trackInfo = require("../services/trackInfo"),
  dimensions = _interopRequireDefault(require("../native/dimensions")),
  sectionsModule = require("../screens/history/sections"),
  L = dimensions.default.get('SOFT_MENU_BAR_HEIGHT'),
  T = class t extends React.Component {
    constructor() {
      var e, n, a;
      for (var l = arguments.length, s = new Array(l), o = 0; o < l; o++) s[o] = arguments[o];
      return n = a = super(...s), a.state = {
        checkedList: {
          netEase: [],
          qqMusic: [],
          local: []
        },
        selectedAll: false,
        show_netEase: true,
        show_qqMusic: true,
        show_local: true,
        needBottomPadding: false
      }, a.loadSetting = function () {
        _appStorage.storage.load({
          key: keysModule.default.settings
        }).then(function (e) {
          (null === e || void 0 === e ? void 0 : e.navbarPadding.on) && a.setState({
            needBottomPadding: true
          });
        });
      }, a.clean = function () {
        a.setState({
          checkedList: {
            netEase: [],
            qqMusic: [],
            local: []
          },
          selectedAll: false
        });
      }, a.onTop = function () {
        var e;
        null === (e = a._list) || void 0 === e || e.scrollTo({
          x: 0,
          y: 0
        });
      }, a.getData = function () {
        return sectionsModule.sections.map(function (e) {
          return {
            items: a.props[e].length > 0 ? a.props[e] : []
          };
        });
      }, a._heightForIndexPath = function () {
        return constants.ITEM_HEIGHT;
      }, a._heightForSection = function (e) {
        var t = sectionsModule.sections[e];
        return 0 === a.sectionDataLength(t) ? 0 : sectionsModule.SECTION_HEIGHT;
      }, a._renderSection = function (e) {
        var t = sectionsModule.sections[e],
          n = sectionsModule.sectionTitleMap[t],
          l = a.sectionDataLength(t);
        return React.default.createElement(ReactNative.View, {
          style: sectionsModule.sectionStyle.container
        }, React.default.createElement(components.Title, {
          style: [sectionsModule.sectionStyle.numbers]
        }, l), React.default.createElement(components.Title, null, n));
      }, a._renderIndexPath = function (e) {
        var t = e.section,
          n = e.row,
          l = sectionsModule.sections[t],
          s = n,
          o = a.props[l][s],
          u = (0, trackInfo.extractFullInfo)(o),
          d = a.isCheck(s, l);
        return React.default.createElement(ReactNative.View, null, React.default.createElement(components.SongRow, {
          song: u.song,
          singer: u.singer,
          album: u.album,
          isChecked: d,
          index: s,
          onPress: function () {
            return a.onChecked(s, l);
          }
        }));
      }, a.sectionDataLength = function (e) {
        var t,
          n = a.props,
          l = n.netEase,
          r = n.qqMusic,
          i = n.local;
        switch (e) {
          case providers.default.netEase:
            t = l.length;
            break;
          case providers.default.qqMusic:
            t = r.length;
            break;
          case providers.default.local:
            t = i.length;
        }
        return t;
      }, a.addToPlay = function () {
        var e = a.mostChecked();
        events.emitter.emit(names.default.InsertToList, {
          data: e.data,
          type: 'array',
          api: e.api
        });
        a.clean();
      }, a.mostChecked = function () {
        var e = a.props,
          t = e.qqMusic,
          n = e.netEase,
          l = e.local,
          r = a.state.checkedList,
          i = r.netEase.length,
          s = r.qqMusic.length,
          o = r.local.length,
          c = {
            data: null,
            api: null
          };
        i > s && i > o && (c.data = n.filter(function (e, t) {
          return r.netEase.includes(t);
        }), c.api = providers.default.netEase);
        s > i && s > o && (c.data = t.filter(function (e, t) {
          return r.qqMusic.includes(t);
        }), c.api = providers.default.qqMusic);
        o > i && o > s && (c.data = l.filter(function (e, t) {
          return r.local.includes(t);
        }), c.api = providers.default.local);
        return c;
      }, a.selectAll = function () {
        var e = a.props,
          t = e.qqMusic,
          n = e.netEase,
          l = e.local;
        n.map(function (e, t) {
          a.checkedAll(t, providers.default.netEase);
        });
        t.map(function (e, t) {
          a.checkedAll(t, providers.default.qqMusic);
        });
        l.map(function (e, t) {
          a.checkedAll(t, providers.default.local);
        });
      }, a.checkedAll = function (e, t) {
        var n = a.state.selectedAll,
          l = a.state.checkedList,
          r = l[t];
        n ? l[t] = [] : (r.push(e), l[t] = r);
        a.setState({
          checkedList: l,
          selectedAll: !n
        });
      }, a.onDelete = function () {
        var e = a.state.checkedList;
        (0, a.props.onDelete)(e);
        a.clean();
      }, a.pickedNum = function () {
        for (var e = a.state.checkedList, t = 0, n = Object.keys(e), l = 0; l < n.length; l++) t += e[n[l]].length;
        return t;
      }, a.onChecked = function (e, t) {
        var n = a.state.checkedList,
          l = n[t];
        a.isCheck(e, t) ? l = l.filter(function (t) {
          return t !== e;
        }) : l.push(e);
        n[t] = l;
        a.setState({
          checkedList: n
        });
      }, a.isCheck = function (e, t) {
        return a.state.checkedList[t].some(function (t) {
          return t === e;
        });
      }, n;
    }
    "componentDidMount"() {
      this.loadSetting();
    }
    "render"() {
      var e = this,
        t = this.props,
        n = t.isOpen,
        a = t.onClosed,
        l = this.state,
        u = l.selectedAll,
        d = l.needBottomPadding,
        f = this.getData();
      return React.default.createElement(ReactNative.Modal, {
        ref: instance => this.modal = instance,
        style: {
          flex: 1
        },
        animationType: "fade",
        visible: n,
        onRequestClose: function () {
          e.clean();
          a();
        }
      }, React.default.createElement(ReactNative.View, {
        style: [_.container, {
          paddingBottom: d ? 5 + L : 5
        }]
      }, React.default.createElement(components.Background, null), React.default.createElement(components.HeaderBar, {
        headerStyle: _.header,
        title: this.pickedNum() + ' ' + locales.default.SELECTED,
        goBack: a,
        onTop: this.onTop,
        backIcon: {
          name: icons.default.WINDOW_CLOSE
        }
      }), React.default.createElement(FadingEdge.default, {
        top: 30,
        bottom: 30
      }, React.default.createElement(reactNativeLargelist.LargeList, {
        ref: function (t) {
          return e._list = t;
        },
        data: f,
        heightForIndexPath: this._heightForIndexPath,
        heightForSection: this._heightForSection,
        renderIndexPath: this._renderIndexPath,
        renderSection: this._renderSection
      })), React.default.createElement(ReactNative.View, {
        style: _.btns
      }, React.default.createElement(q, {
        text: locales.default.PLAY,
        name: icons.default.PLUS,
        onPress: this.addToPlay
      }), React.default.createElement(q, {
        text: u ? locales.default.CANCEL : locales.default.SELECT_ALL,
        name: u ? icons.default.CANCEL : icons.default.CHECK_ALL,
        onPress: this.selectAll
      }), React.default.createElement(q, {
        text: locales.default.DELETE,
        name: icons.default.DELETE,
        onPress: this.onDelete
      }))));
    }
  },
  q = function (e) {
    var t = e.onPress,
      n = e.name,
      a = e.text,
      l = e.style;
    return React.default.createElement(ReactNative.TouchableOpacity, {
      onPress: t
    }, React.default.createElement(ReactNative.View, {
      style: [_.btn, l]
    }, React.default.createElement(components.Icon, {
      name: n || icons.default.FORMAT_LIST_BULLETED
    }), React.default.createElement(_default, null, a || locales.default.MULT_SELECT)));
  },
  _ = ReactNative.StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 40 + constants.STATUS_BAR_HEIGHT
    },
    header: {
      position: 'absolute',
      top: 0,
      zIndex: 10
    },
    btns: {
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around'
    }
  }),
  C = T;
exports.default = C;
