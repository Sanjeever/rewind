import {toast} from '../native/toast';
import * as React from 'react';
import * as ReactNative from 'react-native';
import FadingEdge from '../components/FadingEdge';
import * as reactNativeSpringScrollview from './../components/Scrolling';
import * as components from '../components/index';
import providers from '../services/providers';
import names from '../events/names';
import locales from '../locales/index';
import * as services from '../services/index';
import * as events from '../events/index';
import * as utils from '../utils/index';
import '../utils/types';
import * as trackInfo from '../services/trackInfo';
import users from '../storage/users';
import CustomPlaylistHeader from './../modules/CustomPlaylistHeader';
import PlaylistChoice from './../modules/PlaylistChoice';
import {formatPlaylist} from '../services/playlistInfo';
import {errorMessage} from '../utils/types';
import type {Provider} from '../services/providers';
import type {TrackFields, TrackId, ArtworkSize} from '../services/track';
import type {Playlist} from '../storage/models';
import type {Subscription} from '../events/Emitter';
class ChangePlaylistModal extends React.PureComponent<
  {songItem: TrackFields | null},
  {playlist: Playlist[]; modalVisible: boolean; loaded: boolean}
> {
  sub?: Subscription;
  requestId = 0;
  _scrollView: reactNativeSpringScrollview.SpringScrollView | null = null;
  state = {
    loaded: false,
    playlist: [],
    modalVisible: false,
  };
  closePickPlaylistModal = () => {
    this.requestId++;
    this.setState({
      modalVisible: false,
      playlist: [],
    });
  };
  songName = function (e: TrackFields | null, t: ArtworkSize = 'big') {
    if (e) {
      return trackInfo.extractFullInfo(e, t);
    }
    return null;
  };
  getPlaylist = async () => {
    const request = ++this.requestId;
    try {
      const stored = await users.getUserPlayList();
      const playlist: Playlist[] = [];
      for (const api of [providers.netEase, providers.qqMusic]) {
        for (const item of stored?.[api] || []) {
          playlist.push({
            ...item,
            api,
          });
        }
      }
      if (request !== this.requestId) return;
      this.setState({
        playlist,
        loaded: true,
      });
    } catch (error) {
      if (request === this.requestId) {
        this.setState({loaded: true});
        toast(errorMessage(error));
      }
    }
  };
  onTop = () => {
    this._scrollView?.scrollToBegin();
  };
  _renderItem = ({item}: {item: Playlist}) => {
    const l = formatPlaylist(item, item.api!);
    return (
      <CustomPlaylistHeader
        title={l.title}
        img={l.img}
        onPress={() => {
          return this.onChangePlaylist(item);
        }}
        trackCount={l.trackCount}
      />
    );
  };
  onChangePlaylist = (e: Playlist) => {
    switch (e.api) {
      case providers.netEase: {
        const t = e.id;
        if (t == null) throw new Error('歌单缺少标识');
        this.getNeteasePlayListDetail(t);
        break;
      }
      case providers.qqMusic: {
        const l = e.id || e.dissid;
        if (l == null) throw new Error('歌单缺少标识');
        this.getQQMusicPlayListDetail(l);
      }
    }
  };
  getQQMusicPlayListDetail = async (id: TrackId) => {
    const request = this.requestId;
    try {
      const account = (await users.getUserInfo())?.qqMusic;
      const playlists = await services.QQMusic.disslist({
        id,
        qq: account?.userId,
      });
      if (request !== this.requestId) return;
      if (!playlists?.[0]?.songlist) throw new Error(locales.PLAYLIST_FETCH_FAILED);
      this.qqMusicPlaylistPlay(playlists[0].songlist);
    } catch (error) {
      if (request === this.requestId) toast('歌单加载失败：' + errorMessage(error));
    }
  };
  qqMusicPlaylistPlay = (data: TrackFields[]) => {
    this.emit({
      data,
      api: providers.qqMusic,
    });
  };
  getNeteasePlayListDetail = async (id: TrackId) => {
    const request = this.requestId;
    try {
      const response = await services.Netease.playlist_detail(id);
      if (request !== this.requestId) return;
      if (response.code === 200 && response.playlist?.tracks) {
        this.emit({
          data: response.playlist.tracks,
          api: providers.netEase,
        });
      } else throw new Error(response.message || locales.PLAYLIST_FETCH_FAILED);
    } catch (error) {
      if (request === this.requestId) toast('歌单加载失败：' + errorMessage(error));
    }
  };
  emit = ({api, data}: {api: Provider; data: TrackFields[]}) => {
    if (!data.length) throw new Error('歌单为空');
    const index = utils.random.getInt(0, data.length);
    events.toPlayer({
      item: data[index],
      data,
      index,
      api,
      type: names.ChangePlaylist,
    });
    this.closePickPlaylistModal();
    events.emitter.emit(names.NowPlayingModal, {
      forceClose: true,
    });
  };
  componentDidMount() {
    this.sub = events.emitter.addListener(names.ChangePlaylist, () => {
      this.setState({
        modalVisible: true,
        loaded: false,
      });
      this.getPlaylist();
    });
  }
  componentWillUnmount() {
    this.requestId++;
    this.sub?.remove();
  }
  render() {
    const songItem = this.props.songItem;
    const state = this.state;
    const {playlist, modalVisible} = state;
    const c = this.songName(songItem, 'small');
    return (
      <ReactNative.Modal
        animationType={'fade'}
        onRequestClose={this.closePickPlaylistModal}
        visible={modalVisible}
      >
        <ReactNative.View
          style={{
            flex: 1,
            alignItems: 'center',
          }}
        >
          <components.Background coverUrl={c?.img} blur={true} />
          <ReactNative.TouchableWithoutFeedback onPress={this.closePickPlaylistModal}>
            <ReactNative.View style={ReactNative.StyleSheet.absoluteFill} />
          </ReactNative.TouchableWithoutFeedback>
          <PlaylistChoice onPress={this.onTop} content={locales.TOGGLE_MIX} />
          <FadingEdge top={30}>
            <reactNativeSpringScrollview.SpringScrollView
              ref={(t) => {
                this._scrollView = t;
              }}
            >
              {playlist?.length > 0 ? (
                playlist.map((item) =>
                  this._renderItem({
                    item,
                  }),
                )
              ) : this.state.loaded ? (
                <ReactNative.View />
              ) : (
                <components.Spinkit />
              )}
              <components.EmptyFooter />
            </reactNativeSpringScrollview.SpringScrollView>
          </FadingEdge>
        </ReactNative.View>
      </ReactNative.Modal>
    );
  }
}
export default ChangePlaylistModal;
