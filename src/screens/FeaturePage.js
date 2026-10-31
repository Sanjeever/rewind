const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireWildcard(require('react')),
  reactNativeSpringScrollview = require('./../components/Scrolling.js'),
  components = require('../components/index'),
  locales = _interopRequireDefault(require('../locales/index')),
  audioPlayer = _interopRequireDefault(require('../native/audioPlayer')),
  languageModule = _interopRequireDefault(require('../native/language')),
  d = class t extends React.PureComponent {
    constructor() {
      var e, a, l;
      for (var r = arguments.length, n = new Array(r), i = 0; i < r; i++) n[i] = arguments[i];
      return (
        (a = l = super(...n)),
        (l.onPage = function (e) {
          l.props.navigation.navigate(e);
        }),
        a
      );
    }
    render() {
      var e = this,
        t = [
          {
            title: locales.default.LANGUAGE,
            subtitle: languageModule.default.language,
            page: 'LanguagePage',
          },
          {
            title: locales.default.BACKGROUND,
            subtitle: locales.default.BACKGROUND_SUB,
            page: 'Skin',
          },
          {
            title: locales.default.ORDER,
            subtitle: locales.default.ORDER_SUB,
            page: 'OrderPage',
          },
          {
            title: locales.default.CACHE,
            subtitle: '/Android/data/com.kuss.rewind/cache/audio-cache',
            page: 'CachePage',
          },
          {
            title: locales.default.MUSIC_NOTIFICATION,
            subtitle: locales.default.MUSIC_NOTIFICATION_SUB,
            page: 'MusicNotificationPage',
          },
          {
            title: locales.default.EQUALIZER,
            subtitle: locales.default.EQUALIZER_SUB,
            onPress: function () {
              return audioPlayer.default.openEqualizer();
            },
          },
        ];
      return React.default.createElement(
        components.PageContainer,
        {
          title: locales.default.FEATURE,
          goBack: function () {
            return e.props.navigation.goBack();
          },
        },
        React.default.createElement(
          reactNativeSpringScrollview.SpringScrollView,
          {
            style: {
              padding: 10,
              paddingHorizontal: 15,
            },
          },
          t.map(function (t, a) {
            return React.default.createElement(components.SettingItem, {
              key: a,
              title: t.title,
              subtitle: t.subtitle,
              onPress: t.onPress
                ? t.onPress
                : function () {
                    return e.onPage(t.page);
                  },
            });
          }),
        ),
      );
    }
  };
exports.default = d;
