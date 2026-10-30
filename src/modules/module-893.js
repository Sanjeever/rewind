Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireDefault(require("react")),
  ReactNative = require("react-native"),
  TouchableScale = babelHelpers.interopRequireDefault(require("../components/TouchableScale")),
  components = require("../components/index"),
  constants = require("../theme/constants"),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  events = require("../events/index"),
  utils = require("../utils/index"),
  trackInfo = require("../services/trackInfo"),
  g = function (e, t) {
    var a = (0, trackInfo.extractFullInfo)(e);
    return React.default.createElement(components.SongRow, {
      key: t,
      index: null,
      song: a.song,
      singer: utils.timeFormatter.parseTime(e.dt / 1e3),
      album: a.album,
      alias: a.alias,
      containerStyle: {
        height: 55
      },
      onPress: function () {
        return (0, events.toPlayer)({
          item: e,
          data: [e],
          index: t,
          api: 'netEase',
          type: 'insert'
        });
      },
      detail: function () {
        return (0, events.toDetailModal)({
          item: e,
          index: t,
          api: 'netEase'
        });
      }
    });
  },
  p = function (e) {
    var t = e.item,
      a = e.onAlbum,
      n = t.blockTitle,
      l = t.songLists,
      i = l.reduce(function (e, t) {
        return e + t.dt;
      }, 0),
      o = utils.timeFormatter.parseTime(i / 1e3) + "  |  " + l.length + " " + locales.default.SONG_COUNT + " ";
    return React.default.createElement(y, {
      title: n.resourceName,
      subtitle: o,
      onPage: a,
      onPress: function () {
        return (0, events.toPlayer)({
          item: l[0],
          data: l,
          index: 0,
          api: 'netEase',
          type: l.length > 1 ? '' : 'insert'
        });
      }
    });
  },
  y = function (e) {
    var t = e.title,
      a = e.subtitle,
      n = e.onPress,
      l = e.onPage;
    return React.default.createElement(ReactNative.TouchableNativeFeedback, {
      onPress: n
    }, React.default.createElement(ReactNative.View, {
      style: E.albumCon
    }, React.default.createElement(ReactNative.View, {
      style: {
        flex: 1
      }
    }, React.default.createElement(ReactNative.Text, {
      style: {
        fontSize: 15
      },
      numberOfLines: 1
    }, t), React.default.createElement(ReactNative.Text, {
      style: {
        fontSize: 12,
        opacity: .8
      },
      numberOfLines: 1
    }, a)), React.default.createElement(components.Icon, {
      containerStyle: {
        height: 50,
        width: 50
      },
      onPress: l,
      size: 20,
      name: icons.default.ALBUM,
      component: TouchableScale.default
    })));
  },
  E = ReactNative.StyleSheet.create({
    container: {
      paddingBottom: 10
    },
    avatarCon: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    avatar: {
      height: 40,
      width: 40,
      borderRadius: 20,
      marginRight: 10,
      borderWidth: 1,
      borderColor: constants.COLORS.primary
    },
    songsCon: {
      paddingLeft: 45
    },
    timeline: {
      width: 2,
      height: '100%',
      position: 'absolute',
      backgroundColor: constants.COLORS.primary,
      borderRadius: 5,
      top: 0,
      left: 20
    },
    albumCon: {
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 5
    }
  }),
  h = function (e) {
    var t,
      a,
      n,
      l = e.item,
      s = e.onAlbum,
      d = e.onArtist,
      f = l.blockType,
      c = l.blockTitle;
    return React.default.createElement(ReactNative.View, null, React.default.createElement(ReactNative.View, {
      style: E.timeline
    }), React.default.createElement(ReactNative.View, {
      style: E.container
    }, React.default.createElement(ReactNative.View, {
      style: E.avatarCon
    }, React.default.createElement(TouchableScale.default, {
      onPress: d
    }, React.default.createElement(ReactNative.Image, {
      style: E.avatar,
      source: {
        uri: c.imgUrl + '?param=100y100'
      }
    })), React.default.createElement(ReactNative.View, null, React.default.createElement(components.Title, {
      style: {
        fontSize: 15
      }
    }, c.artistName), React.default.createElement(ReactNative.Text, {
      style: {
        opacity: .8,
        fontSize: 13
      }
    }, (n = 'song' === f ? null === (t = locales.default.ARTIST_SONGS) || void 0 === t ? void 0 : t.toLowerCase() : null === (a = locales.default.ARTIST_ALBUM) || void 0 === a ? void 0 : a.toLowerCase(), "" + locales.default.PUBLISHED + n)))), React.default.createElement(ReactNative.View, {
      style: E.songsCon
    }, 'song' === f ? l.songLists.map(g) : p({
      item: l,
      onAlbum: s
    }))));
  };
exports.default = h;
