Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireDefault(require("react")),
  ReactNative = require("react-native"),
  components = require("../components/index"),
  constants = require("../theme/constants"),
  u = .65 * constants.DEVICE_WIDTH,
  f = ReactNative.StyleSheet.create({
    songTitleCon: {
      flex: 1,
      width: constants.DEVICE_WIDTH,
      justifyContent: 'center',
      alignItems: 'center'
    },
    songTitle: {
      fontSize: 16,
      fontWeight: 'bold'
    },
    songAuthor: {
      opacity: .7
    },
    alias: {
      marginLeft: 15,
      fontSize: 13,
      color: 'rgba(255,255,255,0.7)',
      fontWeight: 'normal'
    }
  }),
  c = function (e) {
    var t = e.title,
      l = e.subtitle,
      n = e.viewStyle,
      i = e.titleStyle,
      s = e.authorStyle,
      c = e.onPress,
      d = e.alias,
      g = e.numberOfLines;
    return React.default.createElement(ReactNative.View, {
      accessible: false,
      style: [n || f.songTitleCon, c && {
        justifyContent: 'center',
        alignItems: 'center'
      }]
    }, t ? React.default.createElement(ReactNative.Text, {
      style: [f.songTitle, ReactNative.StyleSheet.flatten(i)],
      numberOfLines: g || 1
    }, t, d && React.default.createElement(ReactNative.Text, {
      style: f.alias
    }, " (", d, ")")) : null, (null === l || void 0 === l ? void 0 : l.length) > 0 ? React.default.createElement(ReactNative.Text, {
      numberOfLines: g || 1,
      style: [f.songAuthor, ReactNative.StyleSheet.flatten(s)]
    }, l) : null, Boolean(c) && React.default.createElement(components.TouchableBorderless, {
      onPress: c,
      style: {
        position: 'absolute',
        padding: 50
      },
      size: u
    }, React.default.createElement(ReactNative.View, {
      style: {
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0)',
        flex: 1
      }
    })));
  };
exports.default = c;
