Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeTabView = require("react-native-tab-view"),
  components = require("../components/index"),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  constants = require("../theme/constants"),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  types = require("../utils/types"),
  sections = require("./search/sections"),
  module911 = babelHelpers.interopRequireDefault(require("../modules/module-911")),
  module912 = babelHelpers.interopRequireDefault(require("../modules/module-912")),
  module880 = babelHelpers.interopRequireDefault(require("../modules/module-880")),
  module913 = babelHelpers.interopRequireDefault(require("../modules/module-913")),
  module914 = babelHelpers.interopRequireDefault(require("../modules/module-914")),
  module915 = babelHelpers.interopRequireDefault(require("../modules/module-915")),
  netease = require("../../assets/images/netease"),
  qqmusic = require("../../assets/images/qqmusic"),
  v = function (e) {
    function t() {
      var e, a, n;
      babelHelpers.classCallCheck(this, t);
      for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
      return babelHelpers.possibleConstructorReturn(n, (a = n = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(l))), n.animating = false, n.search = null, n.state = {
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
        return React.default.createElement(reactNativeTabView.TabBar, babelHelpers.extends({
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
            return React.default.createElement(module914.default, a);
          case '2':
            return React.default.createElement(module913.default, a);
          case '3':
            return React.default.createElement(module911.default, a);
          case '4':
            return React.default.createElement(module880.default, a);
          case '5':
            return React.default.createElement(module912.default, a);
        }
      }, a));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        var e = this.props.navigation.state.params;
        if (e) {
          var t = e.text;
          t && this.onChangeText(t);
        }
      }
    }, {
      key: "render",
      value: function () {
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
        })))), React.default.createElement(module915.default, {
          focusing: n,
          onRef: function (t) {
            return e._suggestion = t;
          },
          api: a,
          onSuggest: this.handleOnSuggest
        }), true === r && false === n ? React.default.createElement(reactNativeTabView.TabViewAnimated, {
          style: H.container,
          navigationState: this.state,
          renderScene: this._renderScene,
          renderHeader: this._renderHeader,
          onIndexChange: this._handleIndexChange
        }) : null);
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent),
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
