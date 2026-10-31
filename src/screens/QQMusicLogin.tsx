import type {ScreenProps} from '../navigation/types';
import type {TrackId} from '../services/track';
import type {WebViewMessageEvent, WebViewNavigation} from 'react-native-webview';
import {errorMessage} from '../utils/types';
import {qqMessage} from '../features/account/loginMessages';
import type {QQMessage} from '../features/account/loginMessages';
import {toast} from '../native/toast';
import {WebView} from 'react-native-webview';
import {getWebSession, parseSession} from '../services/qqmusic/session';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeSpringScrollview from './../components/Scrolling';
import * as components from '../components/index';
import providers from '../services/providers';
import names from '../events/names';
import icons from '../theme/icons';
import locales from '../locales/index';
import * as services from '../services/index';
import * as events from '../events/index';
import '../utils/types';
import users from '../storage/users';
import LoginView from '../features/account/LoginView';
import QQMusicHelp from '../features/account/QQMusicHelp';
const loginUrl = 'https://y.qq.com/n/ryqq/profile';
interface State {
  loading: boolean;
  avatar?: string;
  nickname?: string;
  modalOpen: boolean;
  api: 'qqMusic';
  tipModalOpen: boolean;
  searchText: string;
  showWebView: boolean;
  url: null;
  webViewUrl?: string | null;
}
class QQMusicLogin extends React.PureComponent<ScreenProps<'QQMusicLogin'>, State> {
  loginPending = false;
  state: State = {
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
  loadMask = (e: 'loading' | 'loaded') => {
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
  onWebview = () => {
    this.setState({
      webViewUrl: loginUrl,
      showWebView: true,
    });
  };
  onWebviewClosed = () => {
    this.setState({
      showWebView: false,
    });
  };
  qqMusicText = (searchText: string) => {
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
      const account = (await users.getUserInfo())?.qqMusic;
      const response = await services.QQMusic.profile(searchText, account?.cookies);
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
      if (!created) throw new Error(locales.PLAYLIST_FETCH_FAILED);
      await users.saveUserStorage(response.creator, providers.qqMusic);
      await users.saveUserPlayList([liked, ...response.mydiss.list, ...created], providers.qqMusic);
      this.setState({
        avatar: response.creator.headpic,
        nickname: response.creator.nick,
      });
      events.emitter.emit(names.UserLogined);
    } catch (error) {
      toast(errorMessage(error));
    } finally {
      this.loadMask('loaded');
    }
  };
  qqMusicLikelist = async (e: {id?: TrackId}) => {
    if (!e.id) throw new Error('QQ 音乐歌单缺少标识');
    const playlists = await services.QQMusic.disslist({
      id: e.id,
    });
    if (playlists?.[0]?.songlist)
      await users.saveUserLikeList(
        playlists[0].songlist.map((song) => song.songmid!),
        providers.qqMusic,
      );
  };
  onQQMusicMessage = async ({nickname, avatarUrl, cookies}: QQMessage) => {
    if (this.loginPending) {
      return;
    }
    this.loginPending = true;
    try {
      const web = await getWebSession();
      const session = web.musicKey ? web : parseSession(cookies);
      if (!session.musicKey) return;
      await users.saveUserStorage(
        {
          uin: session.musicId,
          headpic: avatarUrl,
          nick: nickname || session.musicId,
          cookies: session.cookies,
        },
        providers.qqMusic,
      );
      this.setState({avatar: avatarUrl, nickname: nickname || session.musicId, showWebView: false});
      events.emitter.emit(names.UserLogined);
      const response = await services.QQMusic.profile(session.musicId, session.cookies);
      if (!response?.mymusic) {
        throw new Error(locales.PLAYLIST_FETCH_FAILED);
      }
      const liked = response.mymusic.find(
        (item) => item.title === '喜欢' || item.title === '我喜欢',
      );
      if (!liked) {
        throw new Error(locales.PLAYLIST_FETCH_FAILED);
      }
      await users.saveUserPlayList([liked, ...response.mydiss.list], providers.qqMusic);
      await this.qqMusicLikelist(liked);
    } catch (error) {
      toast(errorMessage(error));
    } finally {
      this.loginPending = false;
    }
  };
  componentDidMount() {
    this.loadInfo();
  }
  render() {
    const state = this.state;
    const {avatar, nickname, showWebView, webViewUrl} = state;
    return (
      <components.PageContainer
        style={{
          flex: 1,
          alignItems: 'center',
        }}
        title={locales.QQ_MUSIC}
        goBack={() => {
          return this.props.navigation.goBack();
        }}
        headerStyle={{
          marginBottom: 30,
        }}
        rightIcon={{
          name: icons.HELP_CIRCLE_OUTLINE,
          onPress: () => {
            return this.setState({
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
          onRequestClose={() => {
            return this.setState({
              tipModalOpen: false,
            });
          }}
        />
      </components.PageContainer>
    );
  }
}
interface WebProps {
  visible: boolean;
  onClosed(): void;
  url?: string | null;
  onMessage(message: QQMessage): void;
}
class QQMusicLoginScreen extends React.PureComponent<
  WebProps,
  {webView?: boolean; nav?: boolean; loginUrl?: string}
> {
  onNavigationStateChange = (e: WebViewNavigation) => {
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
  login = (e?: string) => {
    if (e === 'wechat') {
      toast(locales.WECHAT_LOGIN_LIMIT);
    }
    this.props.onClosed();
  };
  onMessage = (e: WebViewMessageEvent) => {
    try {
      const result = qqMessage.safeParse(JSON.parse(e.nativeEvent.data));
      if (result.success) {
        this.props.onMessage(result.data);
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
            source={url ? {uri: url} : undefined}
            onMessage={this.onMessage}
            injectedJavaScript={injectedJavaScript}
            automaticallyAdjustContentInsets={false}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onNavigationStateChange={this.onNavigationStateChange}
            userAgent={
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
            }
          />
        </ReactNative.View>
      </ReactNative.Modal>
    );
  }
}
const injectedJavaScript = `
  (function () {
    function message() {
      if (!/(^|\\.)y\\.qq\\.com$/.test(location.hostname)) return;
      var avatar = document.querySelector('#profileHead, .user__avator');
      var nickname = document.querySelector('.profile__name, .user__name_text');
      window.ReactNativeWebView.postMessage(JSON.stringify({
        avatarUrl: avatar ? avatar.src : '',
        nickname: nickname ? nickname.innerText : '',
        cookies: document.cookie
      }));
    }
    message();
    setInterval(message, 1000);
  })();
  true;
`;
export default QQMusicLogin;
