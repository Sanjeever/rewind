Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeAnimatable = babelHelpers.interopRequireWildcard(require("react-native-animatable")),
  constants = require("../theme/constants"),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  components = require("./index"),
  Input = babelHelpers.interopRequireDefault(require("./Input")),
  f = function (e) {
    function t() {
      var e, n, r;
      babelHelpers.classCallCheck(this, t);
      for (var o = arguments.length, u = new Array(o), d = 0; d < o; d++) u[d] = arguments[d];
      return babelHelpers.possibleConstructorReturn(r, (n = r = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(u))), r.state = {
        showTextInput: false,
        hideStatusBar: false
      }, r.titleOrTextInput = function () {
        var e = r.state.showTextInput,
          t = r.props,
          n = t.bold,
          o = t.onTop,
          u = t.fontColor,
          s = t.title,
          d = t.onSubmitEditing,
          f = t.onChangeText,
          h = t.searchText;
        return t.forceShowTextInput || true === e ? React.default.createElement(reactNativeAnimatable.View, {
          useNativeDriver: true,
          animation: "fadeIn",
          style: {
            flex: 1,
            marginBottom: -2
          }
        }, React.default.createElement(Input.default, {
          autoFocus: true,
          style: b.textInput,
          placeholder: locales.default.SEARCH,
          onChangeText: function (e) {
            return f(e);
          },
          onSubmitEditing: d,
          value: h
        })) : React.default.createElement(ReactNative.TouchableOpacity, {
          disabled: !Boolean(o),
          onPress: r._onTop
        }, React.default.createElement(ReactNative.View, {
          style: {
            flex: 1,
            justifyContent: 'center'
          }
        }, React.default.createElement(ReactNative.Text, {
          numberOfLines: 1,
          style: [b.text, {
            paddingLeft: 5,
            paddingRight: 5
          }, u && {
            color: u
          }, n && b.bold]
        }, s)));
      }, r.renderRightIcon = function () {
        var e = r.props.rightIcon;
        return e ? 'function' == typeof e ? React.default.createElement(ReactNative.View, {
          style: b.rightIcon
        }, e()) : 'object' != typeof e || e.length ? React.default.createElement(ReactNative.View, {
          style: [{
            right: 10,
            top: ReactNative.StatusBar.currentHeight,
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row'
          }]
        }, e.map(function (e, t) {
          return React.default.createElement(h, {
            key: t,
            onPress: function () {
              return r.onRightIcon(e);
            },
            size: e.size,
            name: e.name
          });
        })) : React.default.createElement(ReactNative.View, {
          style: b.rightIcon
        }, React.default.createElement(h, {
          onPress: function () {
            return e.onPress();
          },
          size: e.size,
          name: e.name
        })) : null;
      }, r._onTop = function () {
        var e, t;
        null === (e = (t = r.props).onTop) || void 0 === e || e.call(t);
      }, r.onRightIcon = function (e) {
        'magnify' === e.name ? r.switchTextInput() : e.onPress && e.onPress();
      }, r.textInputBtn = function () {
        return React.default.createElement(ReactNative.View, {
          style: b.rightIcon
        }, React.default.createElement(h, {
          onPress: r.switchTextInput,
          name: icons.default.MAGNIFY
        }));
      }, r.switchTextInput = function () {
        r.setState({
          showTextInput: !r.state.showTextInput
        });
      }, n));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        var e = this.props,
          t = e.opacity,
          n = e.goBack,
          r = e.blur,
          o = e.rightIcon,
          a = e.headerStyle,
          u = e.toolStyle,
          c = e.textInput,
          p = e.backIcon,
          f = e.iconColor,
          g = e.disabledTextInputBtn;
        return React.default.createElement(ReactNative.Animated.View, {
          style: [b.container, b.borderline, ReactNative.StyleSheet.flatten(a)]
        }, r && React.default.createElement(ReactNative.Animated.View, {
          style: [{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: t
          }, b.borderline]
        }, React.default.createElement(components.Background, {
          blur: true
        })), React.default.createElement(ReactNative.View, {
          style: [b.tool, u, (c || o) && {
            paddingRight: 70
          }]
        }, React.default.createElement(h, {
          onPress: n,
          name: (null === p || void 0 === p ? void 0 : p.name) || icons.default.ARROW_LEFT,
          color: f
        }), this.titleOrTextInput()), this.renderRightIcon(), true === c && !g && this.textInputBtn());
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent),
  h = function (e) {
    var t = e.onPress,
      n = e.name,
      r = e.size;
    return React.default.createElement(components.TouchableBorderless, {
      style: b.padding,
      onPress: t
    }, React.default.createElement(components.Icon, {
      style: b.iconStyle,
      name: n,
      size: r
    }));
  },
  b = ReactNative.StyleSheet.create({
    container: {
      height: 40 + ReactNative.StatusBar.currentHeight,
      width: '100%'
    },
    borderline: {
      borderBottomColor: constants.COLORS.primaryAlpha10,
      borderBottomWidth: ReactNative.StyleSheet.hairlineWidth
    },
    padding: {
      padding: 6
    },
    tool: {
      position: 'absolute',
      top: ReactNative.StatusBar.currentHeight,
      alignItems: 'center',
      flexDirection: 'row',
      height: 40,
      paddingHorizontal: 10,
      width: '100%'
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      paddingHorizontal: 5
    },
    text: {
      fontSize: 16
    },
    rightIcon: {
      position: 'absolute',
      right: 10,
      top: ReactNative.StatusBar.currentHeight,
      height: 40,
      width: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0)'
    },
    iconStyle: {
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1
    },
    bold: {
      fontWeight: 'bold'
    }
  }),
  g = f;
exports.default = g;
