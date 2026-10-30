const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var constants = require("../theme/constants"),
  React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeSpringScrollview = require("./../components/Scrolling.js"),
  components = require("../components/index"),
  providers = _interopRequireDefault(require("../services/providers")),
  locales = _interopRequireDefault(require("../locales/index")),
  d = class n extends React.Component {
    constructor() {
      var e, t, r;
      for (var l = arguments.length, a = new Array(l), o = 0; o < l; o++) a[o] = arguments[o];
      return t = r = super(...a), r.goTo = function (e) {
        var t;
        e === providers.default.netEase ? t = 'NeteaseLogin' : e === providers.default.qqMusic && (t = 'QQMusicLogin');
        r.props.navigation.navigate(t);
      }, t;
    }
    "render"() {
      var e = this;
      return React.default.createElement(components.PageContainer, {
        title: locales.default.LOG_IN,
        goBack: function () {
          return e.props.navigation.goBack();
        },
        headerStyle: {
          marginBottom: 30
        }
      }, React.default.createElement(reactNativeSpringScrollview.SpringScrollView, null, React.default.createElement(ReactNative.View, {
        style: b.con
      }, React.default.createElement(p, {
        source: require("../../assets/images/netease.png"),
        onPress: function () {
          return e.goTo(providers.default.netEase);
        }
      }), React.default.createElement(p, {
        source: require("../../assets/images/qqmusic.png"),
        onPress: function () {
          return e.goTo(providers.default.qqMusic);
        }
      }))));
    }
  },
  p = function (e) {
    var t = e.onPress,
      n = e.source;
    return React.default.createElement(components.TouchableBorderless, {
      onPress: t,
      style: b.iconCon
    }, React.default.createElement(ReactNative.View, null, React.default.createElement(ReactNative.Image, {
      style: b.icon,
      source: n
    })));
  },
  b = ReactNative.StyleSheet.create({
    con: {
      height: constants.DEVICE_HEIGHT - (40 + constants.STATUS_BAR_HEIGHT),
      width: constants.DEVICE_WIDTH,
      alignItems: 'center',
      justifyContent: 'center'
    },
    iconCon: {
      marginBottom: 100
    },
    icon: {
      height: 35,
      width: 35
    }
  }),
  g = d;
exports.default = g;
