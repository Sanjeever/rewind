import {toast} from '../native/toast';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as Scrolling from './../components/Scrolling';
import * as Index from '../components/index';
import providers from '../services/providers';
import * as constants from '../theme/constants';
import TrackActions from './../modules/TrackActions';
import names from '../events/names';
import icons from '../theme/icons';
import locales from '../locales/index';
import downloadModule from '../services/download';
import * as events from '../events/index';
import * as utils from '../utils/index';
import * as trackInfo from '../services/trackInfo';
import queue from '../events/queue';
import ActionRow from './../modules/ActionRow';
import CloseButton from './../modules/CloseButton';
import _mediaStore from '../native/mediaStore';
import type {Provider} from '../services/providers';
import type {TrackFields, TrackId, Artist} from '../services/track';
import type {TrackDetails} from '../events/types';
import type {Subscription} from '../events/Emitter';
import type {NavigateArgs} from '../navigation/types';
import {errorMessage} from '../utils/types';
interface Tool {
  title: string;
  value?: string;
  needCheck?: boolean;
}
interface State {
  song: ReturnType<typeof trackInfo.extractFullInfo> | null;
  songItem: TrackFields | null;
  api: Provider | null;
  tools: Tool[];
  artists: Artist[];
  index?: number;
  playlistId?: TrackId | null;
  mainModalShow: boolean;
  sonModalShow: boolean;
  mvid: TrackId | null;
}
const C = {
  title: locales.DELETE_FROM_LOCAL,
  icon: {
    name: icons.DELETE,
    color: constants.COLORS.secondary,
  },
};
const D = {
  title: locales.DELETE_FROM_PLAYLIST,
  icon: {
    name: icons.DELETE,
    color: constants.COLORS.secondary,
  },
};
class DetailModal extends React.PureComponent<
  {isRound: boolean; cloneThroughLinking: boolean},
  State
