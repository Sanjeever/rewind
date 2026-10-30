Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var immer = require("immer"),
  React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeSpringScrollview = require("react-native-spring-scrollview"),
  components = require("../components/index"),
  notification = babelHelpers.interopRequireDefault(require("../settings/notification")),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  keys = babelHelpers.interopRequireDefault(require("../storage/keys")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  restart = babelHelpers.interopRequireDefault(require("../native/restart")),
  module835 = babelHelpers.interopRequireDefault(require("../modules/module-835")),
  h = notification.default.configObject,
  v = notification.default.configKeys,
  C = function (e) {
    function t() {
      var e, n, a;
      babelHelpers.classCallCheck(this, t);
      for (var r = arguments.length, i = new Array(r), l = 0; l < r; l++) i[l] = arguments[l];
      return babelHelpers.possibleConstructorReturn(a, (n = a = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(i))), a.state = {
        config: h,
        changed: false
      }, a.onBackPress = function () {
        return !!a.state.changed && (a.alertChange(), true);
      }, a.confirmChange = function () {
        a.saveConfig();
        setTimeout(function () {
          restart.default.restart();
        }, 99);
      }, a.loadConfig = function () {
        storage.load({
          key: keys.default.musicNotification
        }).then(function (e) {
          e && a.setState({
            config: e
          });
        });
      }, a.saveConfig = function () {
        storage.save({
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
        storage.remove({
          key: keys.default.musicNotification
        });
        a.setState({
          config: h
        });
      }, n));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        this.loadConfig();
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
    }, {
      key: "render",
      value: function () {
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
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = C;
