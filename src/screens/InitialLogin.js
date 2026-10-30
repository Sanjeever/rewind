Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var constants = require("../theme/constants"),
  React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeSpringScrollview = require("react-native-spring-scrollview"),
  components = require("../components/index"),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  d = function (e) {
    function n() {
      var e, t, r;
      babelHelpers.classCallCheck(this, n);
      for (var l = arguments.length, a = new Array(l), o = 0; o < l; o++) a[o] = arguments[o];
      return babelHelpers.possibleConstructorReturn(r, (t = r = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(n)).call.apply(e, [this].concat(a))), r.goTo = function (e) {
        var t;
        e === providers.default.netEase ? t = 'NeteaseLogin' : e === providers.default.qqMusic && (t = 'QQMusicLogin');
        r.props.navigation.navigate(t);
      }, t));
    }
    babelHelpers.createClass(n, [{
      key: "render",
      value: function () {
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
          source: require("../../assets/images/netease"),
          onPress: function () {
            return e.goTo(providers.default.netEase);
          }
        }), React.default.createElement(p, {
          source: require("../../assets/images/qqmusic"),
          onPress: function () {
            return e.goTo(providers.default.qqMusic);
          }
        }))));
      }
    }]);
    babelHelpers.inherits(n, e);
    return n;
  }(React.Component),
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
