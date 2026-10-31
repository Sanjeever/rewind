const _default = require('@react-native-clipboard/clipboard').default;
const _default2 = require('./../components/Text.js').default;
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var lottieReactNative = _interopRequireDefault(require('lottie-react-native')),
  React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  reactNativeSpringScrollview = require('./../components/Scrolling.js'),
  TouchableScale = _interopRequireDefault(require('../components/TouchableScale')),
  components = require('../components/index'),
  Placeholders = _interopRequireDefault(require('./about/Placeholders')),
  icons = _interopRequireDefault(require('../theme/icons')),
  locales = _interopRequireDefault(require('../locales/index')),
  endpoints = require('../services/endpoints'),
  infoModule = require('../native/info'),
  linkData = _interopRequireDefault(require('./about/linkData')),
  CreditsSection = _interopRequireDefault(require('./about/CreditsSection')),
  LinkList = _interopRequireDefault(require('./about/LinkList')),
  styles = _interopRequireDefault(require('./about/styles')),
  h = class l extends React.PureComponent {
    constructor() {
      var e, t, a;
      for (var n = arguments.length, r = new Array(n), o = 0; o < n; o++) r[o] = arguments[o];
      return (
        (t = a = super(...r)),
        (a.ICON_SIZE = 27),
        (a.state = {
          speed: 1,
          ended: false,
        }),
        (a.linking = function (e) {
          ReactNative.Linking.openURL(e);
        }),
        (a.onHelp = function () {
          return a.props.navigation.navigate('Tip');
        }),
        (a.goBack = function () {
          return a.props.navigation.goBack();
        }),
        (a.onTop = function () {
          var e, t;
          return null === (e = (t = a._scrollView).scrollToBegin) || void 0 === e
            ? void 0
            : e.call(t);
        }),
        (a.onClip = function (e) {
          toast(locales.default.COPIED + ' ' + e);
          _default.setString(e);
        }),
        (a.onThanks = function () {
          return a.props.navigation.navigate('Tip', {
            url: endpoints.HOST_PAGE + '/thanks',
          });
        }),
        (a.onSpeedUp = function () {
          var e = a.state.speed + 1,
            t = a.state.ended;
          e % 5 == 0 && toast(e + 'x……');
          e >= 100 ? ((e = 1), (t = false)) : e >= 50 && (t = true);
          a.setState({
            speed: e,
            ended: t,
          });
        }),
        (a.renderAll = function () {
          return React.default.createElement(
            React.default.Fragment,
            null,
            React.default.createElement(
              _default2,
              {
                style: [
                  styles.default.text,
                  {
                    marginBottom: 10,
                  },
                ],
              },
              '\t\t',
              '本应用只在相关群组/频道发布更新，其他地方下载的无法保证可用性。',
            ),
            linkData.default.sites.map(function (e, t) {
              return React.default.createElement(CreditsSection.default, {
                key: t,
                onPress: function () {
                  return a.linking(e.url);
                },
                renderAvatar: function () {
                  return React.default.createElement(components.Icon, {
                    name: e.icon,
                    size: a.ICON_SIZE,
                    style: styles.default.avatar,
                  });
                },
                title: e.name,
                subtitle: e.url,
              });
            }),
            React.default.createElement(
              components.Title,
              {
                style: [styles.default.title],
              },
              '相关的人',
            ),
            a.renderPersons(),
            React.default.createElement(
              components.Title,
              {
                style: [styles.default.title],
              },
              '开源库',
            ),
            React.default.createElement(CreditsSection.default, {
              onPress: a.onThanks,
              renderAvatar: function () {
                return React.default.createElement(components.Icon, {
                  name: icons.default.HEART_OUTLINE,
                  size: a.ICON_SIZE,
                  style: styles.default.avatar,
                });
              },
              title: '点击查看',
              subtitle: endpoints.HOST_PAGE + '/thanks',
            }),
            React.default.createElement(components.EmptyFooter, null),
          );
        }),
        (a.renderPersons = function () {
          return linkData.default.persons.map(function (e, t) {
            var l = linkData.default.qqs[t],
              n = linkData.default.qqAvatarUrl.replace('%qq', l);
            return React.default.createElement(CreditsSection.default, {
              key: t,
              onPress: function () {
                return a.onClip(l);
              },
              renderAvatar: function () {
                return React.default.createElement(
                  ReactNative.View,
                  {
                    style: [styles.default.avatar],
                  },
                  React.default.createElement(ReactNative.Image, {
                    style: [
                      styles.default.borderLine,
                      {
                        height: 55,
                        width: 55,
                        borderRadius: 27.5,
                      },
                    ],
                    source: {
                      uri: n,
                    },
                  }),
                );
              },
              title: e.name,
              subtitle: l,
            });
          });
        }),
        t
      );
    }
    render() {
      var e = this,
        l = this.state,
        a = l.ended,
        b = l.speed;
      return React.default.createElement(
        components.PageContainer,
        {
          title: a ? '■ ■ ■' : locales.default.ABOUT,
          goBack: this.goBack,
          onTop: this.onTop,
          rightIcon: {
            name: icons.default.HELP_CIRCLE_OUTLINE,
            onPress: this.onHelp,
          },
          blur: true,
        },
        React.default.createElement(
          reactNativeSpringScrollview.SpringScrollView,
          {
            ref: function (t) {
              return (e._scrollView = t);
            },
            style: {
              padding: 15,
            },
          },
          React.default.createElement(
            ReactNative.View,
            {
              style: styles.default.lottieContainer,
            },
            React.default.createElement(
              TouchableScale.default,
              {
                onPress: this.onSpeedUp,
              },
              React.default.createElement(lottieReactNative.default, {
                source: require('../../assets/animations/loading'),
                loop: true,
                autoPlay: true,
                style: styles.default.lottieView,
                speed: b,
              }),
            ),
            a
              ? React.default.createElement(Placeholders.default.Text, {
                  style: [styles.default.text, styles.default.version],
                  numbers: 3,
                })
              : React.default.createElement(
                  _default2,
                  {
                    style: [styles.default.text, styles.default.version],
                  },
                  infoModule.versionName,
                ),
          ),
          a
            ? React.default.createElement(LinkList.default, {
                info: linkData.default,
              })
            : this.renderAll(),
        ),
      );
    }
  };
exports.default = h;
