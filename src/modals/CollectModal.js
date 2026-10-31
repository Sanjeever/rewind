import {toast} from '../native/toast';
import Text from './../components/Text';
import * as React from 'react';
import * as ReactNative from 'react-native';
import FadingEdge from '../components/FadingEdge';
import * as reactNativeSpringScrollview from './../components/Scrolling.js';
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
import CustomPlaylistHeader from './../modules/CustomPlaylistHeader.js';
import PlaylistChoice from './../modules/PlaylistChoice.js';
class CollectModal extends React.PureComponent {
  state = {
    api: '',
    data: [],
    playlist: [],
    locals: [],
    mainModalShow: false,
  };
  getLocalPlaylist = () => {
    playlistFiles.getPlaylist().then((e) => {
      if (e.playlists.length > 0) {
        this.setState({
          locals: e.playlists,
        });
      }
    });
  };
  playlist = async (api) => {
    const stored = await users.getUserPlayList();
    this.setState({
      playlist: stored?.[api] || [],
    });
  };
  onClosed = () => {
    this.setState({
      api: '',
      mainModalShow: false,
      playlist: [],
      locals: [],
    });
  };
  onTop = () => {
    this._scrollView.scrollToBegin?.();
  };
  _renderItem = ({item}) => {
    const a = this.formatItem(item);
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
  formatItem = (e) => {
    const api = this.state.api;
    const a = {};
    if (api === providers.netEase) {
      a.title = e.name;
      a.img = `${e.coverImgUrl}?param=200y200`;
      a.trackCount = e.trackCount;
    } else if (api === providers.qqMusic) {
      const r = this.qqMusicItem(e);
      a.title = r.title;
      a.img = r.picurl;
      a.trackCount = r.num;
    }
    return a;
  };
  qqMusicItem = function (e) {
    const t = {};
    if (e.title) {
      t.title = e.title;
      t.picurl =
        e.picurl !== ''
          ? e.picurl
          : 'http://s4.music.126.net/style/web2/img/default/default_album.jpg';
      t.num = e.subtitle !== '' ? e.subtitle.replace(/\u9996.+/, '') : null;
      t.id = e.id || e.dissid;
      t.dirid = e.dirid;
    } else {
      t.title = e.dissname;
      t.num = e.songnum;
      t.picurl = e.logo;
      t.id = e.dissid;
      t.dirid = e.dirid;
    }
    return t;
  };
  onLocalCollect = async (index) => {
    try {
      const {api, data, songItem} = this.state;
      const additions = songItem
        ? [
            {
              ...songItem,
              api,
            },
          ]
        : data?.map((song) => ({
            ...song,
            api,
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
                (song) => !additions.some((next) => next.id === song.id && next.api === song.api),
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
      toast(`收藏失败：${error.message}`);
    }
  };
  onCollect = async (playlist) => {
    try {
      const {songItem, api, data} = this.state;
      if (api === providers.netEase) {
        await this.collectToNetease(
          playlist.id,
          Array.isArray(data) && data.length ? data.map((song) => song.id) : songItem.id,
        );
      } else if (api === providers.qqMusic) {
        const account = (await users.getUserInfo())?.qqMusic;
        if (!account?.cookies) {
          throw new Error('请先登录 QQ 音乐');
        }
        const songmid = songItem.songmid || songItem.mid;
        const response =
          playlist.title === '我喜欢'
            ? await services.QQMusic.like({
                songmid,
                qq: account.userId,
                cookies: account.cookies,
              })
            : await services.QQMusic.addToDir({
                songmid,
                dirid: playlist.dirid,
                qq: account.userId,
                cookies: account.cookies,
              });
        if (response?.code !== 0 && response?.title !== locales.COLLECT_SUCCESS) {
          throw new Error(locales.COLLECT_FAILED);
        }
      }
      this.onClosed();
    } catch (error) {
      toast(`收藏失败：${error.message}`);
    }
  };
  collectToNetease = async (pid, tracks) => {
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
    const e = this;
    this.sub = events.emitter.addListener(names.CollectModal, function ({api, song, data}) {
      if (api) {
        e.setState({
          api,
          mainModalShow: true,
        });
        e.playlist(api);
        e.getLocalPlaylist();
        if (song) {
          e.setState({
            songItem: song,
          });
        } else if (data) {
          e.setState({
            data,
          });
        }
      }
    });
  }
  componentWillUnmount() {
    this.sub.remove?.();
  }
  render() {
    const e = this;
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
              ref={function (t) {
                return (e._scrollView = t);
              }}
            >
              <React.Fragment>
                {locals.map((t, a) => (
                  <CustomPlaylistHeader
                    key={a}
                    title={t.title}
                    img={t.img}
                    onPress={function () {
                      return e.onLocalCollect(a);
                    }}
                    trackCount={t.tracks.length}
                  />
                ))}
              </React.Fragment>
              {playlist.map((item, index) =>
                e._renderItem({
                  item,
                  index,
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
var q = ReactNative.StyleSheet.create({
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
