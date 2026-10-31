import {toast} from '../native/toast';
import {WebView} from 'react-native-webview';
import cookiesModule from '../native/cookies';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeSpringScrollview from './../components/Scrolling.js';
import * as components from '../components/index';
import providers from '../services/providers';
import names from '../events/names';
import icons from '../theme/icons';
import locales from '../locales/index';
import * as services from '../services/index';
import * as events from '../events/index';
import '../utils/types';
import users from '../storage/users';
import LoginView from '../components/LoginView';
import QQMusicHelp from './login/QQMusicHelp';
const _ =
  'http://ui.ptlogin2.qq.com/cgi-bin/login?pt_no_auth=1&pt_wxtest=1&pt_no_onekey=1&daid=384&style=9&hln_css=https%3A%2F%2Fy.gtimg.cn%2Fmusic%2Fcommon%2Fupload%2Ft_cm3_photo_publish%2F1117688.png%3Fmax_age%3D2592000&appid=83886593&s_url=https%3A%2F%2Fy.qq.com%2Fm%2Flogin%2Fredirect.html%3Flogin_type%3D1%26surl%3Dhttp://y.qq.com/portal/profile.html';
const y =
  'http://open.weixin.qq.com/connect/qrconnect?appid=wx48db31d50e334801&redirect_uri=https%3A%2F%2Fy.qq.com%2Fportal%2Fwx_redirect.html%3Flogin_type%3D2%26surl%3Dhttps%3A%2F%2Fy.qq.com%2Fportal%2Fprofile.html&response_type=code&scope=snsapi_login&state=STATE&href=https%3A%2F%2Fy.gtimg.cn%2Fmediastyle%2Fyqq%2Fpopup_wechat.css#wechat_redirect';
