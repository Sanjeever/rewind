Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireDefault(require("react")),
  ReactNative = require("react-native"),
  components = require("../../components/index"),
  utils = require("../../utils/index"),
  d = ReactNative.StyleSheet.create({
    msgItemCon: {
      minHeight: 100,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 5
    },
    text: {
      color: '#fff',
      opacity: .8,
      fontSize: 14
    },
    content: {
      padding: 10,
      flex: 1
    },
    msg: {
      marginBottom: 5
    },
    albumItem: {
      height: 70,
      padding: 5,
      marginTop: 5,
      marginBottom: 5,
      borderRadius: 5,
      borderWidth: ReactNative.StyleSheet.hairlineWidth,
      borderColor: '#eee'
    },
    mvItem: {
      height: 130,
      padding: 5,
      marginTop: 5,
      marginBottom: 5,
      borderRadius: 5,
      borderWidth: ReactNative.StyleSheet.hairlineWidth,
      borderColor: '#eee'
    }
  }),
  g = function (e) {
    var t = e.msg,
      l = e.data,
      n = e.time,
      i = e.onAlbum,
      g = e.onMV,
      u = e.onSong,
      s = e.user,
      f = e.fromUser;
    return React.default.createElement(ReactNative.View, {
      style: [d.msgItemCon, s !== f && {
        alignSelf: 'flex-end'
      }]
    }, React.default.createElement(ReactNative.View, {
      style: [d.content, s !== f && {
        minWidth: 100
      }]
    }, React.default.createElement(ReactNative.Text, {
      style: [d.text, d.msg, s !== f && {
        alignSelf: 'flex-end'
      }]
    }, t), 2 === l.type ? React.default.createElement(components.SettingItem, {
      coverImg: l.album.picUrl + '?param=200y200',
      itemHeight: 70,
      title: l.album.name,
      subtitle: (0, utils.parseArtist)(l.album.artists),
      containerStyle: d.albumItem,
      onPress: i
    }) : null, 7 === l.type ? React.default.createElement(components.SettingItem, {
      coverImg: l.mv.imgurl + '?param=200y200',
      coverImgStyle: {
        height: '90%',
        width: '50%'
      },
      itemHeight: 130,
      title: l.mv.name,
      subtitle: l.mv.artistName,
      containerStyle: d.mvItem,
      onPress: g
    }) : null, 1 === l.type ? React.default.createElement(components.SettingItem, {
      coverImg: l.song.album.picUrl + '?param=200y200',
      itemHeight: 70,
      title: l.song.name,
      subtitle: l.song.album.name,
      containerStyle: d.albumItem,
      onPress: u
    }) : null, React.default.createElement(ReactNative.Text, {
      style: [d.text, {
        fontSize: 12,
        color: '#eee',
        alignSelf: 'flex-end'
      }]
    }, n)));
  };
exports.default = g;
