Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var lottieReactNative = babelHelpers.interopRequireDefault(require("lottie-react-native")),
  React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeSpringScrollview = require("react-native-spring-scrollview"),
  TouchableScale = babelHelpers.interopRequireDefault(require("../components/TouchableScale")),
  components = require("../components/index"),
  Placeholders = babelHelpers.interopRequireDefault(require("./about/Placeholders")),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  endpoints = require("../services/endpoints"),
  infoModule = require("../native/info"),
  linkData = babelHelpers.interopRequireDefault(require("./about/linkData")),
  CreditsSection = babelHelpers.interopRequireDefault(require("./about/CreditsSection")),
  LinkList = babelHelpers.interopRequireDefault(require("./about/LinkList")),
  styles = babelHelpers.interopRequireDefault(require("./about/styles")),
  h = function (e) {
    function l() {
      var e, t, a;
      babelHelpers.classCallCheck(this, l);
      for (var n = arguments.length, r = new Array(n), o = 0; o < n; o++) r[o] = arguments[o];
      return babelHelpers.possibleConstructorReturn(a, (t = a = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(l)).call.apply(e, [this].concat(r))), a.ICON_SIZE = 27, a.state = {
        speed: 1,
        ended: false
      }, a.linking = function (e) {
        ReactNative.Linking.openURL(e);
      }, a.onHelp = function () {
        return a.props.navigation.navigate('Tip');
      }, a.goBack = function () {
        return a.props.navigation.goBack();
      }, a.onTop = function () {
        var e, t;
        return null === (e = (t = a._scrollView).scrollToBegin) || void 0 === e ? void 0 : e.call(t);
      }, a.onClip = function (e) {
        toast(locales.default.COPIED + " " + e);
        ReactNative.Clipboard.setString(e);
      }, a.onThanks = function () {
        return a.props.navigation.navigate('Tip', {
          url: endpoints.HOST_PAGE + "/thanks"
        });
      }, a.onSpeedUp = function () {
        var e = a.state.speed + 1,
          t = a.state.ended;
        e % 5 == 0 && toast(e + "x\u2026\u2026");
        e >= 100 ? (e = 1, t = false) : e >= 50 && (t = true);
        a.setState({
          speed: e,
          ended: t
        });
      }, a.renderAll = function () {
        return React.default.createElement(React.default.Fragment, null, React.default.createElement(ReactNative.Text, {
          style: [styles.default.text, {
            marginBottom: 10
          }]
        }, '\t\t', "\u672c\u5e94\u7528\u53ea\u5728\u76f8\u5173\u7fa4\u7ec4/\u9891\u9053\u53d1\u5e03\u66f4\u65b0\uff0c\u5176\u4ed6\u5730\u65b9\u4e0b\u8f7d\u7684\u65e0\u6cd5\u4fdd\u8bc1\u53ef\u7528\u6027\u3002"), linkData.default.sites.map(function (e, t) {
          return React.default.createElement(CreditsSection.default, {
            key: t,
            onPress: function () {
              return a.linking(e.url);
            },
            renderAvatar: function () {
              return React.default.createElement(components.Icon, {
                name: e.icon,
                size: a.ICON_SIZE,
                style: styles.default.avatar
              });
            },
            title: e.name,
            subtitle: e.url
          });
        }), React.default.createElement(components.Title, {
          style: [styles.default.title]
        }, "\u76f8\u5173\u7684\u4eba"), a.renderPersons(), React.default.createElement(components.Title, {
          style: [styles.default.title]
        }, "\u5f00\u6e90\u5e93"), React.default.createElement(CreditsSection.default, {
          onPress: a.onThanks,
          renderAvatar: function () {
            return React.default.createElement(components.Icon, {
              name: icons.default.HEART_OUTLINE,
              size: a.ICON_SIZE,
              style: styles.default.avatar
            });
          },
          title: '\u70b9\u51fb\u67e5\u770b',
          subtitle: endpoints.HOST_PAGE + "/thanks"
        }), React.default.createElement(components.EmptyFooter, null));
      }, a.renderPersons = function () {
        return linkData.default.persons.map(function (e, t) {
          var l = linkData.default.qqs[t],
            n = linkData.default.qqAvatarUrl.replace('%qq', l);
          return React.default.createElement(CreditsSection.default, {
            key: t,
            onPress: function () {
              return a.onClip(l);
            },
            renderAvatar: function () {
              return React.default.createElement(ReactNative.View, {
                style: [styles.default.avatar]
              }, React.default.createElement(ReactNative.Image, {
                style: [styles.default.borderLine, {
                  height: 55,
                  width: 55,
                  borderRadius: 27.5
                }],
                source: {
                  uri: n
                }
              }));
            },
            title: e.name,
            subtitle: l
          });
        });
      }, t));
    }
    babelHelpers.createClass(l, [{
      key: "render",
      value: function () {
        var e = this,
          l = this.state,
          a = l.ended,
          b = l.speed;
        return React.default.createElement(components.PageContainer, {
          title: a ? '\u25a0 \u25a0 \u25a0' : locales.default.ABOUT,
          goBack: this.goBack,
          onTop: this.onTop,
          rightIcon: {
            name: icons.default.HELP_CIRCLE_OUTLINE,
            onPress: this.onHelp
          },
          blur: true
        }, React.default.createElement(reactNativeSpringScrollview.SpringScrollView, {
          ref: function (t) {
            return e._scrollView = t;
          },
          style: {
            padding: 15
          }
        }, React.default.createElement(ReactNative.View, {
          style: styles.default.lottieContainer
        }, React.default.createElement(TouchableScale.default, {
          onPress: this.onSpeedUp
        }, React.default.createElement(lottieReactNative.default, {
          source: require("../../assets/animations/loading"),
          loop: true,
          autoPlay: true,
          style: styles.default.lottieView,
          speed: b
        })), a ? React.default.createElement(Placeholders.default.Text, {
          style: [styles.default.text, styles.default.version],
          numbers: 3
        }) : React.default.createElement(ReactNative.Text, {
          style: [styles.default.text, styles.default.version]
        }, infoModule.versionName)), a ? React.default.createElement(LinkList.default, {
          info: linkData.default
        }) : this.renderAll()));
      }
    }]);
    babelHelpers.inherits(l, e);
    return l;
  }(React.PureComponent);
exports.default = h;
