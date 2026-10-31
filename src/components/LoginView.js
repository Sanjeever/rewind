const _default = require('./Text.js').default;
const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  reactNativeAnimatable = _interopRequireWildcard(require('react-native-animatable')),
  components = require('./index'),
  providers = _interopRequireDefault(require('../services/providers')),
  constants = require('../theme/constants'),
  icons = _interopRequireDefault(require('../theme/icons')),
  locales = _interopRequireDefault(require('../locales/index')),
  p = 0.05 * constants.DEVICE_HEIGHT,
  m = class t extends React.PureComponent {
    constructor() {
      var e, n, r;
      for (var a = arguments.length, o = new Array(a), s = 0; s < a; s++) o[s] = arguments[s];
      return (
        (n = r = super(...o)),
        (r.renderQQMusic = function () {
          var e = r.props,
            t = e._Login,
            n = e.onChangeText,
            a = e.onWebview;
          return React.default.createElement(
            ReactNative.View,
            {
              style: y.container,
            },
            React.default.createElement(
              ReactNative.View,
              {
                style: y.inputCon,
              },
              React.default.createElement(components.Input, {
                style: [
                  {
                    fontSize: 18,
                  },
                  y.inputText,
                ],
                placeholder: locales.default.INPUT_QQ_FETCH_PUBLIC_MIX,
                onChangeText: function (e) {
                  return n(e);
                },
                keyboardType: 'numeric',
              }),
            ),
            React.default.createElement(components.TextButton, {
              onPress: t,
              style: y.btnCon,
              text: locales.default.CONFIRM,
              textStyle: {
                opacity: 1,
              },
            }),
            React.default.createElement(
              ReactNative.View,
              {
                style: [
                  y.other,
                  {
                    width: '40%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  },
                ],
              },
              React.default.createElement(components.Icon, {
                style: y.textBtn,
                name: icons.default.QQCHAT,
                size: 30,
                onPress: function () {
                  return a('qqmusic_qq');
                },
              }),
              React.default.createElement(components.Icon, {
                style: y.textBtn,
                name: icons.default.WECHAT,
                size: 30,
                onPress: function () {
                  return a('qqmusic_wechat');
                },
              }),
            ),
          );
        }),
        (r.renderNetease = function () {
          var e = r.props,
            t = e._Login,
            n = e.otherWay,
            a = e.onChangeText,
            o = e.loginOut,
            s = e.onWebview;
          return React.default.createElement(
            ReactNative.View,
            {
              style: y.container,
            },
            React.default.createElement(
              ReactNative.View,
              {
                style: y.inputCon,
              },
              React.default.createElement(components.Input, {
                style: [
                  {
                    fontSize: 18,
                  },
                  y.inputText,
                ],
                placeholder: locales.default.EMAIL_OR_PHONE,
                onChangeText: function (e) {
                  return a(e, 'account');
                },
              }),
            ),
            React.default.createElement(
              ReactNative.View,
              {
                style: y.inputCon,
              },
              React.default.createElement(components.Input, {
                style: [
                  {
                    fontSize: 18,
                  },
                  y.inputText,
                ],
                underlineColorAndroid: 0,
                placeholder: locales.default.PASSWORD,
                onChangeText: function (e) {
                  return a(e, 'password');
                },
                secureTextEntry: true,
              }),
            ),
            React.default.createElement(components.TextButton, {
              onPress: t,
              style: [y.btnCon, y.textBtn],
              text: locales.default.LOG_IN,
              textStyle: {
                opacity: 1,
              },
            }),
            React.default.createElement(components.TextButton, {
              onPress: n,
              text: locales.default.FETCH_PLAYLIST,
              style: {
                marginTop: 20,
              },
            }),
            React.default.createElement(components.TextButton, {
              onPress: o,
              text: locales.default.LOG_OUT,
              style: {
                marginTop: 15,
              },
            }),
            React.default.createElement(
              ReactNative.View,
              {
                style: [
                  y.other,
                  {
                    width: '40%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  },
                ],
              },
              React.default.createElement(components.Icon, {
                style: [
                  y.textBtn,
                  {
                    marginTop: 0,
                  },
                ],
                name: icons.default.QQCHAT,
                size: 30,
                onPress: function () {
                  return s('netease_qq');
                },
              }),
              React.default.createElement(components.Icon, {
                style: [
                  y.textBtn,
                  {
                    marginTop: 0,
                  },
                ],
                name: icons.default.SINA_WEIBO,
                size: 30,
                onPress: function () {
                  return s('netease_weibo');
                },
              }),
            ),
          );
        }),
        n
      );
    }
    render() {
      var e = this.props,
        t = e.avatar,
        n = e.nickname,
        r = e.api;
      return React.default.createElement(
        reactNativeAnimatable.View,
        {
          animation: 'fadeIn',
          useNativeDriver: true,
          style: {
            flex: 1,
            paddingTop: 60,
            alignItems: 'center',
          },
        },
        React.default.createElement(
          ReactNative.TouchableOpacity,
          {
            onPress: this.props.onUserManager,
          },
          React.default.createElement(
            ReactNative.View,
            {
              style: y.avatarView,
            },
            t
              ? React.default.createElement(ReactNative.Image, {
                  source: {
                    uri: t,
                  },
                  style: y.avatar,
                })
              : React.default.createElement(components.Icon, {
                  name: icons.default.ACCOUNT,
                  size: 50,
                }),
            React.default.createElement(
              _default,
              {
                style: [
                  {
                    fontSize: 18,
                    marginTop: 10,
                  },
                ],
              },
              n,
            ),
          ),
        ),
        r === providers.default.netEase ? this.renderNetease() : this.renderQQMusic(),
      );
    }
  };
exports.default = m;
var y = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  avatarView: {
    marginBottom: p,
    marginTop: p,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  other: {
    marginTop: p,
  },
  inputCon: {
    marginLeft: 15,
    marginRight: 15,
    justifyContent: 'center',
    marginBottom: 10,
  },
  inputText: {
    textAlign: 'center',
    width: constants.DEVICE_WIDTH,
    height: 46,
  },
  btnCon: {
    width: 200,
    marginTop: 0.5 * p,
    borderRadius: 50,
    backgroundColor: 0,
    borderWidth: 1,
    borderColor: constants.COLORS.primary,
    padding: 10,
  },
  textBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});