class QQMusicLogin extends React.PureComponent {
  state = {
    loading: false,
    avatar: '',
    nickname: '',
    modalOpen: false,
    api: providers.qqMusic,
    tipModalOpen: false,
    searchText: '',
    showWebView: false,
    url: null,
  };
  loadInfo = async () => {
    const account = (await users.getUserInfo())?.qqMusic;
    if (account) {
      this.setState({
        nickname: account.nickname,
        avatar: account.avatarUrl,
      });
    }
  };
  loadMask = (e) => {
    switch (e) {
      case 'loading':
        this.setState({
          loading: true,
        });
        break;
      case 'loaded':
        this.setState({
          loading: false,
        });
    }
  };
  onWebview = (e) => {
    let webViewUrl = null;
    if (e === 'qqmusic_wechat') {
      webViewUrl = y;
    } else if (e === 'qqmusic_qq') {
      webViewUrl = _;
    }
    this.setState({
      webViewUrl,
      showWebView: true,
    });
  };
  onWebviewClosed = () => {
    this.setState({
      showWebView: false,
    });
  };
  qqMusicText = (searchText) => {
    this.setState({
      searchText,
    });
  };
  _qqMusicLogin = async () => {
    const searchText = this.state.searchText;
    if (!searchText) {
      toast(locales.INPUT_SOMETHING);
      return;
    }
    this.loadMask('loading');
    try {
      const response = await services.QQMusic.profile(searchText);
      if (!response?.mymusic) {
        throw new Error(locales.PLAYLIST_FETCH_FAILED);
      }
      const liked = response.mymusic.find(
        (item) => item.title === '喜欢' || item.title === '我喜欢',
      );
      if (!liked || liked.type === 0) {
        throw new Error(locales.PLAYLIST_PRIVATE);
      }
      const created = await services.QQMusic.user_created_list(searchText);
      await users.saveUserStorage(response.creator, providers.qqMusic);
      await users.saveUserPlayList([liked, ...response.mydiss.list, ...created], providers.qqMusic);
      this.setState({
        avatar: response.creator.headpic,
        nickname: response.creator.nick,
      });
      events.emitter.emit(names.UserLogined);
    } catch (error) {
      toast(error.message);
    } finally {
      this.loadMask('loaded');
    }
  };
  qqMusicLikelist = function (e) {
    services.QQMusic.disslist({
      id: e.id,
    })
      .then((e) => {
        if (!(e.length < 1)) {
          const t = [];
          e[0].songlist.map((e) => {
            t.push(e.songmid);
          });
          users.saveUserLikeList(t, providers.qqMusic);
        }
      })
      .catch((e) => e);
  };
  onQQMusicMessage = async ({nickname, avatarUrl, cookies}) => {
    if (!avatarUrl || this.loginPending) {
      return;
    }
    this.loginPending = true;
    try {
      await cookiesModule.setFromResponse('https://c.y.qq.com', cookies);
      const qq = services.QQMusic.getCookie('uin', cookies).replace(/o/, '');
      const response = await services.QQMusic.profile(qq);
      if (!response?.mymusic) {
        throw new Error(locales.PLAYLIST_FETCH_FAILED);
      }
      const liked = response.mymusic.find(
        (item) => item.title === '喜欢' || item.title === '我喜欢',
      );
      if (!liked) {
        throw new Error(locales.PLAYLIST_FETCH_FAILED);
      }
      await users.saveUserStorage(
        {
          ...response.creator,
          cookies,
        },
        providers.qqMusic,
      );
      await users.saveUserPlayList([liked, ...response.mydiss.list], providers.qqMusic);
      this.setState({
        avatar: avatarUrl,
        nickname,
        showWebView: false,
      });
      await this.qqMusicLikelist(liked);
      events.emitter.emit(names.UserLogined);
    } catch (error) {
      toast(`登录失败：${error.message}`);
    } finally {
      this.loginPending = false;
    }
  };
  componentDidMount() {
    this.loadInfo();
  }
  render() {
    const e = this;
    const state = this.state;
    const {avatar, nickname, showWebView, webViewUrl} = state;
    return (
      <components.PageContainer
        style={{
          flex: 1,
          alignItems: 'center',
        }}
        title={locales.QQ_MUSIC}
        goBack={function () {
          return e.props.navigation.goBack();
        }}
        headerStyle={{
          marginBottom: 30,
        }}
        rightIcon={{
          name: icons.HELP_CIRCLE_OUTLINE,
          onPress: function () {
            return e.setState({
              tipModalOpen: true,
            });
          },
        }}
      >
        <reactNativeSpringScrollview.SpringScrollView>
          <LoginView
            avatar={avatar}
            nickname={nickname}
            _Login={this._qqMusicLogin}
            onChangeText={this.qqMusicText}
            onMessage={this.onQQMusicMessage}
            onWebview={this.onWebview}
            api={providers.qqMusic}
          />
        </reactNativeSpringScrollview.SpringScrollView>
        {React.createElement(QQMusicLoginScreen, {
          onMessage: this.onQQMusicMessage,
          visible: showWebView,
          onClosed: this.onWebviewClosed,
          url: webViewUrl,
        })}
        {this.state.loading === true ? (
          <ReactNative.View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ReactNative.View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
              }}
            />
            <components.Spinkit />
          </ReactNative.View>
        ) : null}
        <QQMusicHelp
          isOpen={this.state.tipModalOpen}
          onRequestClose={function () {
            return e.setState({
              tipModalOpen: false,
            });
          }}
        />
      </components.PageContainer>
    );
  }
}
class QQMusicLoginScreen extends React.PureComponent {
  onNavigationStateChange = (e) => {
    if (e.url.match('ptlogin2.y.qq.com')) {
      this.setState(
        {
          webView: false,
          nav: false,
        },
        () => {
          this.setState({
            webView: true,
            loginUrl: e.url,
          });
        },
      );
    }
  };
  login = (e) => {
    if (e === 'wechat') {
      toast(locales.WECHAT_LOGIN_LIMIT);
    }
    this.props.onClosed();
  };
  onMessage = (e) => {
    try {
      const t = JSON.parse(e.nativeEvent.data);
      if (t.avatarUrl) {
        this.props.onMessage(t);
        this.login();
      }
    } catch (error) {
      return error;
    }
  };
  render() {
    const props = this.props;
    const {visible, onClosed, url} = props;
    return (
      <ReactNative.Modal
        animationType={'fade'}
        transparent={true}
        visible={visible}
        onRequestClose={function () {
          onClosed();
        }}
      >
        <ReactNative.View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        >
          <WebView
            style={{
              flex: 1,
            }}
            source={{
              uri: url,
            }}
            onMessage={this.onMessage}
            injectedJavaScript={injectedJavaScript}
            automaticallyAdjustContentInsets={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onNavigationStateChange={this.onNavigationStateChange}
            userAgent={
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36'
            }
          />
        </ReactNative.View>
      </ReactNative.Modal>
    );
  }
}
var injectedJavaScript =
  "\nfunction post() {\n  function message(){\n    if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {\n      var avatar = document.getElementById('profileHead');\n      var nickname = document.getElementsByClassName('profile__name');\n      var avatar_pe = document.querySelector('.user__avator');\n      if(avatar){\n        var obj = JSON.stringify({\n          avatarUrl:avatar.src,\n          nickname:nickname[0].innerText,\n          cookies:document.cookie\n        });\n        window.ReactNativeWebView.postMessage(obj);\n      }\n      if(avatar_pe) {\n          var username = document.querySelector('.user__name_text');\n          var obj = JSON.stringify({\n              avatarUrl:avatar_pe.src,\n              nickname:username.innerText,\n              cookies:document.cookie\n          });\n          window.ReactNativeWebView.postMessage(obj);\n      }\n    }\n  }\n  setInterval(message, 500);\n}\npost();\n";
export default QQMusicLogin;
