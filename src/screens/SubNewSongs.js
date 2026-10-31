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
  constants = require('../theme/constants'),
  icons = _interopRequireDefault(require('../theme/icons')),
  locales = _interopRequireDefault(require('../locales/index')),
  services = require('../services/index'),
  utils = require('../utils/index'),
  queue = _interopRequireDefault(require('../events/queue')),
  ArtistHeader = _interopRequireDefault(require('./../modules/ArtistHeader.js')),
  h = function (e) {
    var t = [0];
    e.forEach(function (n, r) {
      if (0 !== r) {
        var a = e[r - 1];
        utils.timeFormatter.isSameDay(n.publishTime, a.publishTime) || t.push(r);
      }
    });
    return t;
  },
  b = class t extends React.PureComponent {
    constructor() {
      var e, n, r;
      for (var a = arguments.length, l = new Array(a), c = 0; c < a; c++) l[c] = arguments[c];
      return (
        (n = r = super(...l)),
        (r.state = {
          songData: [],
          mvData: [],
          dateIds: [],
          showingMV: false,
        }),
        (r.loadSongs = async function () {
          const response = await services.Netease.sub_new_songs();
          if (Array.isArray(response?.data?.newWorks)) {
            const songData = response.data.newWorks;
            r.setState({
              songData,
              dateIds: h(songData),
            });
          }
        }),
        (r.loadMV = async function () {
          const response = await services.Netease.sub_new_mv();
          if (Array.isArray(response?.data?.newWorks))
            r.setState({
              mvData: response.data.newWorks,
            });
        }),
        (r.onTop = function () {
          var e;
          null === (e = r.scrollView) || void 0 === e || e.scrollToBegin();
        }),
        (r.onShowingMV = function () {
          r.setState({
            showingMV: !r.state.showingMV,
          });
        }),
        (r.renderSection = function (e) {
          var t = e.index,
            n = e.publishTime;
          return React.default.createElement(
            ReactNative.View,
            {
              style: [
                {
                  marginBottom: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                },
                0 !== t && {
                  marginTop: 10,
                },
              ],
            },
            React.default.createElement(
              components.Title,
              null,
              utils.timeFormatter.localeString(n),
            ),
            React.default.createElement(ReactNative.View, {
              style: {
                marginLeft: 10,
                height: 2,
                flex: 1,
                backgroundColor: constants.COLORS.primary,
                borderRadius: 5,
                alignSelf: 'center',
              },
            }),
          );
        }),
        (r.renderMV = function () {
          var e = r.state,
            t = e.mvData,
            n = e.dateIds;
          return t.map(function (e, t) {
            return React.default.createElement(
              React.default.Fragment,
              null,
              n.indexOf(t) > -1 &&
                r.renderSection({
                  index: t,
                  publishTime: e.publishTime,
                }),
              React.default.createElement(components.ListItem, {
                img: e.mvCoverUrl + '?param=200y200',
                title: e.mvName,
                subtitle: utils.timeFormatter.parseTime(e.duration / 1e3) + '  |  ' + e.artistName,
                onPress: function () {
                  return queue.default.playMV(e.mvId, 'netEase');
                },
              }),
            );
          });
        }),
        (r.renderSongs = function () {
          var e = r.state,
            t = e.songData,
            n = e.dateIds;
          return t.map(function (e, t) {
            return React.default.createElement(
              React.default.Fragment,
              null,
              n.indexOf(t) > -1 &&
                r.renderSection({
                  index: t,
                  publishTime: e.publishTime,
                }),
              React.default.createElement(ArtistHeader.default, {
                item: e,
                onAlbum: function () {
                  return r.onAlbum(e);
                },
                onArtist: function () {
                  return r.onArtist(e);
                },
              }),
            );
          });
        }),
        (r.onAlbum = function (e) {
          var t = e.songLists;
          r.props.navigation.navigate('AlbumPage', {
            item: t[0].al,
            api: 'netEase',
          });
        }),
        (r.onArtist = function (e) {
          var t = e.songLists;
          r.props.navigation.navigate('ArtistPage', {
            item: t[0].ar[0],
            api: 'netEase',
          });
        }),
        n
      );
    }
    componentDidMount() {
      this.loadSongs();
      this.loadMV();
    }
    render() {
      var e = this,
        t = this.state,
        n = t.songData,
        r = t.showingMV;
      return React.default.createElement(
        components.PageContainer,
        {
          title: r ? locales.default.ARTIST_MV : locales.default.SUB_NEW_SONGS,
          goBack: this.props.navigation.goBack,
          onTop: this.onTop,
          rightIcon: r
            ? {
                name: icons.default.MUSIC_CIRCLE_OUTLINE,
                onPress: this.onShowingMV,
              }
            : {
                name: icons.default.VIDEO_OUTLINE,
                onPress: this.onShowingMV,
              },
        },
        (null === n || void 0 === n ? void 0 : n.length) > 0
          ? React.default.createElement(
              reactNativeSpringScrollview.SpringScrollView,
              {
                style: v.container,
                ref: function (t) {
                  return (e.scrollView = t);
                },
              },
              r ? this.renderMV() : this.renderSongs(),
            )
          : React.default.createElement(components.Spinkit, null),
      );
    }
  },
  v = ReactNative.StyleSheet.create({
    container: {
      padding: 20,
    },
  }),
  S = b;
exports.default = S;
