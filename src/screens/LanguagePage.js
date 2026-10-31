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
  icons = _interopRequireDefault(require('../theme/icons')),
  locales = _interopRequireDefault(require('../locales/index')),
  restartModule = _interopRequireDefault(require('../native/restart')),
  languageModule = _interopRequireDefault(require('../native/language')),
  f = [
    {
      name: '中文/大陆',
      code: 'zh_CN',
    },
    {
      name: '中文/臺灣',
      code: 'zh_TW',
    },
    {
      name: '中文/香港',
      code: 'zh_HK',
    },
    {
      name: 'English',
      code: 'en_US',
    },
  ],
  h = class a extends React.PureComponent {
    constructor() {
      var e, n, t;
      for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
      return (
        (n = t = super(...l)),
        (t.state = {
          language: languageModule.default.language,
          changed: false,
        }),
        (t.onBackPress = function () {
          return true === t.state.changed && (t.alertChange(), true);
        }),
        (t.confirmChange = function (e) {
          languageModule.default.setLanguageCode(e);
          setTimeout(function () {
            restartModule.default.restart();
          }, 99);
        }),
        (t.changeLanguage = function (e) {
          t.setState({
            language: e,
            changed: !(e === languageModule.default.language),
          });
        }),
        n
      );
    }
    componentDidMount() {
      this.backSubscription = ReactNative.BackHandler.addEventListener(
        'hardwareBackPress',
        this.onBackPress,
      );
    }
    componentWillUnmount() {
      this.backSubscription?.remove();
    }
    alertChange() {
      var e = this,
        a = this.state.language;
      languageModule.default.language !== a &&
        ReactNative.Alert.alert(
          locales.default.CONFIRM_CHANGE_LANGUAGE,
          locales.default.NEED_RELOAD_APP,
          [
            {
              text: locales.default.CANCEL,
              onPress: function () {
                e.props.navigation.goBack();
              },
              style: 'cancel',
            },
            {
              text: locales.default.CONFIRM,
              onPress: function () {
                return e.confirmChange(a);
              },
            },
          ],
        );
    }
    render() {
      var e = this,
        a = this.state.language;
      return React.default.createElement(
        components.PageContainer,
        {
          title: locales.default.LANGUAGE,
          goBack: this.props.navigation.goBack,
          rightIcon: {
            name: icons.default.CHECK,
            onPress: function () {
              return e.alertChange();
            },
          },
        },
        React.default.createElement(
          reactNativeSpringScrollview.SpringScrollView,
          {
            style: {
              flex: 1,
            },
          },
          f.map(function (n, t) {
            return React.default.createElement(components.SongRow, {
              key: t,
              song: n.name,
              singer: n.code,
              index: t,
              isChecked: n.code === a,
              onPress: function () {
                return e.changeLanguage(n.code);
              },
            });
          }),
        ),
      );
    }
  };
exports.default = h;
