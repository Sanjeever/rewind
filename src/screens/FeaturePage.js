Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  reactNativeSpringScrollview = require("react-native-spring-scrollview"),
  components = require("../components/index"),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  audioPlayer = babelHelpers.interopRequireDefault(require("../native/audioPlayer")),
  language = babelHelpers.interopRequireDefault(require("../native/language")),
  d = function (e) {
    function t() {
      var e, a, l;
      babelHelpers.classCallCheck(this, t);
      for (var r = arguments.length, n = new Array(r), i = 0; i < r; i++) n[i] = arguments[i];
      return babelHelpers.possibleConstructorReturn(l, (a = l = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(n))), l.onPage = function (e) {
        l.props.navigation.navigate(e);
      }, a));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        var e = this,
          t = [{
            title: locales.default.LANGUAGE,
            subtitle: language.default.language,
            page: 'LanguagePage'
          }, {
            title: locales.default.BACKGROUND,
            subtitle: locales.default.BACKGROUND_SUB,
            page: 'Skin'
          }, {
            title: locales.default.ORDER,
            subtitle: locales.default.ORDER_SUB,
            page: 'OrderPage'
          }, {
            title: locales.default.CACHE,
            subtitle: '/Android/data/com.kuss.rewind/cache/audio-cache',
            page: 'CachePage'
          }, {
            title: locales.default.MUSIC_NOTIFICATION,
            subtitle: locales.default.MUSIC_NOTIFICATION_SUB,
            page: 'MusicNotificationPage'
          }, {
            title: locales.default.EQUALIZER,
            subtitle: locales.default.EQUALIZER_SUB,
            onPress: function () {
              return audioPlayer.default.openEqualizer();
            }
          }];
        return React.default.createElement(components.PageContainer, {
          title: locales.default.FEATURE,
          goBack: function () {
            return e.props.navigation.goBack();
          }
        }, React.default.createElement(reactNativeSpringScrollview.SpringScrollView, {
          style: {
            padding: 10,
            paddingHorizontal: 15
          }
        }, t.map(function (t, a) {
          return React.default.createElement(components.SettingItem, {
            key: a,
            title: t.title,
            subtitle: t.subtitle,
            onPress: t.onPress ? t.onPress : function () {
              return e.onPage(t.page);
            }
          });
        })));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = d;
