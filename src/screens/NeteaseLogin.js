Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var cookies = babelHelpers.interopRequireDefault(require("@react-native-community/cookies")),
  React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeSpringScrollview = require("react-native-spring-scrollview"),
  components = require("../components/index"),
  modals = require("../modals/index"),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  names = babelHelpers.interopRequireDefault(require("../events/names")),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  keys = babelHelpers.interopRequireDefault(require("../storage/keys")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  services = require("../services/index"),
  events = require("../events/index"),
  utils = require("../utils/index"),
  types = babelHelpers.interopRequireWildcard(require("../utils/types")),
  users = babelHelpers.interopRequireDefault(require("../storage/users")),
  LoginView = babelHelpers.interopRequireDefault(require("../components/LoginView")),
  NeteaseHelp = babelHelpers.interopRequireDefault(require("./login/NeteaseHelp")),
  k = 'https://graph.qq.com/oauth2.0/show?which=Login&display=pc&client_id=100495085&response_type=code&redirect_uri=https://music.163.com/back/qq&forcelogin=true&state=ZwKHpxUoam',
  y = 'https://api.weibo.com/oauth2/authorize?client_id=301575942&response_type=code&redirect_uri=http://music.163.com/back/weibo&forcelogin=true&scope=friendships_groups_read,statuses_to_me_read,follow_app_official_microblog&state=ovYduMoJhD&checkToken=9ca17ae2e6ffcda170e2e6eeabf121bcec818fc67ba69a8fa2c85e978f8bbbee62b19cb7b4c44abaa789b0f22af0feaec3b92a91e98adaef79f8ecba90b34a939b8fb2c15b8eb1b6dadb3a888e899aec33a1b9ee9e',
  C = function () {
    return regeneratorRuntime.async(function (e) {
      for (;;) switch (e.prev = e.next) {
        case 0:
          e.prev = 0;
          e.next = 3;
          return regeneratorRuntime.awrap(cookies.default.set('https://music.163.com', {
            name: 'os',
            value: 'pc'
          }));
        case 3:
          e.next = 5;
          return regeneratorRuntime.awrap(cookies.default.set('https://music.163.com', {
            name: 'appver',
            value: '2.10.6'
          }));
        case 5:
          e.next = 10;
          break;
        case 7:
          e.prev = 7;
          e.t0 = e.catch(0);
          log('[setupNeteaseCookit] error');
        case 10:
        case "end":
          return e.stop();
      }
    }, null, this, [[0, 7]]);
  },
  _ = function (e) {
    function t() {
      var e, a, n;
      babelHelpers.classCallCheck(this, t);
      for (var r = arguments.length, o = new Array(r), l = 0; l < r; l++) o[l] = arguments[l];
      return babelHelpers.possibleConstructorReturn(n, (a = n = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(o))), n.state = {
        account: '',
        password: '',
        loading: false,
        avatar: '',
        nickname: '',
        modalOpen: false,
        api: providers.default.netEase,
        guideModalOpen: false,
        showWebView: false,
        webViewUrl: ''
      }, n.loadInfo = function () {
        var e, t;
        return regeneratorRuntime.async(function (a) {
          for (;;) switch (a.prev = a.next) {
            case 0:
              a.next = 2;
              return regeneratorRuntime.awrap(users.default.getUserInfo());
            case 2:
              e = a.sent;
              types.isObject(e) && e.netEase && (t = e.netEase) && n.setState({
                avatar: t.avatarUrl,
                nickname: t.nickname
              });
            case 4:
            case "end":
              return a.stop();
          }
        }, null, this);
      }, n.neteaseLoginCellphone = function (e, t) {
        var a, r, s, o;
        return regeneratorRuntime.async(function (i) {
          for (;;) switch (i.prev = i.next) {
            case 0:
              i.next = 2;
              return regeneratorRuntime.awrap(C());
            case 2:
              i.next = 4;
              return regeneratorRuntime.awrap(services.Netease.login_cellphone(e, t));
            case 4:
              a = i.sent;
              (0, utils.usable)(a) && (r = a.code, s = a.message, o = a.profile, 200 === r && o ? n.loginDone(o) : toast(s), n.loadMask('loaded'));
            case 6:
            case "end":
              return i.stop();
          }
        }, null, this);
      }, n._Login = function () {
        ReactNative.Keyboard.dismiss();
        var e = n.state,
          t = e.account,
          a = e.password;
        if (t && a) {
          if (t.match('@')) {
            n.loadMask('loading');
            return void n.neteaseLoginEmail(t, a);
          }
          n.loadMask('loading');
          n.neteaseLoginCellphone(t, a);
        } else toast(locales.default.INPUT_COMPLETE);
      }, n.neteaseLoginEmail = function (e, t) {
        var a, r;
        return regeneratorRuntime.async(function (s) {
          for (;;) switch (s.prev = s.next) {
            case 0:
              s.next = 2;
              return regeneratorRuntime.awrap(C());
            case 2:
              s.next = 4;
              return regeneratorRuntime.awrap(services.Netease.login_email(e, t));
            case 4:
              a = s.sent;
              (0, utils.usable)(a) && ((r = a.profile) ? n.loginDone(r) : toast(locales.default.ERROR), n.loadMask('loaded'));
            case 6:
            case "end":
              return s.stop();
          }
        }, null, this);
      }, n.netEaselikelist = function (e) {
        var t, a;
        return regeneratorRuntime.async(function (n) {
          for (;;) switch (n.prev = n.next) {
            case 0:
              n.next = 2;
              return regeneratorRuntime.awrap(services.Netease.likelist(e));
            case 2:
              t = n.sent;
              (0, utils.usable)(t) && (a = t.ids, 200 === t.code && users.default.saveUserLikeList(a, providers.default.netEase));
            case 4:
            case "end":
              return n.stop();
          }
        }, null, this);
      }, n.otherWay = function () {
        var e = n.state.modalOpen;
        n.setState({
          modalOpen: !e
        });
      }, n.NeteaseLoginOut = function () {
        var e;
        return regeneratorRuntime.async(function (t) {
          for (;;) switch (t.prev = t.next) {
            case 0:
              t.next = 2;
              return regeneratorRuntime.awrap(services.Netease.login_out());
            case 2:
              if (e = t.sent, !(0, utils.usable)(e) || 200 !== e.code) {
                t.next = 11;
                break;
              }
              t.next = 6;
              return regeneratorRuntime.awrap(services.Netease.login_refresh());
            case 6:
              toast(locales.default.NETEASE_LOG_OUT);
              n.clearStorage(keys.default.userInfo);
              n.clearStorage(keys.default.playlist);
              events.emitter.emit(names.default.UserLogined);
              n.setState({
                account: '',
                password: '',
                loading: false,
                avatar: '',
                nickname: '',
                modalOpen: false,
                api: providers.default.netEase,
                guideModalOpen: false
              });
            case 11:
            case "end":
              return t.stop();
          }
        }, null, this);
      }, n.getPlaylist = function (e) {
        var t, a, r;
        return regeneratorRuntime.async(function (s) {
          for (;;) switch (s.prev = s.next) {
            case 0:
              n.netEaselikelist(e);
              s.next = 3;
              return regeneratorRuntime.awrap(services.Netease.user_playlist(e));
            case 3:
              t = s.sent;
              (0, utils.usable)(t) && (a = t.playlist, r = a[0].creator, a && n.loginDone(r), n.loadMask('loaded'));
            case 5:
            case "end":
              return s.stop();
          }
        }, null, this);
      }, n.onNeteaseMessage = function (e) {
        var t, a;
        return regeneratorRuntime.async(function (r) {
          for (;;) switch (r.prev = r.next) {
            case 0:
              t = e.profile;
              a = e.token;
              t && n.loginDone(t);
              a && cookies.default.set('https://music.163.com', {
                name: 'MUSIC_U',
                value: a
              });
            case 3:
            case "end":
              return r.stop();
          }
        }, null, this);
      }, n.loginDone = function (e) {
        return regeneratorRuntime.async(function (t) {
          for (;;) switch (t.prev = t.next) {
            case 0:
              if (e) {
                t.next = 2;
                break;
              }
              return t.abrupt("return");
            case 2:
              n.setState({
                avatar: e.avatarUrl,
                nickname: e.nickname
              });
              n.netEaselikelist();
              users.default.saveUserStorage(e, providers.default.netEase);
              toast(locales.default.LOG_IN_SUCCESS);
              setTimeout(function () {
                events.emitter.emit(names.default.UserLogined);
              }, 1e3);
              t.next = 9;
              return regeneratorRuntime.awrap(services.Netease.login_refresh());
            case 9:
            case "end":
              return t.stop();
          }
        }, null, this);
      }, n.loadMask = function (e) {
        switch (e) {
          case 'loading':
            n.setState({
              loading: true
            });
            break;
          case 'loaded':
            n.setState({
              loading: false
            });
        }
      }, n.onWebviewClosed = function () {
        n.setState({
          showWebView: false
        });
      }, n.onWebview = function (e) {
        var t = null;
        'netease_weibo' === e ? t = y : 'netease_qq' === e && (t = k);
        n.setState({
          webViewUrl: t,
          showWebView: true
        });
      }, n.onUserManager = function () {
        return n.props.navigation.navigate('UserManager');
      }, n.onSelected = function (e) {
        n.loadMask('loading');
        n.getPlaylist(e.userId);
        n.setState({
          modalOpen: false
        });
      }, n.netEaseText = function (e, t) {
        switch (t) {
          case 'account':
            n.setState({
              account: e
            });
            break;
          case 'password':
            n.setState({
              password: e
            });
        }
      }, n.clearStorage = function (e) {
        switch (e) {
          case keys.default.userInfo:
            storage.remove({
              key: keys.default.userInfo
            }).catch(function () {
              toast(locales.default.ERROR);
            });
            break;
          case keys.default.playlist:
            storage.remove({
              key: keys.default.playlist
            }).catch(function () {
              toast(locales.default.ERROR);
            });
            storage.remove({
              key: keys.default.likelist
            }).then(function (e) {
              return e;
            }).catch(function (e) {
              return e;
            });
            storage.remove({
              key: keys.default.netEasePlaylistCache
            }).then(function (e) {
              return e;
            }).catch(function (e) {
              return e;
            });
        }
      }, a));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        this.loadInfo();
      }
    }, {
      key: "render",
      value: function () {
        var e = this,
          t = this.state,
          a = t.avatar,
          n = t.nickname,
          r = t.showWebView,
          s = t.webViewUrl;
        return React.default.createElement(components.PageContainer, {
          title: locales.default.NETEASE_MUSIC,
          goBack: function () {
            return e.props.navigation.goBack();
          },
          rightIcon: {
            name: icons.default.HELP_CIRCLE_OUTLINE,
            onPress: function () {
              return e.setState({
                guideModalOpen: true
              });
            }
          }
        }, React.default.createElement(reactNativeSpringScrollview.SpringScrollView, null, React.default.createElement(LoginView.default, {
          avatar: a,
          nickname: n,
          _Login: this._Login,
          otherWay: this.otherWay,
          onChangeText: this.netEaseText,
          onMessage: this.onNeteaseMessage,
          loginOut: this.NeteaseLoginOut,
          onUserManager: this.onUserManager,
          onWebview: this.onWebview,
          api: providers.default.netEase
        })), React.default.createElement(M, {
          onMessage: this.onNeteaseMessage,
          loginOut: this.NeteaseLoginOut,
          visible: r,
          onClosed: this.onWebviewClosed,
          url: s
        }), true === this.state.loading ? React.default.createElement(ReactNative.View, {
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center'
          }
        }, React.default.createElement(ReactNative.View, {
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)'
          }
        }), React.default.createElement(components.Spinkit, null)) : null, React.default.createElement(modals.SearchUser, {
          isOpen: this.state.modalOpen,
          onModalClose: function () {
            return e.setState({
              modalOpen: false
            });
          },
          onSelected: this.onSelected
        }), React.default.createElement(NeteaseHelp.default, {
          isOpen: this.state.guideModalOpen,
          onRequestClose: function () {
            return e.setState({
              guideModalOpen: false
            });
          }
        }));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent),
  M = function (e) {
    function t() {
      var e, a, n;
      babelHelpers.classCallCheck(this, t);
      for (var r = arguments.length, s = new Array(r), o = 0; o < r; o++) s[o] = arguments[o];
      return babelHelpers.possibleConstructorReturn(n, (a = n = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(s))), n.received = false, n.state = {
        injecting: false,
        injectedUrl: ''
      }, n.getJSON = function (e) {
        var t;
        try {
          t = e.match(/profile.+playlistBeSubscribedCount/) ? e.replace(/bindings.+\}\]/g, '').slice(0, -3) + '}' : e;
          var a = JSON.parse(t);
          return 'object' == typeof a ? a : null;
        } catch (e) {
          return null;
        }
      }, n.onMessage = function (e) {
        if (!n.received) {
          var t = n.getJSON(e.nativeEvent.data);
          if (t) {
            var a = t.profile,
              r = a.userId,
              s = a.code;
            !r || r < 0 || 401 === s ? (n.props.loginOut(), toast(locales.default.NETEASE_LOGIN_RETRY)) : n.props.onMessage(t);
            n.props.onClosed();
            n.received = true;
          }
        }
      }, n.onNavigationStateChange = function (e) {
        if (e.url.match('music.163.com/back/sns')) {
          if (e.url.match('code=401')) {
            toast('\u6388\u6743\u51fa\u73b0\u5f02\u5e38');
            n.props.loginOut();
            return void n.props.onClosed();
          }
          toast(locales.default.NETEASE_LOGIN_FROM_CLIPBOARD);
          n.setState({
            injecting: true,
            injectedUrl: e.url
          });
        }
      }, a));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        var e = this.props,
          t = e.visible,
          a = e.onClosed,
          n = e.url,
          r = this.state,
          s = r.injecting,
          l = r.injectedUrl;
        return React.default.createElement(ReactNative.Modal, {
          animationType: "fade",
          transparent: true,
          visible: t,
          onRequestClose: a
        }, React.default.createElement(ReactNative.View, {
          style: {
            backgroundColor: '#000',
            width: '100%',
            height: '100%'
          }
        }, n === k && !s && React.default.createElement(ReactNative.WebView, {
          style: {
            flex: 1
          },
          source: {
            uri: k
          },
          onNavigationStateChange: this.onNavigationStateChange,
          javaScriptEnabled: true,
          domStorageEnabled: true,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.30 Safari/537.36'
        }), n === y && React.default.createElement(ReactNative.WebView, {
          style: {
            flex: 1
          },
          source: {
            uri: y
          },
          onNavigationStateChange: this.onNavigationStateChange,
          javaScriptEnabled: true,
          domStorageEnabled: true,
          injectedJavaScript: O,
          onMessage: this.onMessage
        }), s && l && React.default.createElement(ReactNative.WebView, {
          style: {
            flex: 1
          },
          source: {
            uri: l
          },
          onNavigationStateChange: this.onNavigationStateChange,
          javaScriptEnabled: true,
          domStorageEnabled: true,
          injectedJavaScript: O,
          onMessage: this.onMessage
        })));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent),
  O = "\n  function post() {\n    function message(){\n      if (window.postMessage) {\n        window.postMessage(document.body.innerHTML);\n      }\n    }\n    setInterval(message, 500);\n  }\n  post();\n  ",
  N = _;
exports.default = N;
