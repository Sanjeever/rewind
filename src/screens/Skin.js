Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeImageCropPicker = babelHelpers.interopRequireDefault(require("react-native-image-crop-picker")),
  reactNativeSlider = babelHelpers.interopRequireDefault(require("react-native-slider")),
  components = require("../components/index"),
  constants = require("../theme/constants"),
  names = babelHelpers.interopRequireDefault(require("../events/names")),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  keys = babelHelpers.interopRequireDefault(require("../storage/keys")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  events = require("../events/index"),
  restart = babelHelpers.interopRequireDefault(require("../native/restart")),
  files = require("../storage/files"),
  g = function (e) {
    function t() {
      var e, l, a;
      babelHelpers.classCallCheck(this, t);
      for (var n = arguments.length, r = new Array(n), i = 0; i < n; i++) r[i] = arguments[i];
      return babelHelpers.possibleConstructorReturn(a, (l = a = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(r))), a.state = {
        img: '',
        value: 1,
        blur: false
      }, a.clearRoll = function () {
        storage.remove({
          key: keys.default.background
        }).then(function () {
          toast(locales.default.BACKGROUND_CACHE_CLEARED);
        });
        a.setState({
          img: ''
        });
        (0, files.removeBackground)();
        setTimeout(function () {
          restart.default.restart();
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
      }, l));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        var e = this;
        storage.load({
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
    }, {
      key: "render",
      value: function () {
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
        }, React.default.createElement(ReactNative.Text, null, "\u80cc\u666f\u56fe\uff1a"), React.default.createElement(ReactNative.TouchableOpacity, {
          onPress: this.openRoll
        }, React.default.createElement(components.Icon, {
          name: icons.default.IMAGE,
          color: "#fff"
        }))), React.default.createElement(ReactNative.View, {
          style: [{
            flexDirection: 'row',
            alignItems: 'center'
          }]
        }, React.default.createElement(ReactNative.Text, null, "\u900f\u660e\u5ea6\uff1a"), React.default.createElement(reactNativeSlider.default, {
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
        }, React.default.createElement(ReactNative.Text, null, "\u6a21\u7cca\u6548\u679c\uff1a"), React.default.createElement(components.Switch, {
          value: n,
          onValueChange: this.onBlur
        }))), React.default.createElement(ReactNative.View, {
          style: C.send
        }, React.default.createElement(ReactNative.TouchableOpacity, {
          onPress: this.emit
        }, React.default.createElement(ReactNative.Text, {
          style: [C.textBtn]
        }, "\u786e\u8ba4"))));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.Component),
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
