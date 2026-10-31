const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireWildcard(require('react')),
  reactNativeSpringScrollview = require('./../components/Scrolling.js'),
  components = require('../components/index'),
  providers = _interopRequireDefault(require('../services/providers')),
  locales = _interopRequireDefault(require('../locales/index')),
  services = require('../services/index'),
  utils = require('../utils/index'),
  playlists = _interopRequireDefault(require('../storage/playlists')),
  users = _interopRequireDefault(require('../storage/users')),
  b = class t extends React.PureComponent {
    constructor() {
      var e, r, n;
      for (var a = arguments.length, i = new Array(a), b = 0; b < a; b++) i[b] = arguments[b];
      return (
        (r = n = super(...i)),
        (n.state = {
          data: [],
          loading: true,
        }),
        (n.onTop = function () {
          var e, t;
          null === (e = (t = n._scrollView).scrollToBegin) || void 0 === e || e.call(t);
        }),
        (n.getCharts = async function () {
          try {
            const response = await services.Netease.charts();
            if (response?.code !== 200) throw new Error(response?.message || locales.default.ERROR);
            const stored = await users.default.getCharts();
            n.setState({
              data: stored?.length === response.list.length ? stored : response.list,
            });
          } catch (error) {
            toast(error.message);
          } finally {
            n.setState({
              loading: false,
            });
          }
        }),
        (n._renderItem = function (e) {
          var t = e.item,
            r = e.index;
          return React.default.createElement(components.ListItem, {
            key: r,
            img: t.coverImgUrl + '?param=200y200',
            title: t.name,
            subtitle: t.trackCount + ' ' + locales.default.SONG_COUNT,
            onPress: function () {
              return n.Playlist(t, r);
            },
          });
        }),
        (n.Playlist = function (e, t) {
          n.collect(t);
          n.props.navigation.navigate('Playlist', {
            playlist: e,
            api: providers.default.netEase,
          });
        }),
        (n.collect = function (e) {
          var t = n.state.data;
          playlists.default.collectCharts({
            list: t,
            index: e,
          });
          n.getCharts();
        }),
        r
      );
    }
    componentDidMount() {
      this.getCharts();
    }
    render() {
      var e = this,
        t = this.state,
        r = t.loading,
        n = t.data;
      return React.default.createElement(
        components.PageContainer,
        {
          goBack: function () {
            return e.props.navigation.goBack();
          },
          onTop: this.onTop,
          title: locales.default.CHARTS,
        },
        r &&
          React.default.createElement(components.Spinkit, {
            style: {
              position: 'absolute',
              top: 100,
              bottom: 0,
              left: 0,
              right: 0,
            },
          }),
        React.default.createElement(
          reactNativeSpringScrollview.SpringScrollView,
          {
            ref: function (t) {
              return (e._scrollView = t);
            },
          },
          n.map(function (t, r) {
            return e._renderItem({
              item: t,
              index: r,
            });
          }),
        ),
      );
    }
  };
exports.default = b;
