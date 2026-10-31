import log from '../../services/logger';
import locales from '../../locales';
import {toast} from '../../native/toast';
import Pager from './../../components/Pager';
import * as appStorage from './../../storage/index';
import * as React from 'react';
import * as ReactNative from 'react-native';
import FadingEdge from '../../components/FadingEdge';
import * as Index from '../../components/index';
import providers from '../../services/providers';
import * as defaults from '../../settings/defaults';
import * as constants from '../../theme/constants';
import names from '../../events/names';
import pagesModule from '../../settings/pages';
import keysModule from '../../storage/keys';
import * as endpoints from '../../services/endpoints';
import * as services from '../../services/index';
import * as events from '../../events/index';
import * as utils from '../../utils/index';
import playlists from '../../storage/playlists';
import users from '../../storage/users';
import Playlists from './Playlists';
import PlaylistHeader from './PlaylistHeader';
import _netinfo from '@react-native-community/netinfo';
import type {Navigation} from '../../navigation/types';
import type {Provider, OnlineProvider} from '../../services/providers';
import type {TrackId} from '../../services/track';
import type {Accounts, Playlist} from '../../storage/models';
import type {Subscription} from '../../events/Emitter';
import type {OpenPlaylist} from './Playlists';
import type {LargeList} from '../../components/Scrolling';
import {errorMessage} from '../../utils/types';
interface State {
  netEase: Playlist[];
  qqMusic: Playlist[];
  showList: boolean;
  isConnected: boolean | null;
  userId: TrackId;
  autoSetPlaylistOrder: boolean;
  pagesOrder: typeof pagesModule.pages;
  apisOrder: typeof pagesModule.apis;
}
class Home extends React.PureComponent<{navigation: Navigation}, State> {
  active = false;
  loginTimer?: ReturnType<typeof setTimeout>;
  loginedListener?: Subscription;
  playlistSetOrderListener?: Subscription;
  setStateListener?: Subscription;
  state: State = {
    netEase: [],
    qqMusic: [],
    showList: true,
    isConnected: true,
    userId: 0,
    autoSetPlaylistOrder: defaults.defaultSettings.autoSetPlaylistOrder.on,
    pagesOrder: pagesModule.pages,
    apisOrder: pagesModule.apis,
  };
  dailySignin = async () => {
    try {
      return await services.Netease.daily_signin();
    } catch (error) {
      log('签到失败', errorMessage(error));
    }
  };
  happyBirthday = async () => {
    const id = (await users.getUserInfo())?.netEase?.userId;
    if (!id) {
      return;
    }
    const response = await services.Netease.profile(id);
    if (
      this.active &&
      response?.code === 200 &&
      response.profile?.birthday != null &&
      utils.timeFormatter.isToday(response.profile.birthday)
    ) {
      this.props.navigation.navigate('HappyBirthday', {
        profile: {...response.profile, birthday: response.profile.birthday},
      });
    }
  };
  loadOrder = () => {
    appStorage.storage
      .load<State['pagesOrder']>({
        key: keysModule.pagesOrder,
      })
      .then((pagesOrder) => {
        if (this.active && pagesOrder) {
          this.setState({
            pagesOrder,
          });
        }
      })
      .catch(this.onOrderError);
    appStorage.storage
      .load<State['apisOrder']>({
        key: keysModule.apisOrder,
      })
      .then((apisOrder) => {
        if (this.active && apisOrder) {
          this.setState({
            apisOrder,
          });
        }
      })
      .catch(this.onOrderError);
  };
  onOrderError = (error: unknown) => {
    if (this.active && !(error instanceof Error && error.name === 'NotFoundError'))
      toast('读取排序失败：' + errorMessage(error));
  };
  alertOpenTip = () => {
    ReactNative.Alert.alert('首次启动', '需要查看操作指南吗？', [
      {
        text: '不用了',
        onPress: function () {
          return null;
        },
        style: 'cancel',
      },
      {
        text: '应用内查看',
        onPress: () => {
          return this.props.navigation.navigate('Tip');
        },
      },
      {
        text: '用浏览器打开',
        onPress: function () {
          return ReactNative.Linking.openURL(`${endpoints.HOST_PAGE}/tutorial`);
        },
      },
    ]);
  };
  loadStorage = async () => {
    try {
      const stored = await users.getUserPlayList();
      if (!this.active) return;
      if (stored) {
        if (stored.netEase) {
          this.setState({
            netEase: stored.netEase,
          });
        }
        if (stored.qqMusic) {
          this.setState({
            qqMusic: stored.qqMusic,
          });
        }
      } else {
        await this.loadPlaylistById();
      }
    } catch (error) {
      if (this.active) toast('读取歌单失败：' + errorMessage(error));
    }
  };
  loadPlaylistById = async (api?: OnlineProvider, list?: LargeList<Playlist>) => {
    try {
      if (this.state.isConnected !== true) {
        return;
      }
      const accounts = await users.getUserInfo();
      if (!accounts) {
        return;
      }
      if (api) {
        await (api === 'netEase' ? this.loadPlaylist_netEase : this.loadPlaylist_qqMusic)(accounts);
      } else {
        await this.loadPlaylist_netEase(accounts);
        await this.loadPlaylist_qqMusic(accounts);
      }
    } catch (error) {
      if (this.active) toast(`歌单加载失败：${errorMessage(error)}`);
    } finally {
      list?.endRefresh?.();
    }
  };
  loadPlaylist_netEase = async (accounts: Accounts) => {
    const userId = accounts?.netEase?.userId;
    if (!userId) {
      return;
    }
    this.setState({
      userId,
    });
    await this.getNeteasePlaylist(userId);
    await this.netEaselikelist(userId);
  };
  loadPlaylist_qqMusic = async (accounts: Accounts) => {
    const id = accounts?.qqMusic?.userId;
    if (!id) {
      return;
    }
    await this.getQQMusicPlaylist(id);
    await this.qqMusicLikelist();
  };
  setDefaultState = () => {
    this.setState({
      netEase: [],
      qqMusic: [],
      showList: true,
      isConnected: true,
      userId: 0,
    });
  };
  netEaseRefreshLogin = async () => {
    if (this.state.isConnected === true) {
      try {
        return await services.Netease.login_refresh();
      } catch (error) {
        log('刷新登录失败', errorMessage(error));
      }
    }
  };
  netEaselikelist = async (id: TrackId) => {
    if (!id) {
      return;
    }
    const response = await services.Netease.likelist(id);
    if (response?.code === 200 && response.ids) {
      await users.saveUserLikeList(response.ids, providers.netEase);
    }
  };
  qqMusicLikelist = async () => {
    const saved = await users.getUserPlayList();
    const id = saved?.qqMusic?.[0]?.id;
    if (!id) return;
    const playlists = await services.QQMusic.disslist({
      id,
    });
    if (playlists?.[0]?.songlist)
      await users.saveUserLikeList(
        playlists[0].songlist.map((song) => {
          const id = song.songmid || song.mid;
          if (!id) throw new Error('QQ 喜欢列表缺少歌曲标识');
          return id;
        }),
        providers.qqMusic,
      );
  };
  getQQMusicPlaylist = async (id: TrackId) => {
    if (!id) {
      return;
    }
    const account = (await users.getUserInfo())?.qqMusic;
    const profile = await services.QQMusic.profile(id, account?.cookies);
    if (!profile?.mymusic) {
      throw new Error(locales.PLAYLIST_FETCH_FAILED);
    }
    const created = await services.QQMusic.user_created_list(id);
    const liked = profile.mymusic.find((item) => item.title === '喜欢' || item.title === '我喜欢');
    if (!profile.mydiss?.list || !created) throw new Error(locales.PLAYLIST_FETCH_FAILED);
    const items = [...(liked ? [liked] : []), ...profile.mydiss.list, ...created];
    const ordered = await playlists.newOrder({
      api: providers.qqMusic,
      newArr: items,
      on: this.state.autoSetPlaylistOrder,
    });
    await users.saveUserPlayList(ordered, providers.qqMusic);
    if (this.active) this.setState({qqMusic: ordered});
  };
  getNeteasePlaylist = async (id: TrackId) => {
    if (!id) {
      return;
    }
    const response = await services.Netease.user_playlist(id);
    if (!Array.isArray(response?.playlist)) {
      throw new Error(response?.message || locales.PLAYLIST_FETCH_FAILED);
    }
    const ordered = await playlists.newOrder({
      api: providers.netEase,
      newArr: response.playlist,
      on: this.state.autoSetPlaylistOrder,
    });
    await users.saveUserPlayList(ordered, providers.netEase);
    if (this.active) this.setState({netEase: ordered});
  };
  Playlist: OpenPlaylist = (...args) => {
    const [playlist, t, index] = args;
    const userId = this.state.userId;
    switch (t) {
      case providers.netEase:
        this.props.navigation.navigate('Playlist', {
          playlist,
          userId,
          api: providers.netEase,
          index,
          subscribed: true,
        });
        break;
      case providers.qqMusic:
        this.props.navigation.navigate('Playlist', {
          playlist,
          api: providers.qqMusic,
          index,
          subscribed: true,
        });
        break;
      case providers.local:
        this.props.navigation.navigate('CustomPlaylist', {
          playlist,
          index,
        });
    }
  };
  collectPlaylistOrder = async ({api, index}: {api: Provider; index: number}) => {
    try {
      const result = await playlists.collect({
        playlist: {
          netEase: this.state.netEase,
          qqMusic: this.state.qqMusic,
        },
        api,
        index,
      });
      if (result) {
        this.setState({
          ...this.state,
          [api]: result,
        });
      }
    } catch (error) {
      toast(`保存歌单顺序失败：${errorMessage(error)}`);
    }
  };
  renderPager = () => {
    const pagesOrder = this.state.pagesOrder;
    return utils.groupedArray(pagesOrder, 4).map((e, t) => (
      <ReactNative.View style={M.compCon} key={t}>
        {e.map((e, t) => (
          <PlaylistHeader
            icon={e.icon}
            key={t}
            onPress={() => {
              return this.goToPage(e.page);
            }}
          />
        ))}
      </ReactNative.View>
    ));
  };
  renderHeader = () => {
    return React.createElement(
      Pager,
      {
        initialPage: 0,
        style: {
          height: 100,
          width: '100%',
        },
      },
      this.renderPager(),
    );
  };
  goToPage = (e: string) => {
    switch (e) {
      case 'localMusic':
        this.props.navigation.navigate('LocalMusic');
        break;
      case 'history':
        this.props.navigation.navigate('MusicHistory');
        break;
      case 'recommend':
        this.props.navigation.navigate('MusicRecommend');
        break;
      case 'radio':
        this.props.navigation.navigate('Radio');
        break;
      case 'privateFM':
        events.emitter.emit(names.FM_MODE);
        break;
      case 'charts':
        this.props.navigation.navigate('Charts');
        break;
      case 'favs':
        this.props.navigation.navigate('Favs');
        break;
      case 'hotPlaylist':
        this.props.navigation.navigate('HotPlaylist');
        break;
      case 'subNewSongs':
        this.props.navigation.navigate('SubNewSongs');
    }
  };
  componentDidMount() {
    this.active = true;
    utils.firstTimeChecker
      .check()
      .then((first) => {
        if (this.active && first) this.alertOpenTip();
      })
      .catch((error) => {
        if (this.active) toast(errorMessage(error));
      });
    _netinfo.fetch().then(({isConnected}) => {
      if (!this.active) return;
      this.setState(
        {
          isConnected,
        },
        () => {
          this.loadStorage();
          this.loadPlaylistById();
          this.dailySignin();
        },
      );
    });
    this.loginedListener = events.emitter.addListener(names.UserLogined, () => {
      clearTimeout(this.loginTimer);
      this.loginTimer = setTimeout(() => {
        this.loadStorage();
        this.loadPlaylistById();
      }, 500);
    });
    this.playlistSetOrderListener = events.emitter.addListener(
      names.PlaylistSetOrder,
      ({index, api}) => {
        if (this.state.autoSetPlaylistOrder === true) {
          this.collectPlaylistOrder({
            index,
            api,
          });
        }
      },
    );
    this.setStateListener = events.emitter.addListener(names.SetHomeState, (t) => {
      this.setState(t);
    });
    this.loadOrder();
    this.happyBirthday().catch((error) => log('生日检查失败', errorMessage(error)));
    this.netEaseRefreshLogin();
  }
  componentWillUnmount() {
    this.active = false;
    clearTimeout(this.loginTimer);
    this.loginedListener?.remove();
    this.playlistSetOrderListener?.remove();
    this.setStateListener?.remove();
  }
  render() {
    const state = this.state;
    const {netEase, qqMusic, apisOrder} = state;
    return (
      <ReactNative.View style={M.container}>
        <Index.Background />
        {this.renderHeader()}
        <FadingEdge top={30}>
          <Playlists
            apisOrder={apisOrder}
            navigation={this.props.navigation}
            netEase={netEase}
            qqMusic={qqMusic}
            Playlist={this.Playlist}
            onRefresh={this.loadPlaylistById}
          />
        </FadingEdge>
      </ReactNative.View>
    );
  }
}
export default Home;
const M = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: constants.STATUS_BAR_HEIGHT + 40,
  },
  compCon: {
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
