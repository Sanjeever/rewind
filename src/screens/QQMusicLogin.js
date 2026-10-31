const _WebView = require('react-native-webview').WebView;
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var cookiesModule = _interopRequireDefault(require('../native/cookies')),
  React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  reactNativeSpringScrollview = require('./../components/Scrolling.js'),
  components = require('../components/index'),
  providers = _interopRequireDefault(require('../services/providers')),
  names = _interopRequireDefault(require('../events/names')),
  icons = _interopRequireDefault(require('../theme/icons')),
  locales = _interopRequireDefault(require('../locales/index')),
  services = require('../services/index'),
  events = require('../events/index'),
  types = _interopRequireWildcard(require('../utils/types')),
  users = _interopRequireDefault(require('../storage/users')),
  LoginView = _interopRequireDefault(require('../components/LoginView')),
  QQMusicHelp = _interopRequireDefault(require('./login/QQMusicHelp')),
  _ =
    'http://ui.ptlogin2.qq.com/cgi-bin/login?pt_no_auth=1&pt_wxtest=1&pt_no_onekey=1&daid=384&style=9&hln_css=https%3A%2F%2Fy.gtimg.cn%2Fmusic%2Fcommon%2Fupload%2Ft_cm3_photo_publish%2F1117688.png%3Fmax_age%3D2592000&appid=83886593&s_url=https%3A%2F%2Fy.qq.com%2Fm%2Flogin%2Fredirect.html%3Flogin_type%3D1%26surl%3Dhttp://y.qq.com/portal/profile.html',
  y =
    'http://open.weixin.qq.com/connect/qrconnect?appid=wx48db31d50e334801&redirect_uri=https%3A%2F%2Fy.qq.com%2Fportal%2Fwx_redirect.html%3Flogin_type%3D2%26surl%3Dhttps%3A%2F%2Fy.qq.com%2Fportal%2Fprofile.html&response_type=code&scope=snsapi_login&state=STATE&href=https%3A%2F%2Fy.gtimg.cn%2Fmediastyle%2Fyqq%2Fpopup_wechat.css#wechat_redirect',
  M = class t extends React.PureComponent {
    constructor() {
      var e, a, n;
      for (var r = arguments.length, s = new Array(r), o = 0; o < r; o++) s[o] = arguments[o];
      return (
        (a = n = super(...s)),
        (n.state = {
          loading: false,
          avatar: '',
          nickname: '',
          modalOpen: false,
          api: providers.default.qqMusic,
          tipModalOpen: false,
          searchText: '',
          showWebView: false,
          url: null,
        }),
        (n.loadInfo = async function () {
          const account = (await users.default.getUserInfo())?.qqMusic;
          if (account)
            n.setState({
              nickname: account.nickname,
              avatar: account.avatarUrl,
            });
        }),
        (n.loadMask = function (e) {
          switch (e) {
            case 'loading':
              n.setState({
                loading: true,
              });
              break;
            case 'loaded':
              n.setState({
                loading: false,
              });
          }
        }),
        (n.onWebview = function (e) {
          var t = null;
          'qqmusic_wechat' === e ? (t = y) : 'qqmusic_qq' === e && (t = _);
          n.setState({
            webViewUrl: t,
            showWebView: true,
          });
        }),
        (n.onWebviewClosed = function () {
          n.setState({
            showWebView: false,
          });
        }),
        (n.qqMusicText = function (e) {
          n.setState({
            searchText: e,
          });
        }),
        (n._qqMusicLogin = async function () {
          const qq = n.state.searchText;
          if (!qq) {
            toast(locales.default.INPUT_SOMETHING);
            return;
          }
          n.loadMask('loading');
          try {
            const response = await services.QQMusic.profile(qq);
            if (!response?.mymusic) throw new Error(locales.default.PLAYLIST_FETCH_FAILED);
            const liked = response.mymusic.find(
              (item) => item.title === '喜欢' || item.title === '我喜欢',
            );
            if (!liked || liked.type === 0) throw new Error(locales.default.PLAYLIST_PRIVATE);
            const created = await services.QQMusic.user_created_list(qq);
            await users.default.saveUserStorage(response.creator, providers.default.qqMusic);
            await users.default.saveUserPlayList(
              [liked, ...response.mydiss.list, ...created],
              providers.default.qqMusic,
            );
            n.setState({
              avatar: response.creator.headpic,
              nickname: response.creator.nick,
            });
            events.emitter.emit(names.default.UserLogined);
          } catch (error) {
            toast(error.message);
          } finally {
            n.loadMask('loaded');
          }
        }),
        (n.qqMusicLikelist = function (e) {
          services.QQMusic.disslist({
            id: e.id,
          })
            .then(function (e) {
              if (!(e.length < 1)) {
                var t = [];
                e[0].songlist.map(function (e) {
                  t.push(e.songmid);
                });
                users.default.saveUserLikeList(t, providers.default.qqMusic);
              }
            })
            .catch(function (e) {
              return e;
            });
        }),
        (n.onQQMusicMessage = async function ({nickname, avatarUrl, cookies}) {
          if (!avatarUrl || n.loginPending) return;
          n.loginPending = true;
          try {
            await cookiesModule.default.setFromResponse('https://c.y.qq.com', cookies);
            const qq = services.QQMusic.getCookie('uin', cookies).replace(/o/, '');
            const response = await services.QQMusic.profile(qq);
            if (!response?.mymusic) throw new Error(locales.default.PLAYLIST_FETCH_FAILED);
            const liked = response.mymusic.find(
              (item) => item.title === '喜欢' || item.title === '我喜欢',
            );
            if (!liked) throw new Error(locales.default.PLAYLIST_FETCH_FAILED);
            await users.default.saveUserStorage(
              {
                ...response.creator,
                cookies,
              },
              providers.default.qqMusic,
            );
            await users.default.saveUserPlayList(
              [liked, ...response.mydiss.list],
              providers.default.qqMusic,
            );
            n.setState({
              avatar: avatarUrl,
              nickname,
              showWebView: false,
            });
            await n.qqMusicLikelist(liked);
            events.emitter.emit(names.default.UserLogined);
          } catch (error) {
            toast('登录失败：' + error.message);
          } finally {
            n.loginPending = false;
          }
        }),
        a
      );
    }
    componentDidMount() {
      this.loadInfo();
    }
    render() {
      var e = this,
        t = this.state,
        a = t.avatar,
        n = t.nickname,
        r = t.showWebView,
        i = t.webViewUrl;
      return React.default.createElement(
        components.PageContainer,
        {
          style: {
            flex: 1,
            alignItems: 'center',
          },
          title: locales.default.QQ_MUSIC,
          goBack: function () {
            return e.props.navigation.goBack();
          },
          headerStyle: {
            marginBottom: 30,
          },
          rightIcon: {
            name: icons.default.HELP_CIRCLE_OUTLINE,
            onPress: function () {
              return e.setState({
                tipModalOpen: true,
              });
            },
          },
        },
        React.default.createElement(
          reactNativeSpringScrollview.SpringScrollView,
          null,
          React.default.createElement(LoginView.default, {
            avatar: a,
            nickname: n,
            _Login: this._qqMusicLogin,
            onChangeText: this.qqMusicText,
            onMessage: this.onQQMusicMessage,
            onWebview: this.onWebview,
            api: providers.default.qqMusic,
          }),
        ),
        React.default.createElement(w, {
          onMessage: this.onQQMusicMessage,
          visible: r,
          onClosed: this.onWebviewClosed,
          url: i,
        }),
        true === this.state.loading
          ? React.default.createElement(
              ReactNative.View,
              {
                style: {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              },
              React.default.createElement(ReactNative.View, {
                style: {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                },
              }),
              React.default.createElement(components.Spinkit, null),
            )
          : null,
        React.default.createElement(QQMusicHelp.default, {
          isOpen: this.state.tipModalOpen,
          onRequestClose: function () {
            return e.setState({
              tipModalOpen: false,
            });
          },
        }),
      );
    }
  },
  w = class t extends React.PureComponent {
    constructor() {
      var e, a, n;
      for (var r = arguments.length, i = new Array(r), s = 0; s < r; s++) i[s] = arguments[s];
      return (
        (a = n = super(...i)),
        (n.onNavigationStateChange = function (e) {
          e.url.match('ptlogin2.y.qq.com') &&
            n.setState(
              {
                webView: false,
                nav: false,
              },
              function () {
                n.setState({
                  webView: true,
                  loginUrl: e.url,
                });
              },
            );
        }),
        (n.login = function (e) {
          'wechat' === e && toast(locales.default.WECHAT_LOGIN_LIMIT);
          n.props.onClosed();
        }),
        (n.onMessage = function (e) {
          try {
            var t = JSON.parse(e.nativeEvent.data);
            t.avatarUrl && (n.props.onMessage(t), n.login());
          } catch (e) {
            return e;
          }
        }),
        a
      );
    }
    render() {
      var e = this.props,
        t = e.visible,
        a = e.onClosed,
        n = e.url;
      return React.default.createElement(
        ReactNative.Modal,
        {
          animationType: 'fade',
          transparent: true,
          visible: t,
          onRequestClose: function () {
            a();
          },
        },
        React.default.createElement(
          ReactNative.View,
          {
            style: {
              position: 'absolute',
              width: '100%',
              height: '100%',
            },
          },
          React.default.createElement(_WebView, {
            style: {
              flex: 1,
            },
            source: {
              uri: n,
            },
            onMessage: this.onMessage,
            injectedJavaScript: C,
            automaticallyAdjustContentInsets: false,
            javaScriptEnabled: true,
            domStorageEnabled: true,
            onNavigationStateChange: this.onNavigationStateChange,
            userAgent:
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
          }),
        ),
      );
    }
  },
  C =
    "\nfunction post() {\n  function message(){\n    if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {\n      var avatar = document.getElementById('profileHead');\n      var nickname = document.getElementsByClassName('profile__name');\n      var avatar_pe = document.querySelector('.user__avator');\n      if(avatar){\n        var obj = JSON.stringify({\n          avatarUrl:avatar.src,\n          nickname:nickname[0].innerText,\n          cookies:document.cookie\n        });\n        window.ReactNativeWebView.postMessage(obj);\n      }\n      if(avatar_pe) {\n          var username = document.querySelector('.user__name_text');\n          var obj = JSON.stringify({\n              avatarUrl:avatar_pe.src,\n              nickname:username.innerText,\n              cookies:document.cookie\n          });\n          window.ReactNativeWebView.postMessage(obj);\n      }\n    }\n  }\n  setInterval(message, 500);\n}\npost();\n",
  S = M;
exports.default = S;
