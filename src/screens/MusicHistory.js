Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeLargelist = require("react-native-largelist"),
  components = require("../components/index"),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  constants = require("../theme/constants"),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  keys = babelHelpers.interopRequireDefault(require("../storage/keys")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  events = require("../events/index"),
  types = babelHelpers.interopRequireWildcard(require("../utils/types")),
  trackInfo = require("../services/trackInfo"),
  mediaStore = babelHelpers.interopRequireDefault(require("../native/mediaStore")),
  history = require("../storage/history"),
  module873 = require("../modules/module-873"),
  module874 = babelHelpers.interopRequireDefault(require("../modules/module-874")),
  H = function (e) {
    function t() {
      var e, a, n;
      babelHelpers.classCallCheck(this, t);
      for (var l = arguments.length, o = new Array(l), f = 0; f < l; f++) o[f] = arguments[f];
      return babelHelpers.possibleConstructorReturn(n, (a = n = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(o))), n.state = {
        qqMusic: [],
        netEase: [],
        local: [],
        showModal: false
      }, n.loadHistory = function () {
        storage.load({
          key: keys.default.musicHistory
        }).then(function (e) {
          if (e) {
            if (!types.isObject(e)) return;
            n.setState({
              qqMusic: e.qqMusic,
              netEase: e.netEase,
              local: e.local
            }, function () {
              n.attachLocalPath(e.netEase, providers.default.netEase);
              n.attachLocalPath(e.qqMusic, providers.default.qqMusic);
            });
          }
        }).catch(function () {
          return false;
        });
      }, n.attachLocalPath = function (e, t) {
        e.length < 1 || mediaStore.default.attachLocalPath(e).then(function (e) {
          n.setState(babelHelpers.defineProperty({}, t, e));
        });
      }, n.listPick = function () {
        n.setState({
          showModal: true
        });
      }, n.onTop = function () {
        var e;
        null === (e = n._list) || void 0 === e || e.scrollTo({
          x: 0,
          y: 0
        });
      }, n.getData = function () {
        return module873.sections.map(function (e) {
          return {
            items: n.state[e].length > 0 ? n.state[e] : []
          };
        });
      }, n._heightForIndexPath = function () {
        return constants.ITEM_HEIGHT;
      }, n._heightForSection = function (e) {
        var t = module873.sections[e];
        return 0 === n.sectionDataLength(t) ? 0 : module873.SECTION_HEIGHT;
      }, n._renderSection = function (e) {
        var t = module873.sections[e],
          a = module873.sectionTitleMap[t],
          l = n.sectionDataLength(t);
        return React.default.createElement(ReactNative.View, {
          style: module873.sectionStyle.container
        }, React.default.createElement(components.Title, {
          style: [module873.sectionStyle.numbers]
        }, l), React.default.createElement(components.Title, null, a));
      }, n._renderIndexPath = function (e) {
        var t = e.section,
          a = e.row,
          l = module873.sections[t],
          o = a,
          c = n.state[l][o],
          u = (0, trackInfo.extractFullInfo)(c);
        return React.default.createElement(ReactNative.View, null, React.default.createElement(components.SongRow, {
          song: u.song,
          singer: u.singer,
          album: u.album,
          index: o,
          alias: u.alias,
          onPress: function () {
            return n.playMusic(c, o, l);
          },
          detail: function () {
            return (0, events.toDetailModal)({
              item: c,
              index: o,
              api: l
            });
          },
          addToQueue: function () {
            return (0, events.toInsertToList)({
              data: c,
              api: l
            });
          },
          isExist: null === c || void 0 === c ? void 0 : c.localPath,
          songItem: c
        }));
      }, n.onPickDelete = function (e) {
        e.netEase.length > 0 && n.changeList(providers.default.netEase, e.netEase);
        e.qqMusic.length > 0 && n.changeList(providers.default.qqMusic, e.qqMusic);
        e.local.length > 0 && n.changeList(providers.default.local, e.local);
      }, n.changeList = function (e, t) {
        var a = n.state[e].filter(function (e, a) {
          return !t.includes(a);
        });
        n.setState(babelHelpers.defineProperty({}, e, a));
      }, n.sectionDataLength = function (e) {
        var t,
          a = n.state,
          l = a.netEase,
          i = a.qqMusic,
          s = a.local;
        switch (e) {
          case providers.default.netEase:
            t = l.length;
            break;
          case providers.default.qqMusic:
            t = i.length;
            break;
          case providers.default.local:
            t = s.length;
        }
        return t;
      }, n.playMusic = function (e, t, a) {
        n.refreshList(e, a);
        var l,
          i = n.state,
          s = i.netEase,
          o = i.qqMusic,
          r = i.local;
        switch (a) {
          case providers.default.qqMusic:
            l = o;
            break;
          case providers.default.netEase:
            l = s;
            break;
          case providers.default.local:
            l = r;
        }
        (0, events.toPlayer)({
          item: e,
          data: l,
          index: 0,
          api: a,
          localPath: e.localPath
        });
      }, n.refreshList = function (e, t) {
        var a,
          l = n.state,
          i = l.qqMusic,
          s = l.netEase,
          o = l.local;
        switch (t) {
          case providers.default.qqMusic:
            a = i;
            break;
          case providers.default.netEase:
            a = s;
            break;
          case providers.default.local:
            a = o;
        }
        n.setState(babelHelpers.defineProperty({}, t, (0, history.cleanedData)(a, e, t)));
      }, a));
    }
    babelHelpers.createClass(t, [{
      key: "componentWillUnmount",
      value: function () {
        var e = this.state,
          t = {
            qqMusic: e.qqMusic,
            netEase: e.netEase,
            local: e.local
          };
        storage.save({
          key: keys.default.musicHistory,
          data: t
        });
      }
    }, {
      key: "componentDidMount",
      value: function () {
        this.loadHistory();
      }
    }, {
      key: "render",
      value: function () {
        var e = this,
          t = this.state,
          a = t.showModal,
          n = t.netEase,
          l = t.qqMusic,
          s = t.local,
          c = this.getData();
        return React.default.createElement(components.PageContainer, {
          title: locales.default.RECENT_PLAY,
          goBack: function () {
            return e.props.navigation.goBack();
          },
          rightIcon: {
            name: icons.default.CHECKBOX_MULTIPLE_MARKED_CIRCLE_OUTLINE,
            onPress: this.listPick
          },
          onTop: this.onTop
        }, React.default.createElement(reactNativeLargelist.LargeList, {
          ref: function (t) {
            return e._list = t;
          },
          data: c,
          heightForIndexPath: this._heightForIndexPath,
          heightForSection: this._heightForSection,
          renderIndexPath: this._renderIndexPath,
          renderSection: this._renderSection
        }), React.default.createElement(module874.default, {
          isOpen: a,
          onClosed: function () {
            e.setState({
              showModal: false
            });
          },
          netEase: n,
          qqMusic: l,
          local: s,
          onDelete: this.onPickDelete
        }));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.Component);
exports.default = H;
