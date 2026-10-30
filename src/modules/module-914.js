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
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  services = require("../services/index"),
  events = require("../events/index"),
  utils = require("../utils/index"),
  trackInfo = require("../services/trackInfo"),
  searchTypes = babelHelpers.interopRequireDefault(require("../services/searchTypes")),
  m = function (e) {
    function t() {
      var e, a, r;
      babelHelpers.classCallCheck(this, t);
      for (var n = arguments.length, o = new Array(n), i = 0; i < n; i++) o[i] = arguments[i];
      return babelHelpers.possibleConstructorReturn(r, (a = r = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(o))), r.state = {
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
            services.Netease.cloud_search({
              keywords: t,
              offset: a
            }).then(function (e) {
              var t = e.result.songs;
              r.setState({
                data: babelHelpers.toConsumableArray(r.state.data).concat(babelHelpers.toConsumableArray(t))
              });
              r.endLoading();
            });
            break;
          case providers.default.qqMusic:
            services.QQMusic.searchSong(t, a / 30 + 1).then(function (e) {
              r.setState({
                data: babelHelpers.toConsumableArray(r.state.data).concat(babelHelpers.toConsumableArray(e))
              });
              r.endLoading();
            });
        }
      }, r.getMore = function () {
        var e = r.props,
          t = e.search,
          a = e.api,
          n = r.state.data.length;
        r.fetchAPI(a, t, n);
      }, r.endLoading = function () {
        var e, t;
        null === (e = (t = r._list).endLoading) || void 0 === e || e.call(t);
      }, r._renderIndexPath = function (e) {
        var t = e.row,
          a = r.state.data[t],
          n = (0, trackInfo.extractFullInfo)(a);
        return React.default.createElement(components.SongRow, {
          song: n.song,
          album: '\u7a7a' === n.album ? '' : n.album,
          singer: n.singer,
          img: n.img,
          onPress: function () {
            return r.playMusic(a, t);
          },
          detail: function () {
            return r.onDetail(a, t);
          },
          addToQueue: function () {
            return r.addToQueue(a);
          },
          alias: (0, utils.delve)(a, 'tns.0'),
          round: true,
          songItem: a
        });
      }, r.addToQueue = function (e) {
        var t;
        if ((null === (t = e.album) || void 0 === t ? void 0 : t.id) < 1) toast(locales.default.MUSIC_CAN_NOT_PLAY);else {
          var a = r.props.api;
          (0, events.toInsertToList)({
            data: e,
            api: a
          });
        }
      }, r.onDetail = function (e, t) {
        var a;
        if ((null === (a = e.album) || void 0 === a ? void 0 : a.id) < 1) toast(locales.default.MUSIC_CAN_NOT_PLAY);else {
          var n = r.props.api;
          (0, events.toDetailModal)({
            item: e,
            index: t,
            api: n
          });
        }
      }, r.playMusic = function (e, t) {
        var a;
        if ((null === (a = e.album) || void 0 === a ? void 0 : a.id) < 1) toast(locales.default.MUSIC_CAN_NOT_PLAY);else {
          var n = r.props.api,
            l = r.state.data;
          (0, events.toPlayer)({
            item: e,
            data: l,
            index: t,
            api: n,
            type: 'insert'
          });
        }
      }, a));
    }
    babelHelpers.createClass(t, [{
      key: "UNSAFE_componentWillReceiveProps",
      value: function (e) {
        var t = e.index,
          a = e.search;
        t === searchTypes.default.songs && this.state.preSearch !== a && this.fetchData(a);
      }
    }, {
      key: "render",
      value: function () {
        var e = this,
          t = this.state.data;
        return t.length < 1 ? React.default.createElement(components.Spinkit, null) : React.default.createElement(ReactNative.View, {
          style: _.container
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
  _ = ReactNative.StyleSheet.create({
    container: {
      flex: 1
    }
  }),
  y = m;
exports.default = y;
