Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeImageCropPicker = babelHelpers.interopRequireDefault(require("react-native-image-crop-picker")),
  components = require("../components/index"),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  files = require("../storage/files"),
  f = function (e) {
    function t() {
      var e, l, a;
      babelHelpers.classCallCheck(this, t);
      for (var r = arguments.length, n = new Array(r), o = 0; o < r; o++) n[o] = arguments[o];
      return babelHelpers.possibleConstructorReturn(a, (l = a = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(n))), a.state = {
        coverImg: '',
        coverTitle: locales.default.DEFAULT_MIX_TITLE
      }, a.openRoll = function () {
        reactNativeImageCropPicker.default.openPicker({
          width: 400,
          height: 400,
          cropping: true,
          enableRotationGesture: true
        }).then(function (e) {
          var t = a.state.coverTitle;
          (0, files.moveToFiles)({
            from: e.path,
            dest: 'playlist/imgs',
            fileName: t
          }).then(function (e) {
            a.setState({
              coverImg: 'file://' + e
            });
          });
        }).catch(function (e) {
          return e;
        });
      }, l));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        var e = this,
          t = this.props,
          l = t.showModal,
          a = t.closeModal,
          r = t.createPL;
        return React.default.createElement(ReactNative.Modal, {
          animationType: "fade",
          visible: l,
          onRequestClose: a
        }, React.default.createElement(ReactNative.View, {
          style: m.modalCon
        }, React.default.createElement(ReactNative.TouchableWithoutFeedback, {
          onPress: a
        }, React.default.createElement(ReactNative.View, {
          style: [ReactNative.StyleSheet.absoluteFill]
        })), React.default.createElement(ReactNative.Text, {
          style: m.createTitle
        }, "\u521b\u5efa\u672c\u5730\u6b4c\u5355"), React.default.createElement(ReactNative.View, {
          style: {
            width: '100%',
            alignItems: 'center',
            marginTop: 30
          }
        }, React.default.createElement(ReactNative.Text, {
          style: [m.plText, {
            marginBottom: 0
          }]
        }, "\u6b4c\u5355\u540d\u79f0"), React.default.createElement(components.Input, {
          style: m.textInput,
          placeholder: locales.default.DEFAULT_MIX_TITLE,
          onChangeText: function (t) {
            return e.setState({
              coverTitle: t
            });
          }
        }), React.default.createElement(ReactNative.Text, {
          style: m.plText
        }, "\u6b4c\u5355\u5c01\u9762"), React.default.createElement(ReactNative.TouchableNativeFeedback, {
          onPress: this.openRoll
        }, React.default.createElement(ReactNative.View, {
          style: {
            alignItems: 'center'
          }
        }, this.state.coverImg ? React.default.createElement(ReactNative.Image, {
          source: {
            uri: this.state.coverImg
          },
          style: m.coverImg
        }) : React.default.createElement(components.Icon, {
          name: icons.default.DISC,
          size: 50
        }))), React.default.createElement(ReactNative.TouchableNativeFeedback, {
          onPress: function () {
            return r({
              title: e.state.coverTitle,
              img: e.state.coverImg
            });
          }
        }, React.default.createElement(ReactNative.View, {
          style: {
            width: 200,
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 30
          }
        }, React.default.createElement(ReactNative.Text, {
          style: [m.labelText, {
            fontSize: 16
          }]
        }, "\u521b\u5efa"))))));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = f;
var m = ReactNative.StyleSheet.create({
  labelText: {
    fontSize: 13,
    opacity: .9
  },
  modalCon: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  createTitle: {
    fontSize: 18
  },
  plText: {
    fontSize: 14,
    marginTop: 20,
    marginBottom: 10
  },
  textInput: {
    width: '80%',
    fontSize: 15,
    textAlign: 'center'
  },
  coverImg: {
    height: 100,
    width: 100,
    borderRadius: 5
  }
});
