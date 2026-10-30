const _default = require("./../components/Text.js").default;
const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _appStorage = require("./../storage/index.js");
const _toConsumableArray = require("@babel/runtime/helpers/toConsumableArray");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  FadingEdge = _interopRequireDefault(require("../components/FadingEdge")),
  reactNativeSpringScrollview = require("./../components/Scrolling.js"),
  components = require("../components/index"),
  providers = _interopRequireDefault(require("../services/providers")),
  constants = require("../theme/constants"),
  icons = _interopRequireDefault(require("../theme/icons")),
  keys = _interopRequireDefault(require("../storage/keys")),
  services = require("../services/index"),
  types = _interopRequireWildcard(require("../utils/types")),
  historyModule = require("../storage/history"),
  sections = require("../screens/search/sections"),
  S = class t extends React.PureComponent {
    constructor() {
      var e, a, r;
      for (var n = arguments.length, u = new Array(n), l = 0; l < n; l++) u[l] = arguments[l];
      return a = r = super(...u), r.state = {
        songs: [],
        albums: [],
        artists: [],
        history: []
      }, r.loadHistory = function () {
        _appStorage.storage.load({
          key: keys.default.searchHistory
        }).then(function (e) {
          r.setState({
            history: e
          });
        }).catch(function () {
          return null;
        });
      }, r.clearAllSuggestions = function () {
        r.setState({
          songs: [],
          albums: [],
          artists: []
        });
      }, r.insertHistoryItem = function (e, t) {
        var a = {
            text: e,
            api: t
          },
          n = r.state.history;
        r.setState({
          history: [a].concat(_toConsumableArray(n))
        });
        (0, historyModule.searchHistory)(e, t);
      }, r.search_suggest = function (e) {
        switch (r.props.api) {
          case providers.default.netEase:
            r.suggest_netEase(e);
            break;
          case providers.default.qqMusic:
            r.suggest_qqMusic(e);
        }
      }, r.suggest_netEase = async function (keywords) {
        const response = await services.Netease.search_suggest(keywords);
        if (response?.code === 200) r.setState({
          songs: response.result.songs || [],
          albums: response.result.albums || [],
          artists: response.result.artists || []
        });
      }, r.suggest_qqMusic = async function (keywords) {
        const response = await services.QQMusic.search_suggest(keywords);
        if (response?.code === 0) r.setState({
          songs: response.data.song.itemlist || [],
          albums: response.data.album.itemlist || [],
          artists: response.data.singer.itemlist || []
        });
      }, r._renderContent = function () {
        return sections.SECTIONS.map(function (e) {
          return React.default.createElement(React.default.Fragment, null, r._renderSection(e), r._renderItem(e));
        });
      }, r._renderSection = function (e) {
        var t = e === sections.SECTIONS[3];
        return r.getSectionDataLength(e) <= 0 ? null : React.default.createElement(ReactNative.TouchableNativeFeedback, {
          onPress: t ? r.clearHistory : null
        }, React.default.createElement(ReactNative.View, {
          style: t && {
            flexDirection: 'row',
            alignItems: 'center'
          }
        }, React.default.createElement(_default, {
          style: [E.text, E.sectionHeader]
        }, sections.SECTION_NAMES[e]), t && React.default.createElement(components.Icon, {
          name: icons.default.WINDOW_CLOSE,
          color: "#eee",
          style: E.rightIcon,
          size: 20
        })));
      }, r._renderItem = function (e) {
        return r.state[e] ? r.state[e].map(function (t, a) {
          var n = r.formatSuggestData(t, e);
          return React.default.createElement(y, {
            key: a,
            name: n.name,
            transName: n.transName,
            subName: n.subName,
            item: n,
            onPress: function () {
              return r.props.onSuggest(t, e);
            }
          });
        }) : null;
      }, r.getSectionDataLength = function (e) {
        var t;
        return null === (t = r.state[e]) || void 0 === t ? void 0 : t.length;
      }, r.formatSuggestData = function (e, t) {
        var a = r.props.api,
          n = {};
        if (t === sections.SECTION_KEYS.history) {
          n.name = e.text;
          return n;
        }
        switch (a) {
          case providers.default.netEase:
            t === sections.SECTION_KEYS.songs && (n.subName = types.isArray(e.artist) ? e.artists[0].name : '', n.transName = e.transNames ? e.transNames[0] : '');
            t === sections.SECTION_KEYS.albums && (n.subName = e.artist.name);
            t === sections.SECTION_KEYS.artists && (n.subName = e.alias[0]);
            n.name = e.name;
            break;
          case providers.default.qqMusic:
            n.name = e.name;
        }
        return n;
      }, r.clearHistory = function () {
        r.setState({
          history: []
        });
        _appStorage.storage.remove({
          key: keys.default.searchHistory
        });
      }, a;
    }
    "componentDidMount"() {
      this.loadHistory();
      this.props.onRef(this);
    }
    "render"() {
      return this.props.focusing ? React.default.createElement(ReactNative.View, {
        style: {
          top: 40 + constants.STATUS_BAR_HEIGHT,
          flex: 1,
          alignSelf: 'center',
          width: '100%',
          height: '100%',
          position: 'absolute',
          paddingHorizontal: 20
        }
      }, React.default.createElement(FadingEdge.default, {
        top: 50
      }, React.default.createElement(reactNativeSpringScrollview.SpringScrollView, {
        contentStyle: {
          paddingTop: 20
        }
      }, this._renderContent()))) : null;
    }
  };
exports.default = S;
var y = function (e) {
    var t = e.name,
      a = e.transName,
      r = e.subName,
      n = e.onPress;
    return React.default.createElement(ReactNative.TouchableNativeFeedback, {
      onPress: function () {
        return requestAnimationFrame(function () {
          n();
        });
      }
    }, React.default.createElement(ReactNative.View, {
      style: {
        marginLeft: 10,
        flexDirection: 'row'
      }
    }, React.default.createElement(_default, {
      style: [E.text, {
        fontSize: 16
      }]
    }, t, a ? "(" + a + ")" : ''), Boolean(r) && React.default.createElement(_default, {
      style: [E.text, E.fadeText]
    }, r)));
  },
  E = ReactNative.StyleSheet.create({
    text: {
      fontSize: 14,
      padding: 5
    },
    sectionHeader: {
      borderRadius: 5,
      fontSize: 16,
      fontWeight: 'bold'
    },
    text: {
      fontSize: 14,
      padding: 5
    },
    fadeText: {
      opacity: .6
    }
  });
