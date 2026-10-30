const _default = require("./../components/Text.js").default;
const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _appStorage = require("./../storage/index.js");
const {mergeSettings} = require('../settings/merge.cjs');
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeSlider = _interopRequireDefault(require("@react-native-community/slider")),
  reactNativeSpringScrollview = require("./../components/Scrolling.js"),
  components = require("../components/index"),
  defaults = require("../settings/defaults"),
  constants = require("../theme/constants"),
  names = _interopRequireDefault(require("../events/names")),
  icons = _interopRequireDefault(require("../theme/icons")),
  keysModule = _interopRequireDefault(require("../storage/keys")),
  locales = _interopRequireDefault(require("../locales/index")),
  events = require("../events/index"),
  restartModule = _interopRequireDefault(require("../native/restart")),
  b = class t extends React.Component {
    constructor() {
      var e, n, a;
      for (var i = arguments.length, o = new Array(i), r = 0; r < i; r++) o[r] = arguments[r];
      return n = a = super(...o), a.state = {
        settings: defaults.defaultSettings,
        modified: false,
        modal: false
      }, a.save = async function () {
        if (!a.state.modified) return false;
        await _appStorage.storage.save({key: keysModule.default.settings, data: a.state.settings});
        events.emitter.emit(names.default.SettingsChanged);
        return true;
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
      }, a.resetSettings = async function () {
        try {
          const settings = mergeSettings({}, defaults.defaultSettings);
          await _appStorage.storage.save({key: keysModule.default.settings, data: settings});
          a.setState({settings, modified: false});
          events.emitter.emit(names.default.SettingsChanged);
        } catch (error) {
          toast('设置保存失败：' + error.message);
        }
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
        return null === (e = (t = a.scrollView).scrollToBegin) || void 0 === e ? void 0 : e.call(t);
      }, a.renderSettingItems = function () {
        var e = a.state.settings;
        return defaults.settingsMap.map(function (t, n) {
          var i = e[t],
            o = defaults.defaultSettings[t];
          return t.includes('SECTION') ? React.default.createElement(components.Title, {
            key: t,
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
              return a.switchOptions(t);
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
          restartModule.default.restart();
        }).catch(function (error) {
          toast('设置保存失败：' + error.message);
        });
      }, a.onShowBottomPaddingModal = function () {
        a.setState({
          modal: true
        });
      }, a.switchOptions = async function (key) {
        const settings = {...a.state.settings, [key]: {...a.state.settings[key], on: !a.state.settings[key].on}};
        const previous = a.state.settings;
        a.setState({settings, modified: true});
        try {
          await _appStorage.storage.save({key: keysModule.default.settings, data: settings});
          a.setState({modified: false});
          events.emitter.emit(names.default.SettingsChanged);
        } catch (error) {
          a.setState({settings: previous});
          toast('设置保存失败：' + error.message);
        }
      }, n;
    }
    async componentDidMount() {
      const stored = await _appStorage.storage.load({key: keysModule.default.settings});
      this.setState({settings: mergeSettings(stored, defaults.defaultSettings)});
    }
    "componentWillUnmount"() {
      this.save().catch(error => toast('设置保存失败：' + error.message));
    }
    "render"() {
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
        ref: instance => this.scrollView = instance,
        style: {
          padding: 10,
          paddingHorizontal: 15
        }
      }, this.renderSettingItems(), React.default.createElement(ReactNative.TouchableOpacity, {
        onPress: this.restart
      }, React.default.createElement(_default, {
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
      }), React.default.createElement(_default, {
        style: C.text
      }, locales.default.RELATIVE_VALUE, ":", String(t.bottomPadding.subtitle)), React.default.createElement(ReactNative.TouchableOpacity, {
        onPress: this.onModalClose
      }, React.default.createElement(_default, {
        style: [C.text, {
          marginTop: 20,
          fontSize: 18
        }]
      }, locales.default.CONFIRM)))))));
    }
  },
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
