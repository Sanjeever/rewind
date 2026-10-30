Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeLargelist = require("react-native-largelist"),
  components = require("../components/index"),
  ParallaxList = babelHelpers.interopRequireDefault(require("../components/ParallaxList")),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  constants = require("../theme/constants"),
  services = require("../services/index"),
  queue = babelHelpers.interopRequireDefault(require("../events/queue")),
  trackDescription = babelHelpers.interopRequireDefault(require("../services/trackDescription")),
  searchTypes = babelHelpers.interopRequireDefault(require("../services/searchTypes")),
  v = function (e) {
    function t() {
      var e, a, r;
      babelHelpers.classCallCheck(this, t);
      for (var l = arguments.length, i = new Array(l), s = 0; s < l; s++) i[s] = arguments[s];
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
      }, r.fetchAPI = function (e, t, a) {
        switch (e) {
          case providers.default.netEase:
            services.Netease.search({
              keywords: t,
              type: 1004,
              offset: a
            }).then(function (e) {
              var t = e.result.mvs;
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
              type: 'mv',
              page: a / 30 + 1
            }).then(function (e) {
              var t = e.mv.list;
              if ((null === t || void 0 === t ? void 0 : t.length) > 0) {
                var a = r.formatAllData(t);
                r.setState({
                  data: babelHelpers.toConsumableArray(r.state.data).concat(babelHelpers.toConsumableArray(a))
                });
              }
              r.endLoading();
            });
        }
      }, r.getMore = function () {
        var e = r.props,
          t = e.api,
          a = e.search,
          l = r.state.data.length;
        r.fetchAPI(t, a, l);
      }, r.formatAllData = function (e) {
        for (var t = r.props.api, a = [], l = 0; l < e.length; l++) {
          var n = e[l],
            i = (0, trackDescription.default)({
              item: n,
              api: t,
              page: searchTypes.default.mvs
            });
          i.initItem = n;
          a.push(i);
        }
        return a;
      }, r.endLoading = function () {
        var e, t;
        null === (e = (t = r._list).endLoading) || void 0 === e || e.call(t);
      }, r._renderIndexPath = function (e) {
        var t = e.row,
          a = r.state.data[t];
        return React.default.createElement(components.ListItem, {
          title: a.title,
          subtitle: a.subtitle,
          img: a.img,
          onPress: function () {
            return r.playMV(a.initItem);
          }
        });
      }, r.playMV = function (e) {
        var t = r.props.api,
          a = t === providers.default.netEase ? e.id : e.v_id;
        queue.default.playMV(a, t);
      }, a));
    }
    babelHelpers.createClass(t, [{
      key: "UNSAFE_componentWillReceiveProps",
      value: function (e) {
        var t = e.index,
          a = e.search;
        t === searchTypes.default.mvs && this.state.preSearch !== a && this.fetchData(a);
      }
    }, {
      key: "render",
      value: function () {
        var e = this,
          t = this.state.data;
        return t.length < 1 ? React.default.createElement(components.Spinkit, null) : React.default.createElement(ReactNative.View, {
          style: m.container
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
          loadingFooter: ParallaxList.default
        }));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent),
  m = ReactNative.StyleSheet.create({
    container: {
      flex: 1
    }
  }),
  g = v;
exports.default = g;
