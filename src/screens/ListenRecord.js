Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var l,
  React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeLargelist = require("react-native-largelist"),
  components = require("../components/index"),
  TabbedViewPager = babelHelpers.interopRequireDefault(require("../native/TabbedViewPager")),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  constants = require("../theme/constants"),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  services = require("../services/index"),
  events = require("../events/index"),
  trackInfo = require("../services/trackInfo"),
  y = [locales.default.WEEKLY, locales.default.ALL],
  g = (l = {}, babelHelpers.defineProperty(l, locales.default.WEEKLY, '1'), babelHelpers.defineProperty(l, locales.default.ALL, '2'), l),
  h = function (e) {
    return e.map(function (e) {
      e.song.playCount = e.playCount;
      return e.song;
    });
  },
  v = function (e) {
    function t() {
      var e, a, n;
      babelHelpers.classCallCheck(this, t);
      for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
      return babelHelpers.possibleConstructorReturn(n, (a = n = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(l))), n.state = {
        index: 0,
        weekData: [],
        allData: [],
        profile: {}
      }, n.init = function () {
        var e = n.props.navigation.state.params;
        if (e) {
          var t = e.profile;
          t && (n.setState({
            profile: t
          }), n.loadWeekData(t.userId), n.loadAllData(t.userId));
        }
      }, n.loadWeekData = function (e) {
        var t, a;
        return regeneratorRuntime.async(function (r) {
          for (;;) switch (r.prev = r.next) {
            case 0:
              r.next = 2;
              return regeneratorRuntime.awrap(services.Netease.listen_record(e, 1));
            case 2:
              if (!(t = r.sent)) {
                r.next = 9;
                break;
              }
              if (200 === t.code) {
                r.next = 7;
                break;
              }
              return r.abrupt("return");
            case 7:
              a = h(t.weekData);
              n.setState({
                weekData: a
              });
            case 9:
            case "end":
              return r.stop();
          }
        }, null, this);
      }, n.loadAllData = function (e) {
        var t, a;
        return regeneratorRuntime.async(function (r) {
          for (;;) switch (r.prev = r.next) {
            case 0:
              r.next = 2;
              return regeneratorRuntime.awrap(services.Netease.listen_record(e, 0));
            case 2:
              if (!(t = r.sent)) {
                r.next = 9;
                break;
              }
              if (200 === t.code) {
                r.next = 7;
                break;
              }
              return r.abrupt("return");
            case 7:
              a = h(t.allData);
              n.setState({
                allData: a
              });
            case 9:
            case "end":
              return r.stop();
          }
        }, null, this);
      }, n.handlePageSelected = function (e) {
        var t = e.nativeEvent.position;
        n.setState({
          index: t
        });
      }, n.onTop = function () {
        var e, t;
        0 === n.state.index ? null === (e = n._weekDataList) || void 0 === e || e.scrollTo({
          x: 0,
          y: 0
        }) : null === (t = n._allDataList) || void 0 === t || t.scrollTo({
          x: 0,
          y: 0
        });
      }, n.renderScenes = function (e) {
        var t = n.state,
          a = t.weekData,
          r = t.allData;
        switch (e) {
          case '1':
            return React.default.createElement(reactNativeLargelist.LargeList, {
              data: [{
                items: a
              }],
              heightForIndexPath: function () {
                return constants.ITEM_HEIGHT;
              },
              renderIndexPath: function (e) {
                var t = e.row;
                return n.renderItem({
                  item: a[t],
                  index: t,
                  dataKey: 'weekData'
                });
              },
              ref: function (e) {
                return n._weekDataList = e;
              }
            });
          case '2':
            return React.default.createElement(reactNativeLargelist.LargeList, {
              data: [{
                items: r
              }],
              heightForIndexPath: function () {
                return constants.ITEM_HEIGHT;
              },
              renderIndexPath: function (e) {
                var t = e.row;
                return n.renderItem({
                  item: r[t],
                  index: t,
                  dataKey: 'allData'
                });
              },
              ref: function (e) {
                return n._allDataList = e;
              }
            });
        }
      }, n.renderItem = function (e) {
        var t = e.item,
          a = e.index,
          r = e.dataKey,
          l = (0, trackInfo.extractFullInfo)(t),
          o = l.song,
          u = l.singer,
          d = l.alias,
          f = t.playCount ? t.playCount + " " + locales.default.TIMES : l.album;
        return React.default.createElement(components.SongRow, {
          index: a,
          song: o,
          singer: u,
          alias: d,
          album: f,
          onPress: function () {
            return n.playMusic({
              item: t,
              index: a,
              dataKey: r
            });
          },
          detail: function () {
            return (0, events.toDetailModal)({
              item: t,
              index: a,
              api: providers.default.netEase
            });
          },
          addToQueue: function () {
            return (0, events.toInsertToList)({
              data: t,
              api: providers.default.netEase
            });
          },
          songItem: t
        });
      }, n.playMusic = function (e) {
        var t = e.item,
          a = e.index,
          r = e.dataKey,
          l = n.state[r];
        l.length > 0 && (0, events.toPlayer)({
          item: t,
          data: l,
          index: a,
          api: providers.default.netEase
        });
      }, a));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        this.init();
      }
    }, {
      key: "render",
      value: function () {
        var e = this;
        return React.default.createElement(ReactNative.View, {
          style: D.container
        }, React.default.createElement(components.Background, null), React.default.createElement(components.HeaderBar, {
          title: locales.default.LISTEN_RECORD,
          goBack: this.props.navigation.goBack,
          onTop: this.onTop
        }), React.default.createElement(ReactNative.View, {
          style: D.content
        }, React.default.createElement(TabbedViewPager.default, {
          tabNames: y,
          onPageSelected: this.handlePageSelected
        }, y.map(function (t, a) {
          return React.default.createElement(ReactNative.View, {
            key: a,
            style: {
              flex: 1,
              paddingBottom: 50
            }
          }, e.renderScenes(g[t]));
        }))));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = v;
var D = ReactNative.StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1
  }
});
