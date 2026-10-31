import log from '../../services/logger';
import {toast} from '../../native/toast';
import _default from './../../components/Pager.js';
import * as _appStorage from './../../storage/index.js';
import * as immer from 'immer';
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
import * as types from '../../utils/types';
import playlists from '../../storage/playlists';
import users from '../../storage/users';
import Playlists from './Playlists';
import PlaylistHeader from './PlaylistHeader';
import _netinfo from '@react-native-community/netinfo';
class Home extends React.PureComponent {
  showNetease = true;
  showQQMusic = true;
  state = {
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
      log('签到失败', error.message);
    }
  };
  happyBirthday = async () => {
    const id = (await users.getUserInfo())?.netEase?.userId;
    if (!id) {
      return;
    }
    const response = await services.Netease.profile(id);
    if (response?.code === 200 && utils.timeFormatter.isToday(response.profile.birthday)) {
      this.props.navigation.navigate('HappyBirthday', {
        profile: response.profile,
      });
    }
  };
  loadOrder = () => {
    _appStorage.storage
      .load({
        key: keysModule.pagesOrder,
      })
      .then((pagesOrder) => {
        if (pagesOrder) {
          this.setState({
            pagesOrder,
          });
        }
      })
      .catch(() => null);
    _appStorage.storage
      .load({
        key: keysModule.apisOrder,
      })
      .then((apisOrder) => {
        if (apisOrder) {
          this.setState({
            apisOrder,
          });
        }
      })
      .catch(() => null);
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
  isValid = function (e, t) {
    return e && e[t] && types.isObject(e[t]);
  };
  loadStorage = async () => {
    const stored = await users.getUserPlayList();
    if (stored) {
      if (this.isValid(stored, providers.netEase)) {
        this.setState({
          netEase: stored.netEase,
        });
      }
      if (this.isValid(stored, providers.qqMusic)) {
        this.setState({
          qqMusic: stored.qqMusic,
        });
      }
    } else {
      await this.loadPlaylistById();
    }
  };
  loadPlaylistById = async (api, list) => {
    try {
      if (this.state.isConnected !== true) {
        return;
      }
      const accounts = await users.getUserInfo();
      if (!accounts) {
        return;
      }
      if (api) {
        await this[`loadPlaylist_${api}`](accounts);
      } else {
        await this.loadPlaylist_netEase(accounts);
        await this.loadPlaylist_qqMusic(accounts);
      }
    } catch (error) {
      toast(`歌单加载失败：${error.message}`);
    } finally {
      list?.endRefresh?.();
    }
  };
  loadPlaylist_netEase = async (accounts) => {
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
  loadPlaylist_qqMusic = async (accounts) => {
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
        log('刷新登录失败', error.message);
      }
    }
  };
  netEaselikelist = async (id) => {
    if (!id) {
      return;
    }
    const response = await services.Netease.likelist(id);
    if (response?.code === 200) {
      await users.saveUserLikeList(response.ids, providers.netEase);
    }
  };
  qqMusicLikelist = function () {
    _appStorage.storage
      .load({
        key: keysModule.playlist,
      })
      .then((e) => {
        if (e.qqMusic) {
          const id = utils.delve(e, 'qqMusic.0.id');
          services.QQMusic.disslist({
            id,
          }).then((e) => {
            if (types.isArray(e) && !(e.length < 1)) {
              const t = [];
              e[0].songlist.map((e) => {
                t.push(e.songmid);
              });
              users.saveUserLikeList(t, providers.qqMusic);
            }
          });
        }
      })
      .catch((e) => e);
  };
  getQQMusicPlaylist = async (id) => {
    if (!id) {
      return;
    }
    const profile = await services.QQMusic.profile(id);
    if (!profile?.mymusic) {
      throw new Error(locales.default.PLAYLIST_FETCH_FAILED);
    }
    const created = await services.QQMusic.user_created_list(id);
    const liked = profile.mymusic.find((item) => item.title === '喜欢' || item.title === '我喜欢');
    const items = [...(liked ? [liked] : []), ...profile.mydiss.list, ...created];
    const ordered = await playlists.newOrder({
      api: providers.qqMusic,
      newArr: items,
      on: this.state.autoSetPlaylistOrder,
    });
    await users.saveUserPlayList(ordered, providers.qqMusic);
    this.setState({
      qqMusic: ordered,
    });
  };
  getNeteasePlaylist = async (id) => {
    if (!id) {
      return;
    }
    const response = await services.Netease.user_playlist(id);
    if (!Array.isArray(response?.playlist)) {
      throw new Error(response?.message || locales.default.PLAYLIST_FETCH_FAILED);
    }
    const ordered = await playlists.newOrder({
      api: providers.netEase,
      newArr: response.playlist,
      on: this.state.autoSetPlaylistOrder,
    });
    await users.saveUserPlayList(ordered, providers.netEase);
    this.setState({
      netEase: ordered,
    });
  };
  Playlist = (playlist, t, index) => {
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
  collectPlaylistOrder = async ({api, index}) => {
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
          [api]: result,
        });
      }
    } catch (error) {
      toast(`保存歌单顺序失败：${error.message}`);
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
      _default,
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
  goToPage = (e) => {
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
  UNSAFE_componentWillMount() {
    const e = this;
    utils.firstTimeChecker.check().then((t) => {
      if (t === true) {
        e.alertOpenTip();
      }
    });
  }
  componentDidMount() {
    const e = this;
    _netinfo.fetch().then(({isConnected}) => {
      e.setState(
        {
          isConnected,
        },
        function () {
          e.loadStorage();
          e.loadPlaylistById();
          e.dailySignin();
        },
      );
    });
    this.loginedListener = events.emitter.addListener(names.UserLogined, function () {
      setTimeout(() => {
        e.loadStorage();
        e.loadPlaylistById();
      }, 500);
    });
    this.playlistSetOrderListener = events.emitter.addListener(
      names.PlaylistSetOrder,
      function ({index, api}) {
        if (e.state.autoSetPlaylistOrder === true) {
          e.collectPlaylistOrder({
            index,
            api,
          });
        }
      },
    );
    this.setStateListener = events.emitter.addListener(names.SetHomeState, function (t) {
      e.setState(
        immer.produce(function (e) {
          Object.keys(t).forEach((a) => {
            e[a] = t[a];
          });
        }),
      );
    });
    this.loadOrder();
    this.happyBirthday();
    this.netEaseRefreshLogin();
  }
  componentWillUnmount() {
    this.loginedListener.remove();
    this.playlistSetOrderListener.remove();
    this.setStateListener.remove();
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
var M = ReactNative.StyleSheet.create({
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
