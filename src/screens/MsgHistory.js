const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  reactNativeSpringScrollview = require('./../components/Scrolling.js'),
  components = require('../components/index'),
  providers = _interopRequireDefault(require('../services/providers')),
  icons = _interopRequireDefault(require('../theme/icons')),
  services = require('../services/index'),
  events = require('../events/index'),
  utils = require('../utils/index'),
  queue = _interopRequireDefault(require('../events/queue')),
  styles = _interopRequireDefault(require('./messages/styles')),
  g = class t extends React.Component {
    constructor() {
      var e, a, r;
      for (var n = arguments.length, l = new Array(n), o = 0; o < n; o++) l[o] = arguments[o];
      return (
        (a = r = super(...l)),
        (r.state = {
          title: '……',
          data: [],
          loaded: false,
        }),
        (r.getMsgUser = async function (userId) {
          const response = await services.Netease.msg_history({
            userId,
          });
          if (response?.msgs)
            r.setState({
              data: response.msgs,
              loaded: true,
            });
        }),
        (r.onTop = function () {
          var e, t;
          null === (e = (t = r._scrollView).scrollToBegin) || void 0 === e || e.call(t);
        }),
        (r.onClosed = function () {
          r.props.navigation.goBack();
        }),
        (r.formatRow = function (e) {
          var t = JSON.parse(e.msg);
          return {
            img: e.fromUser.avatarUrl + '?param=200y200',
            title: e.fromUser.nickname,
            subtitle: t.msg,
            data: t,
            time: utils.timeFormatter.localeString(e.time),
          };
        }),
        (r.Album = function (e) {
          r.props.navigation.navigate('AlbumPage', {
            item: e,
            api: providers.default.netEase,
          });
        }),
        (r._renderItem = function (e) {
          var t = e.item,
            a = e.index,
            n = r.formatRow(t);
          return React.default.createElement(styles.default, {
            key: a,
            user: r.state.title,
            fromUser: t.fromUser.nickname,
            img: n.img,
            msg: '' !== n.subtitle ? n.subtitle : null,
            data: n.data,
            time: n.time,
            onAlbum: function () {
              return r.Album(n.data.album);
            },
            onMV: function () {
              return r.MV(n.data.mv);
            },
            onSong: function () {
              return r.Song(n.data.song);
            },
          });
        }),
        (r.MV = function (e) {
          var t = e.id;
          queue.default.playMV(t, providers.default.netEase);
        }),
        (r.Song = function (e) {
          (0, events.toPlayer)({
            item: e,
            data: [e],
            index: 0,
            api: providers.default.netEase,
            type: 'insert',
          });
        }),
        a
      );
    }
    componentDidMount() {
      var e = this.props.route.params;
      if (e) {
        var t = e.item;
        t &&
          (t.fromUser &&
            this.setState({
              title: t.fromUser.nickname,
            }),
          this.getMsgUser(t.fromUser.userId));
      }
    }
    render() {
      var e = this,
        t = this.state.data;
      return React.default.createElement(
        components.PageContainer,
        {
          goBack: this.onClosed,
          title: this.state.title,
          onTop: this.onTop,
          backIcon: {
            name: icons.default.WINDOW_CLOSE,
          },
        },
        false === this.state.loaded
          ? React.default.createElement(components.Spinkit, {
              style: {
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
              },
            })
          : null,
        React.default.createElement(
          reactNativeSpringScrollview.SpringScrollView,
          {
            ref: function (t) {
              return (e._scrollView = t);
            },
            showsVerticalScrollIndicator: false,
          },
          React.default.createElement(ReactNative.View, {
            style: {
              height: 12,
            },
          }),
          t.map(function (t, a) {
            return e._renderItem({
              item: t,
              index: a,
            });
          }),
        ),
      );
    }
  };
exports.default = g;
