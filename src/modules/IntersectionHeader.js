const _default = require("./../components/Text.js").default;
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireDefault(require("react")),
  ReactNative = require("react-native"),
  TouchableScale = _interopRequireDefault(require("../components/TouchableScale")),
  components = require("../components/index"),
  icons = _interopRequireDefault(require("../theme/icons")),
  locales = _interopRequireDefault(require("../locales/index")),
  f = ReactNative.StyleSheet.create({
    header: {
      paddingHorizontal: 15,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      marginBottom: 15
    },
    center: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    cover: {
      height: 100,
      width: 100,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: '#fff'
    }
  }),
  s = function (e) {
    var t = e.left,
      l = e.right,
      r = e.onChangePlaylist,
      a = e.iLength,
      s = e.type,
      m = e.toggleType;
    return React.default.createElement(ReactNative.View, {
      style: f.header
    }, t ? React.default.createElement(ReactNative.Image, {
      style: f.cover,
      source: {
        uri: null === t || void 0 === t ? void 0 : t.coverImgUrl
      }
    }) : React.default.createElement(ReactNative.View, {
      style: [f.cover]
    }), React.default.createElement(ReactNative.View, {
      style: {
        width: 80,
        alignItems: 'center'
      }
    }, React.default.createElement(components.Icon, {
      name: 'intersection' === s ? icons.default.INTERSECTION : icons.default.DIFFERENCE,
      size: 30,
      onPress: m
    }), React.default.createElement(_default, {
      style: {
        marginTop: 5
      }
    }, a + " " + locales.default.SONG_COUNT)), React.default.createElement(TouchableScale.default, {
      onPress: r
    }, l ? React.default.createElement(ReactNative.Image, {
      style: f.cover,
      source: {
        uri: null === l || void 0 === l ? void 0 : l.coverImgUrl
      }
    }) : React.default.createElement(ReactNative.View, {
      style: [f.cover, f.center]
    }, React.default.createElement(_default, null, locales.default.NULL))));
  };
exports.default = s;
