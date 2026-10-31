const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
const _appStorage = require('./../storage/index.js');
const _defineProperty = require('@babel/runtime/helpers/defineProperty');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  reactNativeLargelist = require('./../components/Scrolling.js'),
  components = require('../components/index'),
  providers = _interopRequireDefault(require('../services/providers')),
  constants = require('../theme/constants'),
  icons = _interopRequireDefault(require('../theme/icons')),
  keys = _interopRequireDefault(require('../storage/keys')),
  locales = _interopRequireDefault(require('../locales/index')),
  events = require('../events/index'),
  types = _interopRequireWildcard(require('../utils/types')),
  trackInfo = require('../services/trackInfo'),
  mediaStore = _interopRequireDefault(require('../native/mediaStore')),
  history = require('../storage/history'),
  sectionsModule = require('./history/sections'),
  HistorySelection = _interopRequireDefault(require('./../modules/HistorySelection.js')),
  H = class t extends React.Component {
    constructor() {
      var e, a, n;
      for (var l = arguments.length, o = new Array(l), f = 0; f < l; f++) o[f] = arguments[f];
      return (
        (a = n = super(...o)),
        (n.state = {
          qqMusic: [],
          netEase: [],
          local: [],
          showModal: false,
        }),
        (n.loadHistory = function () {
          _appStorage.storage
            .load({
              key: keys.default.musicHistory,
            })
            .then(function (e) {
              if (e) {
                if (!types.isObject(e)) return;
                n.setState(
                  {
                    qqMusic: e.qqMusic,
                    netEase: e.netEase,
                    local: e.local,
                  },
                  function () {
                    n.attachLocalPath(e.netEase, providers.default.netEase);
                    n.attachLocalPath(e.qqMusic, providers.default.qqMusic);
                  },
                );
              }
            })
            .catch(function () {
              return false;
            });
        }),
        (n.attachLocalPath = function (e, t) {
          e.length < 1 ||
            mediaStore.default.attachLocalPath(e).then(function (e) {
              n.setState(_defineProperty({}, t, e));
            });
        }),
        (n.listPick = function () {
          n.setState({
            showModal: true,
          });
        }),
        (n.onTop = function () {
          var e;
          null === (e = n._list) ||
            void 0 === e ||
            e.scrollTo({
              x: 0,
              y: 0,
            });
        }),
        (n.getData = function () {
          return sectionsModule.sections.map(function (e) {
            return {
              items: n.state[e].length > 0 ? n.state[e] : [],
            };
          });
        }),
        (n._heightForIndexPath = function () {
          return constants.ITEM_HEIGHT;
        }),
        (n._heightForSection = function (e) {
          var t = sectionsModule.sections[e];
          return 0 === n.sectionDataLength(t) ? 0 : sectionsModule.SECTION_HEIGHT;
        }),
        (n._renderSection = function (e) {
          var t = sectionsModule.sections[e],
            a = sectionsModule.sectionTitleMap[t],
            l = n.sectionDataLength(t);
          return React.default.createElement(
            ReactNative.View,
            {
              style: sectionsModule.sectionStyle.container,
            },
            React.default.createElement(
              components.Title,
              {
                style: [sectionsModule.sectionStyle.numbers],
              },
              l,
            ),
            React.default.createElement(components.Title, null, a),
          );
        }),
        (n._renderIndexPath = function (e) {
          var t = e.section,
            a = e.row,
            l = sectionsModule.sections[t],
            o = a,
            c = n.state[l][o],
            u = (0, trackInfo.extractFullInfo)(c);
          return React.default.createElement(
            ReactNative.View,
            null,
            React.default.createElement(components.SongRow, {
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
                  api: l,
                });
              },
              addToQueue: function () {
                return (0, events.toInsertToList)({
                  data: c,
                  api: l,
                });
              },
              isExist: null === c || void 0 === c ? void 0 : c.localPath,
              songItem: c,
            }),
          );
        }),
        (n.onPickDelete = function (e) {
          e.netEase.length > 0 && n.changeList(providers.default.netEase, e.netEase);
          e.qqMusic.length > 0 && n.changeList(providers.default.qqMusic, e.qqMusic);
          e.local.length > 0 && n.changeList(providers.default.local, e.local);
        }),
        (n.changeList = function (e, t) {
          var a = n.state[e].filter(function (e, a) {
            return !t.includes(a);
          });
          n.setState(_defineProperty({}, e, a));
        }),
        (n.sectionDataLength = function (e) {
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
        }),
        (n.playMusic = function (e, t, a) {
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
            localPath: e.localPath,
          });
        }),
        (n.refreshList = function (e, t) {
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
          n.setState(_defineProperty({}, t, (0, history.cleanedData)(a, e, t)));
        }),
        a
      );
    }
    componentWillUnmount() {
      var e = this.state,
        t = {
          qqMusic: e.qqMusic,
          netEase: e.netEase,
          local: e.local,
        };
      _appStorage.storage.save({
        key: keys.default.musicHistory,
        data: t,
      });
    }
    componentDidMount() {
      this.loadHistory();
    }
    render() {
      var e = this,
        t = this.state,
        a = t.showModal,
        n = t.netEase,
        l = t.qqMusic,
        s = t.local,
        c = this.getData();
      return React.default.createElement(
        components.PageContainer,
        {
          title: locales.default.RECENT_PLAY,
          goBack: function () {
            return e.props.navigation.goBack();
          },
          rightIcon: {
            name: icons.default.CHECKBOX_MULTIPLE_MARKED_CIRCLE_OUTLINE,
            onPress: this.listPick,
          },
          onTop: this.onTop,
        },
        React.default.createElement(reactNativeLargelist.LargeList, {
          ref: function (t) {
            return (e._list = t);
          },
          data: c,
          heightForIndexPath: this._heightForIndexPath,
          heightForSection: this._heightForSection,
          renderIndexPath: this._renderIndexPath,
          renderSection: this._renderSection,
        }),
        React.default.createElement(HistorySelection.default, {
          isOpen: a,
          onClosed: function () {
            e.setState({
              showModal: false,
            });
          },
          netEase: n,
          qqMusic: l,
          local: s,
          onDelete: this.onPickDelete,
        }),
      );
    }
  };
exports.default = H;
