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
  constants = require("../theme/constants"),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  keys = babelHelpers.interopRequireDefault(require("../storage/keys")),
  services = require("../services/index"),
  types = babelHelpers.interopRequireWildcard(require("../utils/types")),
  history = require("../storage/history"),
  sections = require("../screens/search/sections"),
  S = function (e) {
    function t() {
      var e, a, r;
      babelHelpers.classCallCheck(this, t);
      for (var n = arguments.length, u = new Array(n), l = 0; l < n; l++) u[l] = arguments[l];
      return babelHelpers.possibleConstructorReturn(r, (a = r = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(u))), r.state = {
        songs: [],
        albums: [],
        artists: [],
        history: []
      }, r.loadHistory = function () {
        storage.load({
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
          history: [a].concat(babelHelpers.toConsumableArray(n))
        });
        (0, history.searchHistory)(e, t);
      }, r.search_suggest = function (e) {
        switch (r.props.api) {
          case providers.default.netEase:
            r.suggest_netEase(e);
            break;
          case providers.default.qqMusic:
            r.suggest_qqMusic(e);
        }
      }, r.suggest_netEase = function (e) {
        var t, a, n, s, i, u;
        return regeneratorRuntime.async(function (l) {
          for (;;) switch (l.prev = l.next) {
            case 0:
              l.next = 2;
              return regeneratorRuntime.awrap(services.Netease.search_suggest(e));
            case 2:
              if (t = l.sent, a = t.code, n = t.result, 200 === a) {
                l.next = 6;
                break;
              }
              return l.abrupt("return");
            case 6:
              s = n.songs;
              i = n.albums;
              u = n.artists;
              r.setState({
                songs: s || [],
                albums: i || [],
                artists: u || []
              });
            case 8:
            case "end":
              return l.stop();
          }
        }, null, this);
      }, r.suggest_qqMusic = function (e) {
        var t, a, n, s, i, u;
        return regeneratorRuntime.async(function (l) {
          for (;;) switch (l.prev = l.next) {
            case 0:
              l.next = 2;
              return regeneratorRuntime.awrap(services.QQMusic.search_suggest(e));
            case 2:
              if (t = l.sent, a = t.code, n = t.data, 0 === a) {
                l.next = 6;
                break;
              }
              return l.abrupt("return");
            case 6:
              s = n.song;
              i = n.album;
              u = n.singer;
              r.setState({
                songs: s.itemlist || [],
                albums: i.itemlist || [],
                artists: u.itemlist || []
              });
            case 8:
            case "end":
              return l.stop();
          }
        }, null, this);
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
        }, React.default.createElement(ReactNative.Text, {
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
        storage.remove({
          key: keys.default.searchHistory
        });
      }, a));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        this.loadHistory();
        this.props.onRef(this);
      }
    }, {
      key: "render",
      value: function () {
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
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
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
    }, React.default.createElement(ReactNative.Text, {
      style: [E.text, {
        fontSize: 16
      }]
    }, t, a ? "(" + a + ")" : ''), Boolean(r) && React.default.createElement(ReactNative.Text, {
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
