const _WebView = require("react-native-webview").WebView;
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _appStorage = require("./../storage/index.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var cookies = _interopRequireDefault(require("../native/cookies")),
  React = _interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeSpringScrollview = require("./../components/Scrolling.js"),
  components = require("../components/index"),
  modals = require("../modals/index"),
  providers = _interopRequireDefault(require("../services/providers")),
  names = _interopRequireDefault(require("../events/names")),
  icons = _interopRequireDefault(require("../theme/icons")),
  keys = _interopRequireDefault(require("../storage/keys")),
  locales = _interopRequireDefault(require("../locales/index")),
  services = require("../services/index"),
  events = require("../events/index"),
  utils = require("../utils/index"),
  types = _interopRequireWildcard(require("../utils/types")),
  users = _interopRequireDefault(require("../storage/users")),
  LoginView = _interopRequireDefault(require("../components/LoginView")),
  NeteaseHelp = _interopRequireDefault(require("./login/NeteaseHelp")),
  k = 'https://graph.qq.com/oauth2.0/show?which=Login&display=pc&client_id=100495085&response_type=code&redirect_uri=https://music.163.com/back/qq&forcelogin=true&state=ZwKHpxUoam',
  y = 'https://api.weibo.com/oauth2/authorize?client_id=301575942&response_type=code&redirect_uri=http://music.163.com/back/weibo&forcelogin=true&scope=friendships_groups_read,statuses_to_me_read,follow_app_official_microblog&state=ovYduMoJhD&checkToken=9ca17ae2e6ffcda170e2e6eeabf121bcec818fc67ba69a8fa2c85e978f8bbbee62b19cb7b4c44abaa789b0f22af0feaec3b92a91e98adaef79f8ecba90b34a939b8fb2c15b8eb1b6dadb3a888e899aec33a1b9ee9e',
  C = async function () {
    await cookies.default.set('https://music.163.com', {
      name: 'os',
      value: 'pc'
    });
    await cookies.default.set('https://music.163.com', {
      name: 'appver',
      value: '2.10.6'
    });
  },
  _ = class t extends React.PureComponent {
    constructor() {
      var e, a, n;
      for (var r = arguments.length, o = new Array(r), l = 0; l < r; l++) o[l] = arguments[l];
      return a = n = super(...o), n.state = {
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
      }, n.loadInfo = async function () {
        const account = (await users.default.getUserInfo())?.netEase;
        if (account) n.setState({
          avatar: account.avatarUrl,
          nickname: account.nickname
        });
      }, n.neteaseLoginCellphone = async function (account, password) {
        try {
          await C();
          const response = await services.Netease.login_cellphone(account, password);
          if (response?.code === 200 && response.profile) await n.loginDone(response.profile);else toast(response?.message || locales.default.ERROR);
        } catch (error) {
          toast('登录失败：' + error.message);
        } finally {
          n.loadMask('loaded');
        }
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
      }, n.neteaseLoginEmail = async function (account, password) {
        try {
          await C();
          const response = await services.Netease.login_email(account, password);
          if (response?.code === 200 && response.profile) await n.loginDone(response.profile);else toast(response?.message || locales.default.ERROR);
        } catch (error) {
          toast('登录失败：' + error.message);
        } finally {
          n.loadMask('loaded');
        }
      }, n.netEaselikelist = async function (id) {
        const response = await services.Netease.likelist(id);
        if (response?.code === 200) await users.default.saveUserLikeList(response.ids, providers.default.netEase);
      }, n.otherWay = function () {
        var e = n.state.modalOpen;
        n.setState({
          modalOpen: !e
        });
      }, n.NeteaseLoginOut = async function () {
        try {
          const response = await services.Netease.login_out();
          if (response?.code !== 200) throw new Error(response?.message || locales.default.ERROR);
          await n.clearStorage(keys.default.userInfo);
          await n.clearStorage(keys.default.playlist);
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
        } catch (error) {
          toast('退出失败：' + error.message);
        }
      }, n.getPlaylist = async function (id) {
        try {
          await n.netEaselikelist(id);
          const response = await services.Netease.user_playlist(id);
          const creator = response?.playlist?.[0]?.creator;
          if (!creator) throw new Error(locales.default.PLAYLIST_FETCH_FAILED);
          await n.loginDone(creator);
        } catch (error) {
          toast(error.message);
        } finally {
          n.loadMask('loaded');
        }
      }, n.onNeteaseMessage = async function ({
        profile,
        token
      }) {
        try {
          if (token) await cookies.default.set('https://music.163.com', {
            name: 'MUSIC_U',
            value: token
          });
          if (profile) await n.loginDone(profile);
        } catch (error) {
          toast('登录失败：' + error.message);
        }
      }, n.loginDone = async function (profile) {
        if (!profile) return;
        await users.default.saveUserStorage(profile, providers.default.netEase);
        n.setState({
          avatar: profile.avatarUrl,
          nickname: profile.nickname
        });
        events.emitter.emit(names.default.UserLogined);
        await n.netEaselikelist(profile.userId);
        await services.Netease.login_refresh();
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
      }, n.clearStorage = async function (key) {
        await users.default.removeProvider(key, providers.default.netEase);
        if (key === keys.default.playlist) {
          await users.default.removeProvider(keys.default.likelist, providers.default.netEase);
          await _appStorage.storage.remove({
            key: keys.default.netEasePlaylistCache
          });
        }
      }, a;
    }
    "componentDidMount"() {
      this.loadInfo();
    }
    "render"() {
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
  },
  M = class t extends React.PureComponent {
    constructor() {
      var e, a, n;
      for (var r = arguments.length, s = new Array(r), o = 0; o < r; o++) s[o] = arguments[o];
      return a = n = super(...s), n.received = false, n.state = {
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
      }, a;
    }
    "render"() {
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
      }, n === k && !s && React.default.createElement(_WebView, {
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
      }), n === y && React.default.createElement(_WebView, {
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
      }), s && l && React.default.createElement(_WebView, {
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
  },
  O = "\n  function post() {\n    function message(){\n      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {\n        window.ReactNativeWebView.postMessage(document.body.innerHTML);\n      }\n    }\n    setInterval(message, 500);\n  }\n  post();\n  ",
  N = _;
exports.default = N;
