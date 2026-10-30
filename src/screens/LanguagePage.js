Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeSpringScrollview = require("react-native-spring-scrollview"),
  components = require("../components/index"),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  restartModule = babelHelpers.interopRequireDefault(require("../native/restart")),
  languageModule = babelHelpers.interopRequireDefault(require("../native/language")),
  f = [{
    name: '\u4e2d\u6587/\u5927\u9646',
    code: 'zh_CN'
  }, {
    name: '\u4e2d\u6587/\u81fa\u7063',
    code: 'zh_TW'
  }, {
    name: '\u4e2d\u6587/\u9999\u6e2f',
    code: 'zh_HK'
  }, {
    name: 'English',
    code: 'en_US'
  }],
  h = function (e) {
    function a() {
      var e, n, t;
      babelHelpers.classCallCheck(this, a);
      for (var r = arguments.length, l = new Array(r), o = 0; o < r; o++) l[o] = arguments[o];
      return babelHelpers.possibleConstructorReturn(t, (n = t = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(a)).call.apply(e, [this].concat(l))), t.state = {
        language: languageModule.default.language,
        changed: false
      }, t.onBackPress = function () {
        return true === t.state.changed && (t.alertChange(), true);
      }, t.confirmChange = function (e) {
        languageModule.default.setLanguageCode(e);
        setTimeout(function () {
          restartModule.default.restart();
        }, 99);
      }, t.changeLanguage = function (e) {
        t.setState({
          language: e,
          changed: !(e === languageModule.default.language)
        });
      }, n));
    }
    babelHelpers.createClass(a, [{
      key: "componentDidMount",
      value: function () {
        ReactNative.BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
      }
    }, {
      key: "componentWillUnmount",
      value: function () {
        ReactNative.BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
      }
    }, {
      key: "alertChange",
      value: function () {
        var e = this,
          a = this.state.language;
        languageModule.default.language !== a && ReactNative.Alert.alert(locales.default.CONFIRM_CHANGE_LANGUAGE, locales.default.NEED_RELOAD_APP, [{
          text: locales.default.CANCEL,
          onPress: function () {
            e.props.navigation.goBack();
          },
          style: 'cancel'
        }, {
          text: locales.default.CONFIRM,
          onPress: function () {
            return e.confirmChange(a);
          }
        }]);
      }
    }, {
      key: "render",
      value: function () {
        var e = this,
          a = this.state.language;
        return React.default.createElement(components.PageContainer, {
          title: locales.default.LANGUAGE,
          goBack: this.props.navigation.goBack,
          rightIcon: {
            name: icons.default.CHECK,
            onPress: function () {
              return e.alertChange();
            }
          }
        }, React.default.createElement(reactNativeSpringScrollview.SpringScrollView, {
          style: {
            flex: 1
          }
        }, f.map(function (n, t) {
          return React.default.createElement(components.SongRow, {
            key: t,
            song: n.name,
            singer: n.code,
            index: t,
            isChecked: n.code === a,
            onPress: function () {
              return e.changeLanguage(n.code);
            }
          });
        })));
      }
    }]);
    babelHelpers.inherits(a, e);
    return a;
  }(React.PureComponent);
exports.default = h;