> {
  sub?: Subscription;
  state: State = {
    song: null,
    songItem: null,
    api: null,
    tools: TrackActions,
    artists: [],
    mainModalShow: false,
    sonModalShow: false,
    mvid: null,
  };
  getData = (e: TrackDetails) => {
    if (e.api !== 'local') {
      const tools: Tool[] = TrackActions.map((tool) => ({...tool}));
      const artists = trackInfo.extractSingerItem(e.song, e.api);
      tools[2].value = trackInfo.extractSingerName(e.song, e.api);
      tools[3].value = trackInfo.extractAlbumName(e.song, e.api);
      const mvid =
        (typeof e.song.mv === 'object' ? e.song.mv.vid : e.song.mv) ||
        e.song.vid ||
        e.song.mvid ||
        null;
      const song = trackInfo.extractFullInfo(e.song, 'big');
      this.setState({
        song,
        songItem: e.song,
        index: e.index,
        api: e.api,
        tools,
        artists: artists || [],
        playlistId: e.playlistId,
        mvid,
      });
    } else {
      this.setState({
        api: e.api,
        song: trackInfo.extractFullInfo(e.song, 'small'),
        songItem: e.song,
        index: e.index,
        playlistId: null,
        artists: [],
        mvid: null,
        tools: [TrackActions[0], C],
      });
    }
  };
  onClose = () => {
    this.setState({
      song: null,
      songItem: null,
      tools: TrackActions,
      artists: [],
      api: null,
      playlistId: null,
      mvid: null,
      mainModalShow: false,
      sonModalShow: false,
    });
  };
  renderTools = (e: Tool[]) => {
    return e.map((e, t) => {
      if (e.needCheck && !e.value) {
        return null;
      }
      return (
        <ActionRow
          key={t}
          title={e.title}
          value={e.value}
          onPress={() => {
            return this.onListItem(t);
          }}
        />
      );
    });
  };
  deleteFromLocalAlert = () => {
    ReactNative.Alert.alert(locales.DELETE_THIS_SONG, locales.CAN_NOT_RECOVER, [
      {
        text: locales.CANCEL,
        onPress: function () {
          return null;
        },
        style: 'cancel',
      },
      {
        text: locales.CONFIRM,
        onPress: this.deleteFromLocal,
      },
    ]);
  };
  deleteFromLocal = async () => {
    const state = this.state;
    const {songItem, index} = state;
    try {
      if (songItem?.id == null || index == null) throw new Error('歌曲缺少本地标识');
      const removed = await _mediaStore.deleteAudio(songItem.id);
      if (removed) {
        events.emitter.emit(names.DeleteFromLocal, {
          deleteIndex: index,
        });
        this.onClose();
      }
    } catch (error) {
      toast(`${locales.DELETE_FAILED}：${errorMessage(error)}`);
    }
  };
  alertDeleteFromPlaylist = () => {
    ReactNative.Alert.alert(locales.WARN, locales.CONFIRM_DELETE_FROM_PLAYLIST, [
      {
        text: locales.CANCEL,
        onPress: function () {
          return null;
        },
        style: 'cancel',
      },
      {
        text: locales.CONFIRM,
        onPress: () => {
          return this.deleteFromPlaylist();
        },
      },
    ]);
  };
  deleteFromPlaylist = () => {
    let trackid;
    const state = this.state;
    const {api, songItem} = state;
    if (!songItem) return;
    switch (api) {
      case providers.netEase:
        trackid = songItem.id;
        if (trackid == null) return;
        events.emitter.emit(names.DeleteFromPlaylist, {
          api,
          trackid,
        });
        break;
      case providers.qqMusic:
        trackid = songItem.songid || songItem.id;
        if (trackid == null) return;
        events.emitter.emit(names.DeleteFromPlaylist, {
          api,
          trackid,
        });
    }
  };
  onListItem = (e: number) => {
    const api = this.state.api;
    const n: Record<number, () => void> = {
      0: this.insertToQueue,
      1: api === 'local' ? this.deleteFromLocalAlert : this.onCollect,
      2: this.onArtist,
      3: this.onAlbum,
      4: this.onComment,
      5: this.onShare,
      6: this.onLyric,
      7: this.onDownload,
      8: this.onMV,
    };
    n[e]?.();
  };
  onCollect = () => {
    const state = this.state;
    const {api, songItem} = state;
    if (!api || !songItem) return;
    events.emitter.emit(names.CollectModal, {
      api,
      song: songItem,
    });
  };
  onMV = () => {
    const state = this.state;
    const {mvid, api} = state;
    if (mvid && api) {
      queue.playMV(mvid, api);
      this.onClose();
    }
  };
  onLyric = () => {
    const state = this.state;
    const {api, songItem} = state;
    if (!api || !songItem) return;
    const uid = trackInfo.extractFullInfo(songItem).uid;
    if (uid == null) return;
    this.navigateTo('LyricPage', {
      id: uid,
      item: songItem,
      api,
    });
  };
  onShare = () => {
    let message;
    const state = this.state;
    const {api, songItem} = state;
    if (!songItem) return;
    const o = trackInfo.extractFullInfo(songItem);
    const r = utils.parseArtist(o.singer);
    const o_uid = o.uid;
    switch (api) {
      case providers.netEase:
        message = `${r} - ${o.song} : http://music.163.com/song?id=${o_uid} (@网易云音乐)`;
        break;
      case providers.qqMusic:
        message = `${r} - ${o.song} : https://y.qq.com/n/yqq/song/${o_uid}.html (@QQ音乐)`;
    }
    if (!message) return;
    ReactNative.Share.share({
      message,
    });
  };
  navigateTo = (...args: NavigateArgs) => {
    utils.universalNavigator.navigate(...args);
    events.emitter.emit(names.PlayerClose);
    events.emitter.emit(names.NowPlayingModal, {
      forceClose: true,
    });
    this.onClose();
  };
  onArtist = () => {
    const artists = this.state.artists;
    if (artists.length > 1) {
      this.setState({
        sonModalShow: true,
      });
    } else if (artists.length > 0) {
      this.onSingleArtist(artists[0]);
    }
  };
  onSingleArtist = (item: Artist) => {
    if (item && this.state.api) {
      const api = this.state.api;
      this.navigateTo('ArtistPage', {
        item,
        api,
      });
    }
  };
  onAlbum = () => {
    const state = this.state;
    const {api, songItem} = state;
    if (!songItem || !api) return;
    const item = trackInfo.extractAlbumItem(songItem, api);
    if (!item || typeof item !== 'object' || Array.isArray(item)) return;
    this.navigateTo('AlbumPage', {
      item,
      api,
    });
  };
  onComment = () => {
    const state = this.state;
    const {songItem, api} = state;
    if (!songItem || !api) return;
    this.navigateTo('CommentPage', {
      api,
      song: songItem,
    });
    this.onClose();
  };
  insertToQueue = () => {
    const state = this.state;
    const {songItem, api} = state;
    if (songItem && api) {
      events.emitter.emit(names.InsertToList, {
        data: songItem,
        type: 'item',
        api,
      });
    }
  };
  onDownload = () => {
    const state = this.state;
    const {songItem, api} = state;
    if (!songItem || !api) return;
    const cloneThroughLinking = this.props.cloneThroughLinking;
    const o = trackInfo.extractFullInfo(songItem);
    const i = this.songName(o.song, o.singer);
    const o_uid = o.uid;
    if (o_uid == null) return;
    downloadModule.download(
      i,
      o_uid,
      api,
      {
        song: o.song,
        singer: o.singer,
        album: o.album,
        img: o.img,
      },
      cloneThroughLinking,
    );
  };
  saveCover = () => {
    const state = this.state;
    const {song, songItem} = state;
    if (!song || !songItem) return;
    events.emitter.emit(names.SavePicModal, {
      img: song.img,
      song: songItem.name,
    });
  };
  songName = function (e: string | undefined, t: TrackFields['singer']) {
    return `${utils.parseArtist(t)} - ${e}`.replace(/\//gi, 'x');
  };
  componentDidMount() {
    this.sub = events.emitter.addListener(names.DetailModal, (t) => {
      this.setState({
        mainModalShow: true,
      });
      this.getData(t);
    });
  }
  componentWillUnmount() {
    this.sub?.remove();
  }
  render() {
    const state = this.state;
    const {song, playlistId, mvid, mainModalShow, sonModalShow, tools, artists} = state;
    const isRound = this.props.isRound;
    return (
      <ReactNative.Modal
        animationType={'fade'}
        onRequestClose={this.onClose}
        visible={mainModalShow}
        style={
          mainModalShow
            ? {
                height: constants.DEVICE_HEIGHT,
                width: constants.DEVICE_WIDTH,
              }
            : undefined
        }
      >
        <ReactNative.View style={w.container}>
          <Index.Background
            imageStyle={{
              opacity: 0.5,
            }}
            coverUrl={song?.img}
            blur={true}
          />
          <Scrolling.SpringScrollView
            style={{
              padding: 10,
              flex: 1,
              width: '100%',
              paddingBottom: 0,
            }}
            showsVerticalScrollIndicator={false}
            overScrollMode={'never'}
          >
            <ReactNative.TouchableWithoutFeedback onPress={this.onClose}>
              <ReactNative.View style={[ReactNative.StyleSheet.absoluteFill]} />
            </ReactNative.TouchableWithoutFeedback>
            <ReactNative.View
              style={{
                height: 0.1 * constants.DEVICE_HEIGHT,
                width: '100%',
              }}
            />
            {song ? (
              <ReactNative.View style={w.songAvatar}>
                <ReactNative.TouchableOpacity onPress={this.saveCover}>
                  <ReactNative.Image
                    source={{
                      uri: song.img,
                    }}
                    style={{
                      height: 150,
                      width: 150,
                      borderRadius: isRound ? 75 : 5,
                    }}
                  />
                </ReactNative.TouchableOpacity>
                {mvid ? <CloseButton onPress={this.onMV} isRound={isRound} /> : null}
                <Index.Selectable
                  numberOfLines={3}
                  style={[
                    w.text,
                    {
                      flex: 1,
                      fontSize: 18,
                      fontWeight: 'bold',
                      marginTop: 10,
                    },
                  ]}
                >
                  {song.song}
                </Index.Selectable>
                <Index.Selectable
                  style={[
                    w.text,
                    {
                      fontSize: 13,
                    },
                  ]}
                >
                  {song.album}
                </Index.Selectable>
              </ReactNative.View>
            ) : null}
            <ReactNative.View style={w.tool}>
              {playlistId && <ActionRow title={D.title} onPress={this.alertDeleteFromPlaylist} />}
              {this.renderTools(tools)}
            </ReactNative.View>
            <ReactNative.View
              style={{
                height: 0.1 * constants.DEVICE_HEIGHT,
                width: '100%',
              }}
            />
          </Scrolling.SpringScrollView>
          <ReactNative.Modal
            animationType={'fade'}
            transparent={true}
            onRequestClose={() => {
              return this.setState({
                sonModalShow: false,
              });
            }}
            visible={sonModalShow}
          >
            <ReactNative.View
              style={[
                w.container,
                {
                  paddingTop: '80%',
                },
              ]}
            >
              <ReactNative.TouchableWithoutFeedback
                onPress={() => {
                  return this.setState({
                    sonModalShow: false,
                  });
                }}
              >
                <ReactNative.View style={[ReactNative.StyleSheet.absoluteFill]} />
              </ReactNative.TouchableWithoutFeedback>
              {artists?.map((t, a) => {
                return (
                  <ActionRow
                    key={a}
                    value={t.name}
                    title={String(a + 1)}
                    onPress={() => {
                      return this.onSingleArtist(t);
                    }}
                  />
                );
              })}
            </ReactNative.View>
          </ReactNative.Modal>
        </ReactNative.View>
      </ReactNative.Modal>
    );
  }
}
export default DetailModal;
const w = ReactNative.StyleSheet.create({
  container: {
    height: constants.DEVICE_HEIGHT,
    width: constants.DEVICE_WIDTH,
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,1)',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
  songAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 10,
  },
  tool: {
    flex: 1,
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
  },
});
