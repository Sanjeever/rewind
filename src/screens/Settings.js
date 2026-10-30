Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeSlider = babelHelpers.interopRequireDefault(require("react-native-slider")),
  reactNativeSpringScrollview = require("react-native-spring-scrollview"),
  components = require("../components/index"),
  defaults = require("../settings/defaults"),
  constants = require("../theme/constants"),
  names = babelHelpers.interopRequireDefault(require("../events/names")),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  keys = babelHelpers.interopRequireDefault(require("../storage/keys")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  events = require("../events/index"),
  restart = babelHelpers.interopRequireDefault(require("../native/restart")),
  b = function (e) {
    function t() {
      var e, n, a;
      babelHelpers.classCallCheck(this, t);
      for (var i = arguments.length, o = new Array(i), r = 0; r < i; r++) o[r] = arguments[r];
      return babelHelpers.possibleConstructorReturn(a, (n = a = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(o))), a.state = {
        settings: defaults.defaultSettings,
        modified: false,
        modal: false
      }, a.isSettingsUpdated = function (e) {
        var t = Object.keys(e),
          n = Object.keys(defaults.defaultSettings);
        if (t.length !== n.length) return true;
        for (var a = 0; a < t.length; a++) if (t[a] !== n[a]) return true;
        return false;
      }, a.save = function () {
        var e = a.state.modified;
        return new Promise(function (t) {
          if (!e) return t(false);
          storage.save({
            key: keys.default.settings,
            data: a.state.settings
          }).then(function () {
            events.emitter.emit(names.default.SettingsChanged);
            toast(locales.default.SETTINGS_SAVED);
            t(true);
          }).catch(function () {
            return t(false);
          });
        });
      }, a.alertResetSettings = function () {
        ReactNative.Alert.alert(locales.default.WARN, locales.default.CONFIRM_RESET_ALL_SETTINGS, [{
          text: locales.default.CANCEL,
          onPress: function () {
            return null;
          },
          style: 'cancel'
        }, {
          text: locales.default.CONFIRM,
          onPress: function () {
            return a.resetSettings();
          }
        }]);
      }, a.resetSettings = function () {
        a.setState({
          settings: defaults.defaultSettings
        });
        storage.remove({
          key: keys.default.settings
        });
        toast(locales.default.CACHE_CLEARED);
      }, a.onValueChange = function (e) {
        var t = a.state.settings;
        t.bottomPadding.subtitle = e;
        a.setState({
          settings: t,
          modified: true
        });
      }, a.onSlidingComplete = function (e) {
        events.emitter.emit(names.default.BottomPaddingChange, e);
      }, a.onTop = function () {
        var e, t;
        return null === (e = (t = a.refs.scrollView).scrollToBegin) || void 0 === e ? void 0 : e.call(t);
      }, a.renderSettingItems = function () {
        var e = a.state.settings;
        return defaults.settingsMap.map(function (t, n) {
          var i = e[t],
            o = defaults.defaultSettings[t];
          return t.includes('SECTION') ? React.default.createElement(components.Title, {
            style: C.sectionText
          }, defaults.sectionsMap[t].title) : 'bottomPadding' === t ? React.default.createElement(components.SettingItem, {
            key: n,
            title: o.title,
            subtitle: o.subtitle || null,
            onPress: a.onShowBottomPaddingModal,
            showChevron: true
          }) : React.default.createElement(ReactNative.TouchableNativeFeedback, {
            key: n,
            onPress: function () {
              return a.switchOptions(i.option);
            }
          }, React.default.createElement(components.SettingItem, {
            key: n,
            title: o.title,
            subtitle: o.subtitle || null,
            switchButton: true,
            switched: i.on,
            onSwitch: function () {
              return a.switchOptions(t);
            }
          }));
        });
      }, a.onModalClose = function () {
        a.setState({
          modal: false
        });
      }, a.restart = function () {
        a.save().then(function () {
          restart.default.restart();
        });
      }, a.onShowBottomPaddingModal = function () {
        a.setState({
          modal: true
        });
      }, a.switchOptions = function (e) {
        var t = a.state.settings;
        t[e].on = !t[e].on;
        a.setState({
          settings: t,
          modified: true
        });
        storage.save({
          key: keys.default.settings,
          data: t
        });
      }, n));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        var e = this;
        storage.load({
          key: keys.default.settings
        }).then(function (t) {
          if ('object' == typeof t) {
            var n = e.isSettingsUpdated(t) ? defaults.defaultSettings : t;
            e.setState({
              settings: n
            });
          } else e.setState({
            settings: defaults.defaultSettings
          });
        }).catch(function () {
          e.setState({
            settings: defaults.defaultSettings
          });
        });
      }
    }, {
      key: "componentWillUnmount",
      value: function () {
        this.save();
      }
    }, {
      key: "render",
      value: function () {
        var e = this,
          t = this.state.settings;
        return React.default.createElement(components.PageContainer, {
          title: locales.default.SETTING,
          goBack: function () {
            return e.props.navigation.goBack();
          },
          rightIcon: {
            name: icons.default.BACKUP_RESTORE,
            onPress: this.alertResetSettings
          },
          onTop: this.onTop
        }, React.default.createElement(reactNativeSpringScrollview.SpringScrollView, {
          ref: "scrollView",
          style: {
            padding: 10,
            paddingHorizontal: 15
          }
        }, this.renderSettingItems(), React.default.createElement(ReactNative.TouchableOpacity, {
          onPress: this.restart
        }, React.default.createElement(ReactNative.Text, {
          style: C.text
        }, locales.default.RESTART_APP)), React.default.createElement(ReactNative.View, {
          style: {
            height: 100
          }
        }), React.default.createElement(ReactNative.Modal, {
          visible: this.state.modal,
          onRequestClose: this.onModalClose,
          transparent: true,
          animationType: "fade"
        }, React.default.createElement(ReactNative.View, {
          style: {
            height: constants.DEVICE_HEIGHT / 2,
            width: '100%',
            backgroundColor: 'rgba(0,0,0,0)'
          }
        }, React.default.createElement(ReactNative.View, {
          style: C.modal
        }, React.default.createElement(components.Background, null), React.default.createElement(reactNativeSlider.default, {
          style: {
            width: '90%'
          },
          maximumTrackTintColor: constants.COLORS.primaryAlpha70,
          minimumTrackTintColor: constants.COLORS.primaryAlpha10,
          thumbTintColor: constants.COLORS.primary,
          value: t.bottomPadding.subtitle,
          maximumValue: 100,
          onValueChange: this.onValueChange,
          onSlidingComplete: this.onSlidingComplete,
          step: 1
        }), React.default.createElement(ReactNative.Text, {
          style: C.text
        }, locales.default.RELATIVE_VALUE, ":", String(t.bottomPadding.subtitle)), React.default.createElement(ReactNative.TouchableOpacity, {
          onPress: this.onModalClose
        }, React.default.createElement(ReactNative.Text, {
          style: [C.text, {
            marginTop: 20,
            fontSize: 18
          }]
        }, locales.default.CONFIRM)))))));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.Component),
  C = ReactNative.StyleSheet.create({
    modal: {
      height: '50%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000'
    },
    text: {
      fontSize: 14,
      alignSelf: 'center',
      marginTop: 20
    },
    sectionText: {
      marginVertical: 5,
      paddingLeft: 10
    }
  }),
  E = b;
exports.default = E;
