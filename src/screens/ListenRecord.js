const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
const _defineProperty = require('@babel/runtime/helpers/defineProperty');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var l,
  React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  reactNativeLargelist = require('./../components/Scrolling.js'),
  components = require('../components/index'),
  TabbedViewPager = _interopRequireDefault(require('../native/TabbedViewPager')),
  providers = _interopRequireDefault(require('../services/providers')),
  constants = require('../theme/constants'),
  locales = _interopRequireDefault(require('../locales/index')),
  services = require('../services/index'),
  events = require('../events/index'),
  trackInfo = require('../services/trackInfo'),
  y = [locales.default.WEEKLY, locales.default.ALL],
  g =
    ((l = {}),
    _defineProperty(l, locales.default.WEEKLY, '1'),
    _defineProperty(l, locales.default.ALL, '2'),
    l),
  h = function (e) {
    return e.map(function (e) {
      e.song.playCount = e.playCount;
      return e.song;
    });
  },
  v = class t extends React.PureComponent {
    constructor() {
      var e, a, n;
      for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
      return (
        (a = n = super(...l)),
        (n.state = {
          index: 0,
          weekData: [],
          allData: [],
          profile: {},
        }),
        (n.init = function () {
          var e = n.props.route.params;
          if (e) {
            var t = e.profile;
            t &&
              (n.setState({
                profile: t,
              }),
              n.loadWeekData(t.userId),
              n.loadAllData(t.userId));
          }
        }),
        (n.loadWeekData = async function (id) {
          const response = await services.Netease.listen_record(id, 1);
          if (response?.code === 200)
            n.setState({
              weekData: h(response.weekData),
            });
        }),
        (n.loadAllData = async function (id) {
          const response = await services.Netease.listen_record(id, 0);
          if (response?.code === 200)
            n.setState({
              allData: h(response.allData),
            });
        }),
        (n.handlePageSelected = function (e) {
          var t = e.nativeEvent.position;
          n.setState({
            index: t,
          });
        }),
        (n.onTop = function () {
          var e, t;
          0 === n.state.index
            ? null === (e = n._weekDataList) ||
              void 0 === e ||
              e.scrollTo({
                x: 0,
                y: 0,
              })
            : null === (t = n._allDataList) ||
              void 0 === t ||
              t.scrollTo({
                x: 0,
                y: 0,
              });
        }),
        (n.renderScenes = function (e) {
          var t = n.state,
            a = t.weekData,
            r = t.allData;
          switch (e) {
            case '1':
              return React.default.createElement(reactNativeLargelist.LargeList, {
                data: [
                  {
                    items: a,
                  },
                ],
                heightForIndexPath: function () {
                  return constants.ITEM_HEIGHT;
                },
                renderIndexPath: function (e) {
                  var t = e.row;
                  return n.renderItem({
                    item: a[t],
                    index: t,
                    dataKey: 'weekData',
                  });
                },
                ref: function (e) {
                  return (n._weekDataList = e);
                },
              });
            case '2':
              return React.default.createElement(reactNativeLargelist.LargeList, {
                data: [
                  {
                    items: r,
                  },
                ],
                heightForIndexPath: function () {
                  return constants.ITEM_HEIGHT;
                },
                renderIndexPath: function (e) {
                  var t = e.row;
                  return n.renderItem({
                    item: r[t],
                    index: t,
                    dataKey: 'allData',
                  });
                },
                ref: function (e) {
                  return (n._allDataList = e);
                },
              });
          }
        }),
        (n.renderItem = function (e) {
          var t = e.item,
            a = e.index,
            r = e.dataKey,
            l = (0, trackInfo.extractFullInfo)(t),
            o = l.song,
            u = l.singer,
            d = l.alias,
            f = t.playCount ? t.playCount + ' ' + locales.default.TIMES : l.album;
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
                dataKey: r,
              });
            },
            detail: function () {
              return (0, events.toDetailModal)({
                item: t,
                index: a,
                api: providers.default.netEase,
              });
            },
            addToQueue: function () {
              return (0, events.toInsertToList)({
                data: t,
                api: providers.default.netEase,
              });
            },
            songItem: t,
          });
        }),
        (n.playMusic = function (e) {
          var t = e.item,
            a = e.index,
            r = e.dataKey,
            l = n.state[r];
          l.length > 0 &&
            (0, events.toPlayer)({
              item: t,
              data: l,
              index: a,
              api: providers.default.netEase,
            });
        }),
        a
      );
    }
    componentDidMount() {
      this.init();
    }
    render() {
      var e = this;
      return React.default.createElement(
        ReactNative.View,
        {
          style: D.container,
        },
        React.default.createElement(components.Background, null),
        React.default.createElement(components.HeaderBar, {
          title: locales.default.LISTEN_RECORD,
          goBack: this.props.navigation.goBack,
          onTop: this.onTop,
        }),
        React.default.createElement(
          ReactNative.View,
          {
            style: D.content,
          },
          React.default.createElement(
            TabbedViewPager.default,
            {
              tabNames: y,
              onPageSelected: this.handlePageSelected,
            },
            y.map(function (t, a) {
              return React.default.createElement(
                ReactNative.View,
                {
                  key: a,
                  style: {
                    flex: 1,
                    paddingBottom: 50,
                  },
                },
                e.renderScenes(g[t]),
              );
            }),
          ),
        ),
      );
    }
  };
exports.default = v;
var D = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
