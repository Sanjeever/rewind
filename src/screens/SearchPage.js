const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _extends = require("@babel/runtime/helpers/extends");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeTabView = require("react-native-tab-view"),
  components = require("../components/index"),
  providers = _interopRequireDefault(require("../services/providers")),
  constants = require("../theme/constants"),
  icons = _interopRequireDefault(require("../theme/icons")),
  locales = _interopRequireDefault(require("../locales/index")),
  types = require("../utils/types"),
  sections = require("./search/sections"),
  AlbumSearchResults = _interopRequireDefault(require("./../modules/AlbumSearchResults.js")),
  VideoSearchResults = _interopRequireDefault(require("./../modules/VideoSearchResults.js")),
  PlaylistSearchResults = _interopRequireDefault(require("./../modules/PlaylistSearchResults.js")),
  ArtistSearchResults = _interopRequireDefault(require("./../modules/ArtistSearchResults.js")),
  SongSearchResults = _interopRequireDefault(require("./../modules/SongSearchResults.js")),
  SearchSuggestions = _interopRequireDefault(require("./../modules/SearchSuggestions.js")),
  netease = require("../../assets/images/netease.png"),
  qqmusic = require("../../assets/images/qqmusic.png"),
  v = class t extends React.PureComponent {
    constructor() {
      var e, a, n;
      for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
      return a = n = super(...l), n.animating = false, n.search = null, n.state = {
        api: providers.default.netEase,
        index: 0,
        routes: [{
          key: '1',
          title: locales.default.ARTIST_SONGS
        }, {
          key: '2',
          title: locales.default.ARTIST
        }, {
          key: '3',
          title: locales.default.ARTIST_ALBUM
        }, {
          key: '4',
          title: locales.default.MIX
        }, {
          key: '5',
          title: locales.default.ARTIST_MV
        }],
        show: false
      }, n.onSubmitEditing = function () {
        n.setState({
          show: true,
          focusing: false
        });
        var e = n.state.api;
        n.search && n._suggestion.insertHistoryItem(n.search, e);
      }, n.changedApi = function () {
        var e = n.state.api === providers.default.netEase ? providers.default.qqMusic : providers.default.netEase;
        n.setState({
          api: e,
          show: false
        }, function () {
          n.onSubmitEditing();
        });
      }, n.onChangeText = function (e) {
        n.search = e;
        (0, types.debounce)(function () {
          e && '' !== e ? n._suggestion.search_suggest(e) : n._suggestion.clearAllSuggestions();
        }, 100)();
      }, n.onTextInputFocus = function (e) {
        n.setState({
          focusing: e
        });
        n.search && (0, types.debounce)(function () {
          return n._suggestion.search_suggest(n.search);
        }, 500, true);
      }, n.handleOnSuggest = function (e, t) {
        var a = n.state.api;
        if (t === sections.SECTION_KEYS.history) {
          var r = e.text,
            i = e.api;
          n.search = r;
          return void n.setState({
            api: i
          }, function () {
            n.onSubmitEditing();
          });
        }
        t === sections.SECTION_KEYS.songs && (n.search = e.name, n.onSubmitEditing());
        t === sections.SECTION_KEYS.artists && n.props.navigation.navigate('ArtistPage', {
          item: e,
          api: a
        });
        t === sections.SECTION_KEYS.albums && n.props.navigation.navigate('AlbumPage', {
          item: e,
          api: a
        });
      }, n._handleIndexChange = function (e) {
        n.setState({
          index: e
        });
      }, n._renderHeader = function (e) {
        return React.default.createElement(reactNativeTabView.TabBar, _extends({
          pressColor: 'rgba(0,0,0,0.3)',
          renderText: n._renderText,
          tabStyle: H.tabStyle,
          labelStyle: H.labelStyle,
          indicatorStyle: H.indicatorStyle,
          style: H.tabBar
        }, e));
      }, n._renderScene = function (e) {
        var t = e.route,
          a = {
            search: n.search,
            api: n.state.api,
            index: n.state.index,
            navigation: n.props.navigation
          };
        switch (t.key) {
          case '1':
            return React.default.createElement(SongSearchResults.default, a);
          case '2':
            return React.default.createElement(ArtistSearchResults.default, a);
          case '3':
            return React.default.createElement(AlbumSearchResults.default, a);
          case '4':
            return React.default.createElement(PlaylistSearchResults.default, a);
          case '5':
            return React.default.createElement(VideoSearchResults.default, a);
        }
      }, a;
    }
    "componentDidMount"() {
      var e = this.props.route.params;
      if (e) {
        var t = e.text;
        t && this.onChangeText(t);
      }
    }
    "render"() {
      var e = this,
        t = this.state,
        a = t.api,
        n = t.focusing,
        r = t.show;
      return React.default.createElement(ReactNative.View, {
        style: H.container
      }, React.default.createElement(components.Background, null), React.default.createElement(ReactNative.View, {
        style: H.toolbar
      }, React.default.createElement(components.TouchableBorderless, {
        onPress: function () {
          return e.props.navigation.goBack();
        },
        style: {
          padding: 6
        }
      }, React.default.createElement(components.Icon, {
        name: icons.default.ARROW_LEFT
      })), React.default.createElement(components.Input, {
        autoFocus: true,
        style: H.textInput,
        placeholder: "Everything\u2026\u2026",
        onChangeText: this.onChangeText,
        onSubmitEditing: this.onSubmitEditing,
        onFocus: function () {
          return e.onTextInputFocus(true);
        }
      }), React.default.createElement(components.TouchableBorderless, {
        onPress: this.changedApi,
        style: {
          padding: 6
        }
      }, React.default.createElement(ReactNative.View, {
        style: {
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1
        }
      }, React.default.createElement(ReactNative.Image, {
        source: a === providers.default.netEase ? netease : qqmusic,
        style: {
          height: 25,
          width: 25
        }
      })))), React.default.createElement(SearchSuggestions.default, {
        focusing: n,
        onRef: function (t) {
          return e._suggestion = t;
        },
        api: a,
        onSuggest: this.handleOnSuggest
      }), true === r && false === n ? React.default.createElement(reactNativeTabView.TabView, {
        style: H.container,
        navigationState: this.state,
        renderScene: this._renderScene,
        renderTabBar: this._renderHeader,
        onIndexChange: this._handleIndexChange
      }) : null);
    }
  },
  H = ReactNative.StyleSheet.create({
    container: {
      flex: 1
    },
    toolbar: {
      marginTop: constants.STATUS_BAR_HEIGHT,
      height: 40,
      width: '100%',
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 10
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      paddingHorizontal: 10
    },
    tabBar: {
      marginTop: -10,
      backgroundColor: 0,
      elevation: 0
    },
    tabStyle: {
      backgroundColor: 'rgba(0,0,0,0)'
    },
    labelStyle: {
      backgroundColor: 'rgba(0,0,0,0)',
      fontSize: 13,
      padding: 0
    },
    indicatorStyle: {
      backgroundColor: constants.COLORS.primary
    }
  }),
  x = v;
exports.default = x;
