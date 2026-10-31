import {toast} from '../native/toast';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as Scrolling from './../components/Scrolling.js';
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
import ActionRow from './../modules/ActionRow.js';
import CloseButton from './../modules/CloseButton.js';
import _mediaStore from '../native/mediaStore';
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
class DetailModal extends React.PureComponent {
  actionsMap = null;
  state = {
    song: null,
    api: '',
    tools: TrackActions,
    artists: [],
    mainModalShow: false,
    sonModalShow: false,
    mvid: null,
  };
  getData = (e) => {
    if (e.api !== 'local') {
      const tools = this.state.tools;
      const artists = trackInfo.extractSingerItem(e.song, e.api);
      tools[2].value = trackInfo.extractSingerName(e.song, e.api);
      tools[3].value = trackInfo.extractAlbumName(e.song, e.api);
      const mvid = e.song.mv?.vid || e.song.vid || e.song.mvid || e.song.mv;
      const song = trackInfo.extractFullInfo(e.song, 'big');
      this.setState({
        song,
        songItem: e.song,
        index: e.index,
        api: e.api,
        tools,
        artists,
        playlistId: e.playlistId,
        mvid,
      });
    } else {
      this.setState({
        api: e.api,
        song: trackInfo.extractFullInfo(e.song, 'small'),
        songItem: e.song,
        index: e.index,
        tools: [TrackActions[0], C],
      });
    }
  };
  onClose = () => {
    this.setState({
      song: null,
      tools: TrackActions,
      artists: [],
      api: '',
      mainModalShow: false,
      sonModalShow: false,
    });
  };
  renderTools = (e) => {
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
    const l_state = this.state;
    const {songItem, index} = l_state;
    try {
      const removed = await _mediaStore.deleteAudio(songItem.id);
      if (removed) {
        events.emitter.emit(names.DeleteFromLocal, {
          deleteIndex: index,
        });
        this.onClose();
      }
    } catch (error) {
      toast(`${locales.DELETE_FAILED}：${error.message}`);
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
    const l_state = this.state;
    const {api, songItem} = l_state;
    switch (api) {
      case providers.netEase:
        trackid = songItem.id;
        events.emitter.emit(names.DeleteFromPlaylist, {
          api,
          trackid,
        });
        break;
      case providers.qqMusic:
        trackid = songItem.songid;
        events.emitter.emit(names.DeleteFromPlaylist, {
          api,
          trackid,
        });
    }
  };
  onListItem = (e) => {
    const api = this.state.api;
    const n = {
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
    const l_state = this.state;
    const {api, songItem} = l_state;
    events.emitter.emit(names.CollectModal, {
      api,
      song: songItem,
    });
  };
  onMV = () => {
    const l_state = this.state;
    const {mvid, api} = l_state;
    if (mvid) {
      queue.playMV(mvid, api);
      this.onClose();
    }
  };
  onLyric = () => {
    const l_state = this.state;
    const {api, songItem} = l_state;
    const uid = trackInfo.extractFullInfo(songItem).uid;
    this.navigateTo('LyricPage', {
      id: uid,
      item: songItem,
      api,
    });
  };
  onShare = () => {
    let message;
    const l_state = this.state;
    const {api, songItem} = l_state;
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
    ReactNative.Share.share({
      message,
    });
  };
  navigateTo = (e, t) => {
    utils.universalNavigator.navigate(e, t);
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
  onSingleArtist = (item) => {
    if (item) {
      const api = this.state.api;
      this.navigateTo('ArtistPage', {
        item,
        api,
      });
    }
  };
  onAlbum = () => {
    const l_state = this.state;
    const {api, songItem} = l_state;
    const item = trackInfo.extractAlbumItem(songItem, api);
    this.navigateTo('AlbumPage', {
      item,
      api,
    });
  };
  onComment = () => {
    const l_state = this.state;
    const {songItem, api} = l_state;
    this.navigateTo('CommentPage', {
      api,
      song: songItem,
    });
    this.onClose();
  };
  insertToQueue = () => {
    const l_state = this.state;
    const {songItem, api} = l_state;
    if (songItem) {
      events.emitter.emit(names.InsertToList, {
        data: songItem,
        type: 'item',
        api,
      });
    }
  };
  onDownload = () => {
    const l_state = this.state;
    const {songItem, api} = l_state;
    const cloneThroughLinking = this.props.cloneThroughLinking;
    const o = trackInfo.extractFullInfo(songItem.mainSong ? songItem.mainSong : songItem);
    const i = this.songName(o.song, o.singer);
    const o_uid = o.uid;
    downloadModule.download(i, o_uid, api, o, cloneThroughLinking);
  };
  saveCover = () => {
    const l_state = this.state;
    const {song, songItem} = l_state;
    events.emitter.emit(names.SavePicModal, {
      img: song.img,
      song: songItem.name,
    });
  };
  songName = function (e, t) {
    return `${t[0].name} - ${e}`.replace(/\//gi, 'x');
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
    this.sub.remove?.();
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
          mainModalShow && {
            height: constants.DEVICE_HEIGHT,
            width: constants.DEVICE_WIDTH,
          }
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
                    title={a + 1}
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
var w = ReactNative.StyleSheet.create({
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
