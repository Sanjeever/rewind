Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var cookies = babelHelpers.interopRequireDefault(require("@react-native-community/cookies")),
  React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeSpringScrollview = require("react-native-spring-scrollview"),
  components = require("../components/index"),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  names = babelHelpers.interopRequireDefault(require("../events/names")),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  services = require("../services/index"),
  events = require("../events/index"),
  types = babelHelpers.interopRequireWildcard(require("../utils/types")),
  users = babelHelpers.interopRequireDefault(require("../storage/users")),
  LoginView = babelHelpers.interopRequireDefault(require("../components/LoginView")),
  QQMusicHelp = babelHelpers.interopRequireDefault(require("./login/QQMusicHelp")),
  _ = 'http://ui.ptlogin2.qq.com/cgi-bin/login?pt_no_auth=1&pt_wxtest=1&pt_no_onekey=1&daid=384&style=9&hln_css=https%3A%2F%2Fy.gtimg.cn%2Fmusic%2Fcommon%2Fupload%2Ft_cm3_photo_publish%2F1117688.png%3Fmax_age%3D2592000&appid=83886593&s_url=https%3A%2F%2Fy.qq.com%2Fm%2Flogin%2Fredirect.html%3Flogin_type%3D1%26surl%3Dhttp://y.qq.com/portal/profile.html',
  y = 'http://open.weixin.qq.com/connect/qrconnect?appid=wx48db31d50e334801&redirect_uri=https%3A%2F%2Fy.qq.com%2Fportal%2Fwx_redirect.html%3Flogin_type%3D2%26surl%3Dhttps%3A%2F%2Fy.qq.com%2Fportal%2Fprofile.html&response_type=code&scope=snsapi_login&state=STATE&href=https%3A%2F%2Fy.gtimg.cn%2Fmediastyle%2Fyqq%2Fpopup_wechat.css#wechat_redirect',
  M = function (e) {
    function t() {
      var e, a, n;
      babelHelpers.classCallCheck(this, t);
      for (var r = arguments.length, s = new Array(r), o = 0; o < r; o++) s[o] = arguments[o];
      return babelHelpers.possibleConstructorReturn(n, (a = n = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(s))), n.state = {
        loading: false,
        avatar: '',
        nickname: '',
        modalOpen: false,
        api: providers.default.qqMusic,
        tipModalOpen: false,
        searchText: '',
        showWebView: false,
        url: null
      }, n.loadInfo = function () {
        var e, t, a, r;
        return regeneratorRuntime.async(function (i) {
          for (;;) switch (i.prev = i.next) {
            case 0:
              i.next = 2;
              return regeneratorRuntime.awrap(users.default.getUserInfo());
            case 2:
              e = i.sent;
              types.isObject(e) && types.isObject(e.qqMusic) && (t = e.qqMusic, a = t.nickname, r = t.avatarUrl, n.setState({
                nickname: a,
                avatar: r
              }));
            case 4:
            case "end":
              return i.stop();
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
      }, n.onWebview = function (e) {
        var t = null;
        'qqmusic_wechat' === e ? t = y : 'qqmusic_qq' === e && (t = _);
        n.setState({
          webViewUrl: t,
          showWebView: true
        });
      }, n.onWebviewClosed = function () {
        n.setState({
          showWebView: false
        });
      }, n.qqMusicText = function (e) {
        n.setState({
          searchText: e
        });
      }, n._qqMusicLogin = function () {
        var e, t, a, r, i, s, o, l;
        return regeneratorRuntime.async(function (u) {
          for (;;) switch (u.prev = u.next) {
            case 0:
              if ('' !== (e = n.state.searchText)) {
                u.next = 4;
                break;
              }
              toast(locales.default.INPUT_SOMETHING);
              return u.abrupt("return");
            case 4:
              n.loadMask('loading');
              u.next = 7;
              return regeneratorRuntime.awrap(services.QQMusic.profile(e));
            case 7:
              if (t = u.sent) {
                u.next = 11;
                break;
              }
              toast(locales.default.PLAYLIST_FETCH_FAILED);
              return u.abrupt("return");
            case 11:
              u.next = 13;
              return regeneratorRuntime.awrap(services.QQMusic.user_created_list(e));
            case 13:
              a = u.sent;
              r = t.creator;
              i = t.mymusic;
              s = t.mydiss;
              i ? (n.setState({
                avatar: r.headpic,
                nickname: r.nick
              }), 0 !== (o = i.find(function (e) {
                return '\u559c\u6b22' === e.title || '\u6211\u559c\u6b22' === e.title;
              })).type ? (l = [o].concat(babelHelpers.toConsumableArray(s.list), babelHelpers.toConsumableArray(a)), users.default.saveUserStorage(r, providers.default.qqMusic), users.default.saveUserPlayList(l, providers.default.qqMusic), toast(locales.default.PLAYLIST_FETCH_SUCCESS)) : toast(locales.default.PLAYLIST_PRIVATE), setTimeout(function () {
                events.emitter.emit(names.default.UserLogined);
              }, 1e3)) : toast(locales.default.PLAYLIST_FETCH_FAILED);
              n.loadMask('loaded');
            case 17:
            case "end":
              return u.stop();
          }
        }, null, this);
      }, n.qqMusicLikelist = function (e) {
        services.QQMusic.disslist({
          id: e.id
        }).then(function (e) {
          if (!(e.length < 1)) {
            var t = [];
            e[0].songlist.map(function (e) {
              t.push(e.songmid);
            });
            users.default.saveUserLikeList(t, providers.default.qqMusic);
          }
        }).catch(function (e) {
          return e;
        });
      }, n.onQQMusicMessage = function (e) {
        var t = e.nickname,
          a = e.avatarUrl,
          r = e.cookies;
        if (a) {
          n.setState({
            avatar: a,
            nickname: t
          });
          toast(locales.default.LOG_IN_SUCCESS);
          var s = services.QQMusic.getCookie('uin', r).replace(/o/, '');
          services.QQMusic.profile(s).then(function (e) {
            var t = e.mymusic,
              a = e.mydiss,
              i = e.creator,
              s = t.find(function (e) {
                return '\u559c\u6b22' === e.title || '\u6211\u559c\u6b22' === e.title;
              }),
              o = [s].concat(babelHelpers.toConsumableArray(a.list));
            i.cookies = r;
            users.default.saveUserStorage(i, providers.default.qqMusic);
            users.default.saveUserPlayList(o, providers.default.qqMusic);
            n.qqMusicLikelist(s);
            setTimeout(function () {
              events.emitter.emit(names.default.UserLogined);
            }, 1e3);
          }).catch(function () {
            toast(locales.default.ERROR);
          });
          cookies.default.setFromResponse('http://c.y.qq.com', r).then(function (e) {
            return toast(e);
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
          i = t.webViewUrl;
        return React.default.createElement(components.PageContainer, {
          style: {
            flex: 1,
            alignItems: 'center'
          },
          title: locales.default.QQ_MUSIC,
          goBack: function () {
            return e.props.navigation.goBack();
          },
          headerStyle: {
            marginBottom: 30
          },
          rightIcon: {
            name: icons.default.HELP_CIRCLE_OUTLINE,
            onPress: function () {
              return e.setState({
                tipModalOpen: true
              });
            }
          }
        }, React.default.createElement(reactNativeSpringScrollview.SpringScrollView, null, React.default.createElement(LoginView.default, {
          avatar: a,
          nickname: n,
          _Login: this._qqMusicLogin,
          onChangeText: this.qqMusicText,
          onMessage: this.onQQMusicMessage,
          onWebview: this.onWebview,
          api: providers.default.qqMusic
        })), React.default.createElement(w, {
          onMessage: this.onQQMusicMessage,
          visible: r,
          onClosed: this.onWebviewClosed,
          url: i
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
        }), React.default.createElement(components.Spinkit, null)) : null, React.default.createElement(QQMusicHelp.default, {
          isOpen: this.state.tipModalOpen,
          onRequestClose: function () {
            return e.setState({
              tipModalOpen: false
            });
          }
        }));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent),
  w = function (e) {
    function t() {
      var e, a, n;
      babelHelpers.classCallCheck(this, t);
      for (var r = arguments.length, i = new Array(r), s = 0; s < r; s++) i[s] = arguments[s];
      return babelHelpers.possibleConstructorReturn(n, (a = n = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(i))), n.onNavigationStateChange = function (e) {
        e.url.match('ptlogin2.y.qq.com') && n.setState({
          webView: false,
          nav: false
        }, function () {
          n.setState({
            webView: true,
            loginUrl: e.url
          });
        });
      }, n.login = function (e) {
        'wechat' === e && toast(locales.default.WECHAT_LOGIN_LIMIT);
        n.props.onClosed();
      }, n.onMessage = function (e) {
        try {
          var t = JSON.parse(e.nativeEvent.data);
          t.avatarUrl && (n.props.onMessage(t), n.login());
        } catch (e) {
          return e;
        }
      }, a));
    }
    babelHelpers.createClass(t, [{
      key: "render",
      value: function () {
        var e = this.props,
          t = e.visible,
          a = e.onClosed,
          n = e.url;
        return React.default.createElement(ReactNative.Modal, {
          animationType: "fade",
          transparent: true,
          visible: t,
          onRequestClose: function () {
            a();
          }
        }, React.default.createElement(ReactNative.View, {
          style: {
            position: 'absolute',
            width: '100%',
            height: '100%'
          }
        }, React.default.createElement(ReactNative.WebView, {
          style: {
            flex: 1
          },
          source: {
            uri: n
          },
          onMessage: this.onMessage,
          injectedJavaScript: C,
          automaticallyAdjustContentInsets: false,
          javaScriptEnabled: true,
          domStorageEnabled: true,
          onNavigationStateChange: this.onNavigationStateChange,
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36'
        })));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent),
  C = "\nfunction post() {\n  function message(){\n    if (window.postMessage) {\n      var avatar = document.getElementById('profileHead');\n      var nickname = document.getElementsByClassName('profile__name');\n      var avatar_pe = document.querySelector('.user__avator');\n      if(avatar){\n        var obj = JSON.stringify({\n          avatarUrl:avatar.src,\n          nickname:nickname[0].innerText,\n          cookies:document.cookie\n        });\n        window.postMessage(obj);\n      }\n      if(avatar_pe) {\n          var username = document.querySelector('.user__name_text');\n          var obj = JSON.stringify({\n              avatarUrl:avatar_pe.src,\n              nickname:username.innerText,\n              cookies:document.cookie\n          });\n          window.postMessage(obj);\n      }\n    }\n  }\n  setInterval(message, 500);\n}\npost();\n",
  S = M;
exports.default = S;
