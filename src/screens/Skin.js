const _default = require("./../components/Text.js").default;
const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _appStorage = require("./../storage/index.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeImageCropPicker = _interopRequireDefault(require("react-native-image-crop-picker")),
  reactNativeSlider = _interopRequireDefault(require("@react-native-community/slider")),
  components = require("../components/index"),
  constants = require("../theme/constants"),
  names = _interopRequireDefault(require("../events/names")),
  icons = _interopRequireDefault(require("../theme/icons")),
  keys = _interopRequireDefault(require("../storage/keys")),
  locales = _interopRequireDefault(require("../locales/index")),
  events = require("../events/index"),
  restartModule = _interopRequireDefault(require("../native/restart")),
  files = require("../storage/files"),
  g = class t extends React.Component {
    constructor() {
      var e, l, a;
      for (var n = arguments.length, r = new Array(n), i = 0; i < n; i++) r[i] = arguments[i];
      return l = a = super(...r), a.state = {
        img: '',
        value: 1,
        blur: false
      }, a.clearRoll = function () {
        _appStorage.storage.remove({
          key: keys.default.background
        }).then(function () {
          toast(locales.default.BACKGROUND_CACHE_CLEARED);
        });
        a.setState({
          img: ''
        });
        (0, files.removeBackground)();
        setTimeout(function () {
          restartModule.default.restart();
        }, 99);
      }, a.openRoll = function () {
        var e = 2 * (0 | constants.DEVICE_WIDTH),
          t = 2 * (0 | constants.DEVICE_HEIGHT);
        reactNativeImageCropPicker.default.openPicker({
          width: e,
          height: t,
          cropping: true,
          enableRotationGesture: true
        }).then(function (e) {
          (0, files.moveToFiles)({
            from: e.path,
            dest: 'background'
          }).then(function (e) {
            a.setState({
              img: 'file://' + e
            });
          });
        }).catch(function (e) {
          return e;
        });
      }, a.emit = function () {
        var e = a.state,
          t = e.img,
          l = e.value,
          n = e.blur;
        if (!t) {
          toast(locales.default.SKIN_NOT_PICK_PIC);
          return false;
        }
        events.emitter.emit(names.default.ChangeBackground, {
          path: t,
          opacity: l,
          blur: n
        });
        toast(locales.default.SKIN_CHANGE_BG_SUCCESS);
      }, a.onAlert = function () {
        ReactNative.Alert.alert(locales.default.CONFIRM_CLEAR_BACKGROUND_CACHE, locales.default.NEED_RELOAD_APP, [{
          text: locales.default.CANCEL,
          onPress: function () {
            return null;
          },
          style: 'cancel'
        }, {
          text: locales.default.CONFIRM,
          onPress: function () {
            return a.clearRoll();
          }
        }], {
          cancelable: true
        });
      }, a.onBlur = function (e) {
        a.setState({
          blur: e
        });
      }, l;
    }
    "componentDidMount"() {
      var e = this;
      _appStorage.storage.load({
        key: keys.default.background
      }).then(function (t) {
        t && e.setState({
          img: t.path,
          value: t.opacity,
          blur: t.blur
        });
      }).catch(function () {
        e.setState({
          img: null
        });
      });
    }
    "render"() {
      var e = this,
        t = this.state,
        l = t.img,
        a = t.value,
        n = t.blur;
      return React.default.createElement(ReactNative.View, {
        style: [C.container, C.background]
      }, React.default.createElement(ReactNative.Image, {
        style: [ReactNative.StyleSheet.absoluteFill, C.background, {
          opacity: a
        }],
        source: {
          uri: l
        },
        blurRadius: n ? 10 : 0
      }), React.default.createElement(components.HeaderBar, {
        title: locales.default.BACKGROUND,
        goBack: this.props.navigation.goBack,
        rightIcon: {
          name: icons.default.BACKUP_RESTORE,
          onPress: this.onAlert
        }
      }), React.default.createElement(ReactNative.View, {
        style: C.btn
      }, React.default.createElement(ReactNative.View, {
        style: [{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10
        }]
      }, React.default.createElement(_default, null, "\u80cc\u666f\u56fe\uff1a"), React.default.createElement(ReactNative.TouchableOpacity, {
        onPress: this.openRoll
      }, React.default.createElement(components.Icon, {
        name: icons.default.IMAGE,
        color: "#fff"
      }))), React.default.createElement(ReactNative.View, {
        style: [{
          flexDirection: 'row',
          alignItems: 'center'
        }]
      }, React.default.createElement(_default, null, "\u900f\u660e\u5ea6\uff1a"), React.default.createElement(reactNativeSlider.default, {
        maximumTrackTintColor: "rgba(255,255,255,0.1)",
        minimumTrackTintColor: 'rgba(255,255,255,0.8)',
        thumbTintColor: '#fff',
        thumbStyle: [{
          height: 10,
          width: 10
        }],
        style: {
          width: 200
        },
        value: a,
        onValueChange: function (t) {
          return e.setState({
            value: t
          });
        },
        onSlidingComplete: function () {
          return e.setState({
            value: a
          });
        }
      })), React.default.createElement(ReactNative.View, {
        style: [{
          flexDirection: 'row',
          alignItems: 'center'
        }]
      }, React.default.createElement(_default, null, "\u6a21\u7cca\u6548\u679c\uff1a"), React.default.createElement(components.Switch, {
        value: n,
        onValueChange: this.onBlur
      }))), React.default.createElement(ReactNative.View, {
        style: C.send
      }, React.default.createElement(ReactNative.TouchableOpacity, {
        onPress: this.emit
      }, React.default.createElement(_default, {
        style: [C.textBtn]
      }, "\u786e\u8ba4"))));
    }
  },
  C = ReactNative.StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000'
    },
    background: {
      width: constants.DEVICE_WIDTH,
      height: constants.DEVICE_HEIGHT
    },
    btn: {
      position: 'absolute',
      top: '70%',
      left: 30,
      elevation: 5
    },
    send: {
      position: 'absolute',
      bottom: 50,
      width: constants.DEVICE_WIDTH,
      alignItems: 'center'
    },
    textBtn: {
      borderColor: '#fff',
      borderWidth: 2,
      padding: 10,
      paddingHorizontal: 50,
      borderRadius: 5
    }
  }),
  R = g;
exports.default = R;
