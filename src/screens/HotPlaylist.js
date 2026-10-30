Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  reactNativeLargelist = require("react-native-largelist"),
  components = require("../components/index"),
  module821 = babelHelpers.interopRequireDefault(require("../modules/module-821")),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  constants = require("../theme/constants"),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  module880 = babelHelpers.interopRequireDefault(require("../modules/module-880")),
  services = require("../services/index"),
  module883 = babelHelpers.interopRequireDefault(require("../modules/module-883")),
  g = '\u5168\u90e8\u6b4c\u5355',
  m = function (e) {
    function t() {
      var e, a, n;
      babelHelpers.classCallCheck(this, t);
      for (var i = arguments.length, o = new Array(i), s = 0; s < i; s++) o[s] = arguments[s];
      return babelHelpers.possibleConstructorReturn(n, (a = n = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(o))), n._savedType = null, n.onTop = function () {
        var e;
        null === (e = n._list) || void 0 === e || e.scrollTo({
          x: 0,
          y: 0
        });
      }, n.state = {
        data: [],
        loading: true,
        mainModalShow: false,
        type: g,
        page: 0,
        search: ''
      }, n.getPlaylists = function (e) {
        services.Netease.topPlaylist({
          category: e
        }).then(function (e) {
          var t,
            a,
            i = e.code,
            r = e.playlists;
          200 === i && r.length > 0 && n.setState({
            data: r,
            loading: false
          });
          null === (t = (a = n._list).endLoading) || void 0 === t || t.call(a);
        });
      }, n.getMore = function () {
        n.setState({
          page: n.state.page + 1
        }, function () {
          var e = n.state.page;
          n.morePlaylists(n.state.type, e);
        });
      }, n.morePlaylists = function (e, t) {
        services.Netease.topPlaylist({
          category: e,
          offset: 30 * t
        }).then(function (e) {
          var t,
            a,
            i = e.code,
            r = e.playlists;
          200 === i && r && n.setState({
            data: n.state.data.concat(r),
            loading: false
          });
          null === (t = (a = n._list).endLoading) || void 0 === t || t.call(a);
        });
      }, n.onType = function (e) {
        n.setState({
          type: e,
          mainModalShow: false,
          loading: true,
          data: [],
          search: ''
        });
        n.getPlaylists(e);
        n.onTop();
      }, n.Playlist = function (e) {
        n.props.navigation.navigate('Playlist', {
          api: providers.default.netEase,
          playlist: e
        });
      }, n.onChangeText = function (e) {
        n.setState({
          search: e
        });
      }, n.onSubmitEditing = function () {
        var e = n.state.search;
        if ((null === e || void 0 === e ? void 0 : e.length) > 0) {
          if (!n._searcher) return;
          n._searcher.fetchData(e);
        }
      }, n.onSearch = function () {
        n._savedType = n.state.type;
        n.setState({
          type: 'search',
          mainModalShow: false
        });
      }, n.formatItem = function (e) {
        var t,
          a = {};
        a.title = e.name;
        a.subtitle = (null === (t = e.creator) || void 0 === t ? void 0 : t.nickname) + ' | ' + e.playCount;
        a.img = e.coverImgUrl + '?param=150y150';
        return a;
      }, n._renderIndexPath = function (e) {
        var t = e.row,
          a = n.state.data;
        return n._renderItem({
          item: a[t],
          index: t
        });
      }, n._renderItem = function (e) {
        var t = e.item,
          a = e.index,
          i = n.formatItem(t);
        return React.default.createElement(components.ListItem, {
          key: a,
          title: i.title,
          subtitle: i.subtitle,
          img: i.img,
          onPress: function () {
            return n.Playlist(t, providers.default.netEase);
          }
        });
      }, a));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        this.getPlaylists();
      }
    }, {
      key: "render",
      value: function () {
        var e = this,
          t = this.state,
          a = t.loading,
          n = t.type,
          i = t.data,
          f = t.mainModalShow,
          g = t.search;
        return React.default.createElement(components.PageContainer, {
          goBack: function () {
            return e.props.navigation.goBack();
          },
          onTop: this.onTop,
          title: n,
          rightIcon: {
            name: icons.default.TAG_OUTLINE,
            onPress: function () {
              return e.setState({
                mainModalShow: !f
              });
            }
          },
          textInput: 'search' === n,
          onChangeText: this.onChangeText,
          onSubmitEditing: this.onSubmitEditing,
          searchText: g,
          forceShowTextInput: 'search' === n,
          disabledTextInputBtn: true,
          headerBlur: true
        }, a && React.default.createElement(components.Spinkit, {
          style: {
            position: 'absolute',
            top: 100,
            bottom: 0,
            left: 0,
            right: 0
          }
        }), 'search' === n ? React.default.createElement(module880.default, {
          api: providers.default.netEase,
          onRef: function (t) {
            return e._searcher = t;
          },
          navigation: this.props.navigation
        }) : React.default.createElement(reactNativeLargelist.LargeList, {
          ref: function (t) {
            return e._list = t;
          },
          data: [{
            items: i
          }],
          onLoading: this.getMore,
          loadingFooter: module821.default,
          renderIndexPath: this._renderIndexPath,
          heightForIndexPath: function () {
            return constants.ITEM_HEIGHT;
          }
        }), React.default.createElement(module883.default, {
          visible: f,
          onClose: function () {
            return e.setState({
              mainModalShow: false
            });
          },
          onType: this.onType,
          currentType: n,
          onSearch: this.onSearch
        }));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = m;
