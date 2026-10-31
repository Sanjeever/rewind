import type {ScreenProps, PlaylistParams} from '../navigation/types';
import type {TrackFields, TrackId} from '../services/track';
import type {Provider} from '../services/providers';
import type {Playlist as PlaylistModel, PlaylistCache} from '../storage/models';
import type {PlaylistActionContext, PlaylistData} from './playlist/actions';
import type {Subscription} from '../events/Emitter';
import {errorMessage} from '../utils/types';
import {toast} from '../native/toast';
import Clipboard from '@react-native-clipboard/clipboard';
import * as appStorage from './../storage/index';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeLargelist from './../components/Scrolling';
import * as components from '../components/index';
import * as modals from '../modals/index';
import PlaylistTabs from '../components/PlaylistTabs';
import providers from '../services/providers';
import * as constants from '../theme/constants';
import names from '../events/names';
import keys from '../storage/keys';
import locales from '../locales/index';
import * as events from '../events/index';
import * as utils from '../utils/index';
import mediaStore from '../native/mediaStore';
import lastSong from '../storage/lastSong';
import * as sortModes from './playlist/sortModes';
import actions from './playlist/actions';
type PlaylistBase = PlaylistActionContext['state'];
interface State extends PlaylistBase {
  title?: string;
  loading: boolean;
  index: number | null;
  showList: boolean;
  showMult: boolean;
  subscribed: boolean;
  userId?: TrackId;
  searchText: string | null;
  trackCount?: number;
  orderText?: string;
  sortMode: keyof typeof sortModes.sortModeMap;
  lastPlayedSong: TrackFields | null;
  playingIndex: number;
  isCreatedByMe: boolean;
  isTopList: boolean;
  playlistIndex?: number;
  coverImgUrl?: string;
  name?: string;
  id?: TrackId;
  creator?: PlaylistModel['creator'];
}
class Playlist extends React.PureComponent<ScreenProps<'Playlist'>, State> {
  _list: reactNativeLargelist.LargeList<TrackFields> | null = null;
  deleteSub!: Subscription;
  playerSub!: Subscription;
  _nativeOffset = {
    x: new ReactNative.Animated.Value(0),
    y: new ReactNative.Animated.Value(0),
  };
  state: State = {
    title: '',
    playlist: [],
    playlistId: null,
    oriList: [],
    loading: true,
    searching: false,
    index: null,
    showList: true,
    showMult: false,
    showRestore: false,
    subscribed: true,
    userId: 0,
    searchText: '',
    api: this.props.route.params.api,
    trackCount: 0,
    orderText: '',
    heartMode: true,
    sortMode: 'time',
    lastPlayedSong: null,
    playingIndex: -1,
    isCreatedByMe: true,
    isTopList: false,
  };
  loadLastPlayedSong = async (api: Provider, tracks: TrackFields[]) => {
    const song = await lastSong.get(api);
    if (song && tracks.some((item) => item.id === song.id)) {
      this.setState({
        lastPlayedSong: song,
      });
    }
  };
  collectPlaylistOrder = () => {
    const state = this.state;
    const {playlistIndex, api} = state;
    if (playlistIndex) {
      events.emitter.emit(names.PlaylistSetOrder, {
        index: playlistIndex,
        api,
      });
    }
  };
  switchPlaylist = (e: PlaylistParams) => {
    let trackCount;
    let coverImgUrl;
    let s;
    let i;
    let creator;
    const {api, index, subscribed, playlist} = e;
    if (api === providers.netEase) {
      trackCount = playlist.trackCount;
      coverImgUrl = playlist.coverImgUrl || playlist.picUrl;
      s = playlist.name;
      i = playlist.id;
      creator = playlist.creator;
    } else if (api === providers.qqMusic) {
      coverImgUrl = playlist.picurl || playlist.imgurl;
      s = playlist.title || playlist.dissname;
      trackCount = this.state.trackCount;
      i = playlist.dissid || playlist.id;
    }
    this.setState({
      api,
      playlistIndex: index,
      subscribed: subscribed || false,
      isTopList: this.getIsTopList(e.playlist),
      coverImgUrl,
      name: s,
      trackCount,
      id: i,
      creator,
    });
    switch (api) {
      case providers.netEase:
        this.netEaseStorageList(e.playlist?.id);
        this.switchNetease(e);
        break;
      case providers.qqMusic:
        this.switchQQMusic(e);
    }
  };
  switchNetease = async ({playlist, userId}: PlaylistParams) => {
    if (!playlist.id) {
      return;
    }
    try {
      const data = await actions.getFromNetease(playlist.id);
      if (!data) {
        return;
      }
      this.setData(data);
      this.setState({
        userId,
        isCreatedByMe: this.getIsCreatedByMe(userId, playlist),
      });
      await this.loadMoreThanThousands(data.moreFunc);
    } catch (error) {
      toast(errorMessage(error));
    }
  };
  loadMoreThanThousands = async (more: PlaylistData['moreFunc']) => {
    if (!more) {
      return;
    }
    const response = await more();
    if (response?.songs?.length) {
      const songs = response.songs;
      this.setState((previous) => {
        const tracks = [...previous.oriList, ...songs];
        return {
          oriList: tracks,
          playlist: tracks,
        };
      });
    }
  };
  getIsTopList = function (e?: PlaylistModel) {
    if (!e) {
      return false;
    }
    const {name, title, dissname} = e;
    return (name || title || dissname)!.includes('榜');
  };
  getIsCreatedByMe = function (e: TrackId | undefined, t: PlaylistModel) {
    return !!e && e === t.creator!.userId;
  };
  switchQQMusic = async ({playlist}: PlaylistParams) => {
    const id = playlist.id || playlist.dissid;
    if (!id) {
      return;
    }
    try {
      const data = await actions.getFromQQMusic(id);
      if (data) {
        this.setData(data);
        this.setState({
          isCreatedByMe: false,
        });
      }
    } catch (error) {
      toast(errorMessage(error));
    }
  };
  setData = ({name, id, tracks, trackCount = 0}: PlaylistData) => {
    this.setState(
      {
        playlist: tracks,
        oriList: tracks,
        name,
        loading: false,
        playlistId: id,
        sortMode: 'time',
        trackCount,
      },
      () => {
        this._list?.endRefresh();
        this.attachLocalPath(tracks);
        this.loadLastPlayedSong(this.state.api, tracks);
      },
    );
  };
  netEaseStorageList = (e?: TrackId) => {
    if (e) {
      appStorage.storage
        .load<PlaylistCache[]>({
          key: keys.netEasePlaylistCache,
        })
        .then((t) => {
          const a = t.find((t) => t.id === e);
          if (!a) return;
          const {tracks, name} = a;
          if (tracks.length > 0) {
            this.setData({
              id: e,
              name,
              tracks,
            });
          }
        })
        .catch((error) => {
          if (!(error instanceof Error && error.name === 'NotFoundError'))
            toast('读取歌单缓存失败：' + errorMessage(error));
        });
    }
  };
  attachLocalPath = (e: TrackFields[]) => {
    if (!(e.length < 1)) {
      mediaStore.attachLocalPath(e).then((e) => {
        this.setState({
          playlist: e,
          oriList: e,
        });
      });
    }
  };
  searchSong = (e: string, a = true, n = true) => {
    let t;
    const state = this.state;
    const {playlist, oriList, searchText} = state;
    if (playlist) {
      t =
        e.match(':0') || e.length < 1
          ? utils.filterHelper.search([...oriList], e)
          : utils.filterHelper.search(playlist, e);
      this.setState({
        playlist: t,
        searching: e !== '',
        showRestore: a && e !== '',
        searchText: n ? e : searchText,
        orderText: e === '' ? '' : this.state.orderText,
      });
      this.syncPlayingIndex(playlist, t);
    } else {
      this.setState({
        searchText: null,
      });
    }
  };
  syncPlayingIndex = (e: TrackFields[], t: TrackFields[]) => {
    const playingIndex = this.state.playingIndex;
    if (playingIndex !== -1) {
      const n = e[playingIndex];
      const playingIndex_1 = t.findIndex((e) => e.id === n.id);
      this.setState({
        playingIndex: playingIndex_1,
      });
    }
  };
  onRestore = () => {
    const oriList = this.state.oriList;
    this.setState({
      playlist: oriList,
      showRestore: false,
      searchText: '',
      orderText: '',
      playingIndex: -1,
    });
  };
  onRefresh = () => {
    const params = this.props.route.params;
    if (params) {
      this.switchPlaylist(params);
    }
  };
  onSort = () => {
    let orderText;
    const sortMode = this.state.sortMode;
    const sortMode_1 = sortModes.sortModeMap[sortMode];
    switch (sortMode_1) {
      case 'time':
        orderText = '';
        this.searchSong(`${this.state.searchText}:0`, false, false);
        break;
      case 'song':
        orderText = sortModes.orderTexts.song;
        this.searchSong(utils.filterHelper.searchTypesMap.bySong, false, false);
        break;
      case 'singer':
        orderText = sortModes.orderTexts.singer;
        this.searchSong(utils.filterHelper.searchTypesMap.byArtist, false, false);
        break;
      case 'album':
        orderText = sortModes.orderTexts.album;
        this.searchSong(utils.filterHelper.searchTypesMap.byAlbum, false, false);
        break;
      case 'random':
        orderText = sortModes.orderTexts.random;
        this.searchSong(utils.filterHelper.searchTypesMap.byRandom, false, false);
    }
    this.setState({
      orderText,
      sortMode: sortMode_1,
    });
  };
  onSortText = () => {
    const state = this.state;
    const {orderText, playlist} = state;
    switch (orderText) {
      case sortModes.orderTexts.song:
      case sortModes.orderTexts.singer:
      case sortModes.orderTexts.album:
        this.setState({
          playlist: [...playlist].reverse(),
        });
        break;
      case sortModes.orderTexts.random:
        this.searchSong(':4', false, false);
    }
  };
  onUser = () => {
    const state = this.state;
    const {api, creator} = state;
    if (api === providers.netEase) {
      const userId = creator?.userId;
      if (userId) {
        this.props.navigation.navigate('UserInfo', {
          userId,
        });
      }
    }
  };
  _renderIndexPath = ({row}: {row: number}) => {
    return this._renderItem({
      item: this.state.playlist[row],
      index: row,
    });
  };
  onSubscribe = async (e: TrackId) => {
    const state = this.state;
    const {api, subscribed} = state;
    const s = subscribed ? 'unsubscribe' : 'subscribe';
    try {
      await actions.onSubscribe(e, s, api);
      this.setState({
        subscribed: !subscribed,
      });
    } catch (error) {
      toast(errorMessage(error));
    }
  };
  onScroll = (e: ReactNative.NativeSyntheticEvent<ReactNative.NativeScrollEvent>) => {
    const t = e.nativeEvent.contentOffset.y;
    const a = sortModes.FOREGROUND_HEIGHT - 100;
    if (t < a) {
      this.setState({
        title: '',
      });
    } else if (t > a) {
      this.setState({
        title: this.state.name,
      });
    }
  };
  onLastPlay = () => {
    const state = this.state;
    const {lastPlayedSong, playlist} = state;
    if (!(playlist?.length <= 0)) {
      if (lastPlayedSong) {
        const s = playlist.findIndex((e) => e.id === lastPlayedSong.id);
        if (s >= 0) {
          actions.playMusic(lastPlayedSong, s, this);
          this._list?.scrollTo({
            x: 0,
            y: (s + 1) * constants.ITEM_HEIGHT,
          });
        }
        this.setState({
          lastPlayedSong: null,
        });
      } else {
        actions.playMusic(playlist[0], 0, this);
      }
    }
  };
  _renderItem = ({item, index}: {item: TrackFields; index: number}) => {
    const state = this.state;
    const {api, playingIndex, isTopList} = state;
    const d = actions.formatItemData(item, api);
    return (
      <components.SongRow
        lastRank={item.lastRank}
        showRank={isTopList}
        songItem={item}
        index={index}
        song={d.song}
        album={d.album}
        singer={d.artist}
        alias={d.alias}
        onPress={() => {
          return actions.playMusic(item, index, this);
        }}
        detail={() => {
          return actions.onDetail(item, index, this);
        }}
        addToQueue={function () {
          return actions.addToQueue(item, api);
        }}
        isExist={!!item.localPath}
        onMV={function () {
          return actions.onMV(item, api);
        }}
        showMV={d.showMV}
        playing={index === playingIndex}
      />
    );
  };
  onTop = () => {
    this._list?.scrollTo({
      x: 0,
      y: 0,
    });
  };
  goBack = () => {
    this.props.navigation.goBack();
  };
  onInsertLastPlayed = () => {
    const state = this.state;
    const {lastPlayedSong, api} = state;
    if (lastPlayedSong) {
      actions.addToQueue(lastPlayedSong, api);
    }
  };
  getPlaylistUrl = () => {
    let e;
    const state = this.state;
    const {api, playlistId} = state;
    switch (api) {
      case providers.netEase:
        e = `https://music.163.com/#/playlist?id=${playlistId}`;
        break;
      case providers.qqMusic:
        e = `https://y.qq.com/n/yqq/playlist/${playlistId}.html`;
        break;
      default:
        throw new Error('不支持的歌单来源');
    }
    return e;
  };
  onWebview = () => {
    const url = this.getPlaylistUrl();
    this.props.navigation.navigate('WebViewPage', {
      url,
    });
  };
  onCopy = () => {
    const e = this.getPlaylistUrl();
    Clipboard.setString(e);
    toast(`${locales.COPIED} ${e}`);
  };
  onOpenUrl = () => {
    const e = this.getPlaylistUrl();
    ReactNative.Linking.openURL(e);
  };
  onShare = () => {
    const message = this.getPlaylistUrl();
    ReactNative.Share.share({
      message,
    });
  };
  componentDidMount() {
    const params = this.props.route.params;
    this.switchPlaylist(params);
    this.deleteSub = events.emitter.addListener(names.DeleteFromPlaylist, async (event) => {
      if (!event) {
        this.onRefresh();
        return;
      }
      const {api, trackid} = event;
      const playlistId = this.state.playlistId;
      if (api && api !== 'local' && playlistId != null) {
        let i;
        if (api === providers.netEase) {
          try {
            await actions.deleteFromNetease({
              playlistId,
              trackid,
            });
          } catch (error) {
            toast(errorMessage(error));
            return;
          }
          i = this.state.playlist.filter((e) => e.id !== trackid);
        } else if (api === providers.qqMusic) {
          const l = params.playlist;
          try {
            await actions.deleteFromQQMusic(trackid, l.dirid);
          } catch (error) {
            toast(errorMessage(error));
            return;
          }
          i = this.state.playlist.filter((e) => e.songid !== trackid);
        }
        if (i)
          this.setState({
            playlist: i,
          });
        toast(locales.DELETE_SUCCESS);
      } else {
        this.onRefresh();
      }
    });
    this.playerSub = events.emitter.addListener(names.Player, (t) => {
      if (t.type !== 'clearPlayingList') {
        const {song, api} = t;
        const n = this.state.playlist;
        if (song && api === providers.netEase) {
          const playingIndex = n.findIndex((e) => e.id === song.id);
          if (playingIndex >= 0) {
            this.setState({
              playingIndex,
            });
          }
        }
      } else {
        this.setState({
          playingIndex: -1,
        });
      }
    });
  }
  componentWillUnmount() {
    this.deleteSub.remove();
    this.playerSub.remove();
  }
  render() {
    const state = this.state;
    const {api, coverImgUrl, name, trackCount, id, creator} = state;
    return (
      <ReactNative.View style={I.container}>
        <components.Background />
        <reactNativeLargelist.LargeList
          ref={(t) => {
            this._list = t;
          }}
          data={[
            {
              items: this.state.playlist,
            },
          ]}
          heightForIndexPath={function () {
            return constants.ITEM_HEIGHT;
          }}
          renderIndexPath={this._renderIndexPath}
          onScroll={this.onScroll}
          onRefresh={this.onRefresh}
          refreshHeader={PlaylistTabs}
          renderEmpty={function () {
            return <components.Spinkit />;
          }}
          onNativeContentOffsetExtract={this._nativeOffset}
          renderHeader={() => {
            return (
              <ReactNative.View>
                <components.PlaylistForeground
                  coverImgUrl={`${coverImgUrl}?param=800y800`}
                  name={name}
                  api={api}
                  trackCount={trackCount}
                  onRestore={this.onRestore}
                  showRestore={this.state.showRestore}
                  subscribed={this.state.subscribed}
                  onSubscribe={() => {
                    return this.onSubscribe(id!);
                  }}
                  savePic={() => {
                    return actions.savePic(coverImgUrl, this.state.name);
                  }}
                  onSort={this.onSort}
                  orderText={this.state.orderText}
                  onSortText={() => {
                    return this.onSortText();
                  }}
                  onHeartMode={() => {
                    return actions.onHeartMode(this);
                  }}
                  heartMode={this.state.heartMode}
                  onMult={() => {
                    return this.setState({
                      showMult: true,
                    });
                  }}
                  lastPlayedSong={this.state.lastPlayedSong}
                  onPlay={this.onLastPlay}
                  onInsert={this.onInsertLastPlayed}
                  isCreatedByMe={this.state.isCreatedByMe}
                  onWebview={this.onWebview}
                  creator={creator}
                  onUser={this.onUser}
                  onCopy={this.onCopy}
                  onOpenUrl={this.onOpenUrl}
                  onShare={this.onShare}
                />
              </ReactNative.View>
            );
          }}
        />
        <components.HeaderBar
          opacity={this._nativeOffset.y.interpolate({
            inputRange: [0, sortModes.FOREGROUND_HEIGHT - 100],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          })}
          headerStyle={I.header}
          title={this.state.title}
          goBack={this.goBack}
          onTop={this.onTop}
          textInput={!this.state.loading}
          onChangeText={(t) => {
            return this.searchSong(t);
          }}
          searchText={this.state.searchText ?? undefined}
          blur={true}
          bold={true}
        />
        <modals.MultiplySelectModal
          visible={this.state.showMult}
          onClose={() => {
            return this.setState({
              showMult: false,
            });
          }}
          data={this.state.playlist}
          api={this.state.api}
          playlistId={this.state.playlistId}
        />
      </ReactNative.View>
    );
  }
}
const I = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
  },
});
export default Playlist;
