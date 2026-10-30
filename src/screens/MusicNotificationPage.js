const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _appStorage = require("./../storage/index.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var immer = require("immer"),
  React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeSpringScrollview = require("./../components/Scrolling.js"),
  components = require("../components/index"),
  notification = _interopRequireDefault(require("../settings/notification")),
  icons = _interopRequireDefault(require("../theme/icons")),
  keys = _interopRequireDefault(require("../storage/keys")),
  locales = _interopRequireDefault(require("../locales/index")),
  restartModule = _interopRequireDefault(require("../native/restart")),
  module835 = _interopRequireDefault(require("../modules/module-835")),
  h = notification.default.configObject,
  v = notification.default.configKeys,
  C = class t extends React.PureComponent {
    constructor() {
      var e, n, a;
      for (var r = arguments.length, i = new Array(r), l = 0; l < r; l++) i[l] = arguments[l];
      return n = a = super(...i), a.state = {
        config: h,
        changed: false
      }, a.onBackPress = function () {
        return !!a.state.changed && (a.alertChange(), true);
      }, a.confirmChange = function () {
        a.saveConfig();
        setTimeout(function () {
          restartModule.default.restart();
        }, 99);
      }, a.loadConfig = function () {
        _appStorage.storage.load({
          key: keys.default.musicNotification
        }).then(function (e) {
          e && a.setState({
            config: e
          });
        });
      }, a.saveConfig = function () {
        _appStorage.storage.save({
          key: keys.default.musicNotification,
          data: a.state.config
        });
      }, a.onSwitch = function (e) {
        var t = (0, immer.produce)(a.state.config, function (t) {
          t[e].on = !t[e].on;
        });
        a.setState({
          config: t,
          changed: true
        });
        a.saveConfig();
      }, a.removeStorage = function () {
        _appStorage.storage.remove({
          key: keys.default.musicNotification
        });
        a.setState({
          config: h
        });
      }, n;
    }
    "componentDidMount"() {
      this.loadConfig();
      this.backSubscription = ReactNative.BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }
    "componentWillUnmount"() {
      this.backSubscription?.remove();
    }
    "alertChange"() {
      var e = this;
      ReactNative.Alert.alert(locales.default.WARN, locales.default.NEED_RELOAD_APP, [{
        text: locales.default.CANCEL,
        onPress: function () {
          e.props.navigation.goBack();
        },
        style: 'cancel'
      }, {
        text: locales.default.CONFIRM,
        onPress: this.confirmChange
      }]);
    }
    "render"() {
      var e = this,
        t = this.state.config;
      return React.default.createElement(components.PageContainer, {
        title: locales.default.MUSIC_NOTIFICATION,
        goBack: this.props.navigation.goBack,
        rightIcon: [{
          name: icons.default.BACKUP_RESTORE,
          onPress: function () {
            return e.removeStorage();
          }
        }]
      }, React.default.createElement(reactNativeSpringScrollview.SpringScrollView, {
        style: {
          padding: 10
        }
      }, v.map(function (n, a) {
        var r = t[n];
        return React.default.createElement(module835.default, {
          key: a,
          name: r.title,
          switched: r.on,
          onSwitch: function () {
            return e.onSwitch(n);
          }
        });
      })));
    }
  };
exports.default = C;
