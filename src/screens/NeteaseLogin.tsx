import type {ScreenProps, UserProfile} from '../navigation/types';
import type {TrackId} from '../services/track';
import type {WebViewMessageEvent, WebViewNavigation} from 'react-native-webview';
import type {LoginProvider} from '../components/LoginView';
import {errorMessage} from '../utils/types';
import {neteaseMessage} from './login/messages';
import type {NeteaseMessage} from './login/messages';
import {toast} from '../native/toast';
import {WebView} from 'react-native-webview';
import * as appStorage from './../storage/index';
import cookies from '../native/cookies';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeSpringScrollview from './../components/Scrolling';
import * as components from '../components/index';
import * as modals from '../modals/index';
import providers from '../services/providers';
import names from '../events/names';
import icons from '../theme/icons';
import keys from '../storage/keys';
import locales from '../locales/index';
import * as services from '../services/index';
import * as events from '../events/index';
import '../utils/index';
import '../utils/types';
import users from '../storage/users';
import LoginView from '../components/LoginView';
import NeteaseHelp from './login/NeteaseHelp';
const k =
  'https://graph.qq.com/oauth2.0/show?which=Login&display=pc&client_id=100495085&response_type=code&redirect_uri=https://music.163.com/back/qq&forcelogin=true&state=ZwKHpxUoam';
const y =
  'https://api.weibo.com/oauth2/authorize?client_id=301575942&response_type=code&redirect_uri=http://music.163.com/back/weibo&forcelogin=true&scope=friendships_groups_read,statuses_to_me_read,follow_app_official_microblog&state=ovYduMoJhD&checkToken=9ca17ae2e6ffcda170e2e6eeabf121bcec818fc67ba69a8fa2c85e978f8bbbee62b19cb7b4c44abaa789b0f22af0feaec3b92a91e98adaef79f8ecba90b34a939b8fb2c15b8eb1b6dadb3a888e899aec33a1b9ee9e';
