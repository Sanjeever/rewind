import {toast} from '../native/toast';
import Text from './../components/Text';
import * as React from 'react';
import * as ReactNative from 'react-native';
import FadingEdge from '../components/FadingEdge';
import * as reactNativeSpringScrollview from './../components/Scrolling';
import * as components from '../components/index';
import providers from '../services/providers';
import names from '../events/names';
import locales from '../locales/index';
import playlistFiles from '../storage/playlistFiles';
import * as services from '../services/index';
import * as events from '../events/index';
import * as utils from '../utils/index';
import '../utils/types';
import users from '../storage/users';
import CustomPlaylistHeader from './../modules/CustomPlaylistHeader';
import PlaylistChoice from './../modules/PlaylistChoice';
import {formatPlaylist} from '../services/playlistInfo';
import {getTrackKey} from '../services/trackInfo';
import {errorMessage} from '../utils/types';
import type {Provider} from '../services/providers';
import type {TrackFields, TrackId} from '../services/track';
import type {Playlist, CustomPlaylist} from '../storage/models';
import type {Subscription} from '../events/Emitter';
interface State {
  api: Provider | null;
  data: TrackFields[];
  songItem: TrackFields | null;
  playlist: Playlist[];
  locals: CustomPlaylist[];
  mainModalShow: boolean;
}
class CollectModal extends React.PureComponent<Record<string, never>, State> {
  sub?: Subscription;
  requestId = 0;
  _scrollView: reactNativeSpringScrollview.SpringScrollView | null = null;
  state: State = {
    api: null,
    songItem: null,
    data: [],
    playlist: [],
    locals: [],
    mainModalShow: false,
  };
  loadPlaylists = async (api: Provider) => {
    const request = ++this.requestId;
    try {
      const local = await playlistFiles.getPlaylist();
      const stored = await users.getUserPlayList();
      if (request !== this.requestId) return;
      this.setState({
        playlist: stored?.[api] || [],
        locals: local.playlists,
      });
    } catch (error) {
      if (request === this.requestId) toast('读取歌单失败：' + errorMessage(error));
    }
  };
  onClosed = () => {
    this.requestId++;
    this.setState({
      api: null,
      songItem: null,
      data: [],
      mainModalShow: false,
      playlist: [],
      locals: [],
    });
  };
  onTop = () => {
    this._scrollView?.scrollToBegin();
  };
  _renderItem = ({item}: {item: Playlist}) => {
    const a = formatPlaylist(item, this.state.api!);
    return (
      <CustomPlaylistHeader
        title={a.title}
        img={a.img}
        onPress={() => {
          return this.onCollect(item);
        }}
        trackCount={a.trackCount}
      />
    );
  };
  onLocalCollect = async (index: number) => {
    try {
      const {api, data, songItem} = this.state;
      if (!api) throw new Error('未选择歌曲来源');
      const additions = songItem
        ? [
            {
              ...songItem,
              api: songItem.api || api,
            },
          ]
        : data?.map((song) => ({
            ...song,
            api: song.api || api,
          }));
      if (!additions?.length) {
        return;
      }
      const current = await playlistFiles.getPlaylist();
      const playlists = current.playlists.map((playlist, i) => {
        if (i === index) {
          return {
            ...playlist,
            tracks: [
              ...additions,
              ...playlist.tracks.filter(
                (song) => !additions.some((next) => getTrackKey(next) === getTrackKey(song)),
              ),
            ],
          };
        }
        return playlist;
      });
      await playlistFiles.toPlaylist({
        ...current,
        playlists,
      });
      this.onClosed();
    } catch (error) {
      toast(`收藏失败：${errorMessage(error)}`);
    }
  };
  onCollect = async (playlist: Playlist) => {
    let collected = 0;
    let total = 0;
    try {
      const {songItem, api, data} = this.state;
      const tracks = data.length ? data : songItem ? [songItem] : [];
      if (!tracks.length) throw new Error('未选择歌曲');
      total = tracks.length;
      if (api === providers.netEase) {
        if (playlist.id == null) throw new Error('歌单缺少标识');
        await this.collectToNetease(
          playlist.id,
          tracks.map((song) => {
            if (song.id == null) throw new Error('歌曲缺少标识');
            return song.id;
          }),
        );
      } else if (api === providers.qqMusic) {
        const account = (await users.getUserInfo())?.qqMusic;
        if (!account?.cookies) {
          throw new Error('请先登录 QQ 音乐');
        }
        const mids = tracks.map((song) => {
          const mid = song.songmid || song.mid;
          if (!mid) throw new Error('QQ 音乐歌曲缺少标识');
          return mid;
        });
        if (account.userId == null) throw new Error('QQ 音乐账号缺少标识');
        const liked = playlist.title === '我喜欢' || playlist.title === '喜欢';
        if (!liked && playlist.dirid == null) throw new Error('歌单缺少目录标识');
        for (const songmid of mids) {
          const response = liked
            ? await services.QQMusic.like({
                songmid,
                qq: account.userId,
                cookies: account.cookies,
              })
            : await services.QQMusic.addToDir({
                songmid,
                dirid: playlist.dirid!,
                qq: account.userId,
                cookies: account.cookies,
              });
          if (response?.code !== 0 && response?.title !== locales.COLLECT_SUCCESS) {
            throw new Error(locales.COLLECT_FAILED);
          }
          collected++;
        }
      } else throw new Error('该来源不能收藏到在线歌单');
      this.onClosed();
    } catch (error) {
      toast(
        `收藏失败${collected ? `（已完成 ${collected}/${total}）` : ''}：${errorMessage(error)}`,
      );
    }
  };
  collectToNetease = async (pid: TrackId, tracks: TrackId[]) => {
    const response = await services.Netease.playlist_tracks({
      pid,
      tracks,
    });
    if (!utils.usable(response)) {
      throw new Error(locales.COLLECT_FAILED);
    }
    if (response.code === 301) {
      throw new Error(locales.NETEASE_NOT_LOGIN);
    }
    if (response.code === 502) {
      toast(locales.COLLECT_DUPLICATE);
      return;
    }
    if (response.code !== 200) {
      throw new Error(`${locales.COLLECT_FAILED} (${response.code})`);
    }
    await users.removeNetEasePlaylistCache(pid);
  };
  componentDidMount() {
    this.sub = events.emitter.addListener(names.CollectModal, ({api, song, data}) => {
      if (api) {
        this.setState({
          api,
          mainModalShow: true,
          songItem: song || null,
          data: data || [],
        });
        this.loadPlaylists(api);
      }
    });
  }
  componentWillUnmount() {
    this.requestId++;
    this.sub?.remove();
  }
  render() {
    const state = this.state;
    const {playlist, locals} = state;
    return (
      <ReactNative.Modal
        animationType={'fade'}
        transparent={true}
        onRequestClose={this.onClosed}
        visible={this.state.mainModalShow}
      >
        <ReactNative.View style={q.container}>
          <components.Background
            imageStyle={{
              opacity: 0.5,
            }}
          />
          <ReactNative.TouchableWithoutFeedback onPress={this.onClosed}>
            <ReactNative.View style={[ReactNative.StyleSheet.absoluteFill]} />
          </ReactNative.TouchableWithoutFeedback>
          <PlaylistChoice onPress={this.onTop} content={locales.ADD_TO_MIX} />
          <FadingEdge top={30}>
            <reactNativeSpringScrollview.SpringScrollView
              ref={(t) => {
                this._scrollView = t;
              }}
            >
              <React.Fragment>
                {locals.map((t, a) => (
                  <CustomPlaylistHeader
                    key={a}
                    title={t.title}
                    img={t.img}
                    onPress={() => {
                      return this.onLocalCollect(a);
                    }}
                    trackCount={t.tracks.length}
                  />
                ))}
              </React.Fragment>
              {playlist.map((item) =>
                this._renderItem({
                  item,
                }),
              )}
              <ReactNative.View style={q.footer} />
            </reactNativeSpringScrollview.SpringScrollView>
          </FadingEdge>
          {locals.length < 1 && playlist.length < 1 && (
            <ReactNative.View style={q.null}>
              <Text
                style={[
                  q.text,
                  {
                    textAlign: 'center',
                    opacity: 0.8,
                  },
                ]}
              >
                {'空'}
                {'\n'}
                {'Null'}
              </Text>
            </ReactNative.View>
          )}
        </ReactNative.View>
      </ReactNative.Modal>
    );
  }
}
const q = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
  },
  null: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    height: 50,
  },
});
export default CollectModal;
