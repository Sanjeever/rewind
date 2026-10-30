Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeLargelist = require("react-native-largelist"),
  components = require("../components/index"),
  module821 = babelHelpers.interopRequireDefault(require("./module-821")),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  constants = require("../theme/constants"),
  services = require("../services/index"),
  module881 = babelHelpers.interopRequireDefault(require("./module-881")),
  searchTypes = babelHelpers.interopRequireDefault(require("../services/searchTypes")),
  b = function (e) {
    function t() {
      var e, a, r;
      babelHelpers.classCallCheck(this, t);
      for (var n = arguments.length, i = new Array(n), s = 0; s < n; s++) i[s] = arguments[s];
      return babelHelpers.possibleConstructorReturn(r, (a = r = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(i))), r.state = {
        data: [],
        loaded: false,
        preSearch: ''
      }, r.fetchData = function (e) {
        var t = r.props.api;
        e && (r.setState({
          data: [],
          loaded: true,
          preSearch: e
        }), r.fetchAPI(t, e));
      }, r.fetchAPI = function (e, t) {
        var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
        switch (e) {
          case providers.default.netEase:
            services.Netease.search({
              keywords: t,
              type: 100,
              offset: a
            }).then(function (e) {
              var t = e.result.artists;
              if ((null === t || void 0 === t ? void 0 : t.length) > 0) {
                var a = r.formatAllData(t);
                r.setState({
                  data: babelHelpers.toConsumableArray(r.state.data).concat(babelHelpers.toConsumableArray(a))
                });
              }
              r.endLoading();
            });
            break;
          case providers.default.qqMusic:
            services.QQMusic.search({
              keywords: t,
              type: 'singer',
              page: a / 30 + 1
            }).then(function (e) {
              var t = e.singer.list;
              if ((null === t || void 0 === t ? void 0 : t.length) > 0) {
                var a = r.formatAllData(t);
                t && r.setState({
                  data: babelHelpers.toConsumableArray(r.state.data).concat(babelHelpers.toConsumableArray(a))
                });
              }
              r.endLoading();
            });
        }
      }, r.formatAllData = function (e) {
        for (var t = r.props.api, a = [], n = 0; n < e.length; n++) {
          var l = e[n],
            i = (0, module881.default)({
              item: l,
              api: t,
              page: searchTypes.default.singers
            });
          i.initItem = l;
          a.push(i);
        }
        return a;
      }, r.getMore = function () {
        var e = r.props,
          t = e.search,
          a = e.api,
          n = r.state.data.length;
        r.fetchAPI(a, t, n);
      }, r.endLoading = function () {
        var e, t;
        null === (e = (t = r._list).endLoading) || void 0 === e || e.call(t);
      }, r.goToArtistPage = function (e) {
        var t = r.props.api;
        r.props.navigation.navigate('ArtistPage', {
          item: e.initItem,
          api: t
        });
      }, r._renderIndexPath = function (e) {
        var t = e.row,
          a = r.state.data[t];
        return React.default.createElement(components.ListItem, {
          img: a.img,
          title: a.title,
          subtitle: a.subtitle,
          trans: a.trans,
          onPress: function () {
            return r.goToArtistPage(a);
          }
        });
      }, a));
    }
    babelHelpers.createClass(t, [{
      key: "UNSAFE_componentWillReceiveProps",
      value: function (e) {
        var t = e.index,
          a = e.search;
        t === searchTypes.default.singers && this.state.preSearch !== a && this.fetchData(a);
      }
    }, {
      key: "render",
      value: function () {
        var e = this,
          t = this.state.data;
        return t.length < 1 ? React.default.createElement(components.Spinkit, null) : React.default.createElement(ReactNative.View, {
          style: g.container
        }, React.default.createElement(reactNativeLargelist.LargeList, {
          ref: function (t) {
            return e._list = t;
          },
          data: [{
            items: t
          }],
          heightForIndexPath: function () {
            return constants.ITEM_HEIGHT;
          },
          renderIndexPath: this._renderIndexPath,
          onLoading: this.getMore,
          loadingFooter: module821.default
        }));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent),
  g = ReactNative.StyleSheet.create({
    container: {
      flex: 1
    }
  }),
  v = b;
exports.default = v;