const C = async () => {
  await cookies.set('https://music.163.com', {
    name: 'os',
    value: 'pc',
  });
  await cookies.set('https://music.163.com', {
    name: 'appver',
    value: '2.10.6',
  });
};
interface State {
  account: string;
  password: string;
  loading: boolean;
  avatar?: string;
  nickname?: string;
  modalOpen: boolean;
  api: 'netEase';
  guideModalOpen: boolean;
  showWebView: boolean;
  webViewUrl: string | null;
}
class NeteaseLogin extends React.PureComponent<ScreenProps<'NeteaseLogin'>, State> {
  state: State = {
    account: '',
    password: '',
    loading: false,
    avatar: '',
    nickname: '',
    modalOpen: false,
    api: providers.netEase,
    guideModalOpen: false,
    showWebView: false,
    webViewUrl: '',
  };
  loadInfo = async () => {
    const account = (await users.getUserInfo())?.netEase;
    if (account) {
      this.setState({
        avatar: account.avatarUrl,
        nickname: account.nickname,
      });
    }
  };
  neteaseLoginCellphone = async (account: string, password: string) => {
    try {
      await C();
      const response = await services.Netease.login_cellphone(account, password);
      if (response?.code === 200 && response.profile) {
        await this.loginDone(response.profile);
      } else {
        toast(response?.message || locales.ERROR);
      }
    } catch (error) {
      toast(`登录失败：${errorMessage(error)}`);
    } finally {
      this.loadMask('loaded');
    }
  };
  _Login = () => {
    ReactNative.Keyboard.dismiss();
    const state = this.state;
    const {account, password} = state;
    if (account && password) {
      if (account.match('@')) {
        this.loadMask('loading');
        return void this.neteaseLoginEmail(account, password);
      }
      this.loadMask('loading');
      this.neteaseLoginCellphone(account, password);
    } else {
      toast(locales.INPUT_COMPLETE);
    }
  };
  neteaseLoginEmail = async (account: string, password: string) => {
    try {
      await C();
      const response = await services.Netease.login_email(account, password);
      if (response?.code === 200 && response.profile) {
        await this.loginDone(response.profile);
      } else {
        toast(response?.message || locales.ERROR);
      }
    } catch (error) {
      toast(`登录失败：${errorMessage(error)}`);
    } finally {
      this.loadMask('loaded');
    }
  };
  netEaselikelist = async (id: TrackId) => {
    const response = await services.Netease.likelist(id);
    if (response?.code === 200 && response.ids) {
      await users.saveUserLikeList(response.ids, providers.netEase);
    }
  };
  otherWay = () => {
    const modalOpen = this.state.modalOpen;
    this.setState({
      modalOpen: !modalOpen,
    });
  };
  NeteaseLoginOut = async () => {
    try {
      const response = await services.Netease.login_out();
      if (response?.code !== 200) {
        throw new Error(response?.message || locales.ERROR);
      }
      await this.clearStorage(keys.userInfo);
      await this.clearStorage(keys.playlist);
      events.emitter.emit(names.UserLogined);
      this.setState({
        account: '',
        password: '',
        loading: false,
        avatar: '',
        nickname: '',
        modalOpen: false,
        api: providers.netEase,
        guideModalOpen: false,
      });
    } catch (error) {
      toast(`退出失败：${errorMessage(error)}`);
    }
  };
  getPlaylist = async (id: TrackId) => {
    try {
      await this.netEaselikelist(id);
      const response = await services.Netease.user_playlist(id);
      const creator = response?.playlist?.[0]?.creator;
      if (!creator) {
        throw new Error(locales.PLAYLIST_FETCH_FAILED);
      }
      await this.loginDone(creator);
    } catch (error) {
      toast(errorMessage(error));
    } finally {
      this.loadMask('loaded');
    }
  };
  onNeteaseMessage = async ({profile, token}: NeteaseMessage) => {
    try {
      if (token) {
        await cookies.set('https://music.163.com', {
          name: 'MUSIC_U',
          value: token,
        });
      }
      if (profile) {
        await this.loginDone(profile);
      }
    } catch (error) {
      toast(`登录失败：${errorMessage(error)}`);
    }
  };
  loginDone = async (profile: UserProfile) => {
    if (!profile) {
      return;
    }
    await users.saveUserStorage(profile, providers.netEase);
    this.setState({
      avatar: profile.avatarUrl,
      nickname: profile.nickname,
    });
    events.emitter.emit(names.UserLogined);
    await this.netEaselikelist(profile.userId);
    await services.Netease.login_refresh();
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
  onWebviewClosed = () => {
    this.setState({
      showWebView: false,
    });
  };
  onWebview = (e: LoginProvider) => {
    let webViewUrl = null;
    if (e === 'netease_weibo') {
      webViewUrl = y;
    } else if (e === 'netease_qq') {
      webViewUrl = k;
    }
    this.setState({
      webViewUrl,
      showWebView: true,
    });
  };
  onUserManager = () => {
    return this.props.navigation.navigate('UserManager');
  };
  onSelected = (e: UserProfile) => {
    this.loadMask('loading');
    this.getPlaylist(e.userId);
    this.setState({
      modalOpen: false,
    });
  };
  netEaseText = (e: string, t?: 'account' | 'password') => {
    switch (t) {
      case 'account':
        this.setState({
          account: e,
        });
        break;
      case 'password':
        this.setState({
          password: e,
        });
    }
  };
  clearStorage = async (key: string) => {
    await users.removeProvider(key, providers.netEase);
    if (key === keys.playlist) {
      await users.removeProvider(keys.likelist, providers.netEase);
      await appStorage.storage.remove({
        key: keys.netEasePlaylistCache,
      });
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
        title={locales.NETEASE_MUSIC}
        goBack={() => {
          return this.props.navigation.goBack();
        }}
        rightIcon={{
          name: icons.HELP_CIRCLE_OUTLINE,
          onPress: () => {
            return this.setState({
              guideModalOpen: true,
            });
          },
        }}
      >
        <reactNativeSpringScrollview.SpringScrollView>
          <LoginView
            avatar={avatar}
            nickname={nickname}
            _Login={this._Login}
            otherWay={this.otherWay}
            onChangeText={this.netEaseText}
            loginOut={this.NeteaseLoginOut}
            onUserManager={this.onUserManager}
            onWebview={this.onWebview}
            api={providers.netEase}
          />
        </reactNativeSpringScrollview.SpringScrollView>
        <NeteaseLoginScreen
          onMessage={this.onNeteaseMessage}
          loginOut={this.NeteaseLoginOut}
          visible={showWebView}
          onClosed={this.onWebviewClosed}
          url={webViewUrl}
        />
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
        <modals.SearchUser
          isOpen={this.state.modalOpen}
          onModalClose={() => {
            return this.setState({
              modalOpen: false,
            });
          }}
          onSelected={this.onSelected}
        />
        <NeteaseHelp
          isOpen={this.state.guideModalOpen}
          onRequestClose={() => {
            return this.setState({
              guideModalOpen: false,
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
  url: string | null;
  onMessage(message: NeteaseMessage): void;
  loginOut(): void;
}
class NeteaseLoginScreen extends React.PureComponent<
  WebProps,
  {injecting: boolean; injectedUrl: string}
> {
  received = false;
  state = {
    injecting: false,
    injectedUrl: '',
  };
  getJSON = function (e: string) {
    let t;
    try {
      t = e.match(/profile.+playlistBeSubscribedCount/)
        ? `${e.replace(/bindings.+\}\]/g, '').slice(0, -3)}}`
        : e;
      const result = neteaseMessage.safeParse(JSON.parse(t));
      return result.success ? result.data : null;
    } catch {
      return null;
    }
  };
  onMessage = (e: WebViewMessageEvent) => {
    if (!this.received) {
      const t = this.getJSON(e.nativeEvent.data);
      if (t) {
        const a = t.profile;
        const {userId, code} = a;
        if (!userId || Number(userId) < 0 || code === 401) {
          this.props.loginOut();
          toast(locales.NETEASE_LOGIN_RETRY);
        } else {
          this.props.onMessage(t);
        }
        this.props.onClosed();
        this.received = true;
      }
    }
  };
  onNavigationStateChange = (e: WebViewNavigation) => {
    if (e.url.match('music.163.com/back/sns')) {
      if (e.url.match('code=401')) {
        toast('授权出现异常');
        this.props.loginOut();
        return void this.props.onClosed();
      }
      toast(locales.NETEASE_LOGIN_FROM_CLIPBOARD);
      this.setState({
        injecting: true,
        injectedUrl: e.url,
      });
    }
  };
  render() {
    const props = this.props;
    const {visible, onClosed, url} = props;
    const state = this.state;
    const {injecting, injectedUrl} = state;
    return (
      <ReactNative.Modal
        animationType={'fade'}
        transparent={true}
        visible={visible}
        onRequestClose={onClosed}
      >
        <ReactNative.View
          style={{
            backgroundColor: '#000',
            width: '100%',
            height: '100%',
          }}
        >
          {url === k && !injecting && (
            <WebView
              style={{
                flex: 1,
              }}
              source={{
                uri: k,
              }}
              onNavigationStateChange={this.onNavigationStateChange}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              userAgent={
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.30 Safari/537.36'
              }
            />
          )}
          {url === y && (
            <WebView
              style={{
                flex: 1,
              }}
              source={{
                uri: y,
              }}
              onNavigationStateChange={this.onNavigationStateChange}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              injectedJavaScript={injectedJavaScript}
              onMessage={this.onMessage}
            />
          )}
          {injecting && injectedUrl && (
            <WebView
              style={{
                flex: 1,
              }}
              source={{
                uri: injectedUrl,
              }}
              onNavigationStateChange={this.onNavigationStateChange}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              injectedJavaScript={injectedJavaScript}
              onMessage={this.onMessage}
            />
          )}
        </ReactNative.View>
      </ReactNative.Modal>
    );
  }
}
const injectedJavaScript =
  '\n  function post() {\n    function message(){\n      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {\n        window.ReactNativeWebView.postMessage(document.body.innerHTML);\n      }\n    }\n    setInterval(message, 500);\n  }\n  post();\n  ';
export default NeteaseLogin;
