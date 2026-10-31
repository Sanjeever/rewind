import * as immer from 'immer';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeLargelist from './../components/Scrolling.js';
import * as components from '../components/index';
import * as modals from '../modals/index';
import * as constants from '../theme/constants';
import locales from '../locales/index';
import * as events from '../events/index';
import * as utils from '../utils/index';
import * as trackInfo from '../services/trackInfo';
import playlistFiles from '../storage/playlistFiles';
const constants_DEVICE_WIDTH = constants.DEVICE_WIDTH;
class CustomPlaylist extends React.PureComponent {
  _nativeOffset = {
    x: new ReactNative.Animated.Value(0),
    y: new ReactNative.Animated.Value(0),
  };
  onDeleteCustom = async (ids) => {
    const tracks = this.state.oriList.filter((song) => !ids.includes(song.id));
    await this.updatePlaylist(tracks);
    this.setState({
      playlist: tracks,
      oriList: tracks,
    });
  };
  updatePlaylist = async (tracks) => {
    const current = await playlistFiles.getPlaylist();
    const playlists = immer.produce(current.playlists, (draft) => {
      draft[this.state.playlistIndex].tracks = tracks;
    });
    await playlistFiles.toPlaylist({
      ...current,
      playlists,
    });
  };
  _renderIndexPath = ({row}) => {
    const playlist = this.state.playlist;
    return this._renderItem({
      item: playlist[row],
      index: row,
    });
  };
  _renderItem = ({item, index}) => {
    const l = trackInfo.extractFullInfo(item);
    return (
      <components.SongRow
        index={index}
        song={l.song}
        singer={l.singer}
        album={l.album}
        onLongPress={() => {
          return this.alertDeleteItem(index);
        }}
        onPress={() => {
          return this.playMusic(item, index, item.api);
        }}
        detail={function () {
          return events.toDetailModal({
            item,
            index,
            api: item.api,
          });
        }}
        addToQueue={function () {
          return events.toInsertToList({
            data: item,
            api: item.api,
          });
        }}
      />
    );
  };
  alertDeleteItem = (e) => {
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
        onPress: () => {
          return this.deleteItem(e);
        },
      },
    ]);
  };
  deleteItem = async (index) => {
    const tracks = this.state.playlist.filter((song, i) => i !== index);
    try {
      await this.updatePlaylist(tracks);
      this.setState({
        playlist: tracks,
        oriList: tracks,
      });
    } catch (error) {
      toast(`保存歌单失败：${error.message}`);
    }
  };
  searchSong = (e) => {
    const oriList = this.state.oriList;
    if (oriList) {
      const playlist = utils.filterHelper.quickSearch(oriList, e);
      this.setState({
        playlist,
        searching: e !== '',
        index: null,
        showRestore: e !== '',
      });
    }
  };
  onTop = () => {
    this._list?.scrollTo({
      x: 0,
      y: 0,
    });
  };
  onScroll = (e) => {
    const t = e.nativeEvent.contentOffset.y;
    const n = constants_DEVICE_WIDTH - 100;
    if (t < n) {
      this.setState({
        showHeader: false,
        title: locales.MIX,
      });
    } else if (t > n) {
      this.setState({
        showHeader: true,
        title: this.state.name,
      });
    }
  };
  playMusic = (item, t, api) => {
    const a_state = this.state;
    const {searching, playlist} = a_state;
    let index = t;
    if (searching === true) {
      playlist.filter((t, a) => {
        if (t.id === item.id) {
          index = a;
        }
      });
    }
    this.setState({
      index,
    });
    events.toPlayer({
      item,
      data: playlist,
      index,
      api,
    });
  };
  goBack = () => {
    this.props.navigation.goBack();
  };
  state = {
    title: locales.MIX,
    playlistIndex: null,
    playlist: [],
    oriList: [],
    loading: true,
    searching: false,
    showList: true,
    showModal: false,
    showRestore: false,
    showHeader: false,
    subscribed: false,
    showMult: false,
  };
  componentDidMount() {
    const params = this.props.route.params;
    const {playlist, index} = params;
    const playlist_tracks = playlist.tracks;
    this.setState({
      playlistIndex: index,
      playlist: playlist_tracks,
      oriList: playlist_tracks,
      name: playlist.title,
      loading: false,
    });
  }
  render() {
    const e = this;
    const img = this.props.route.params.playlist.img;
    return (
      <ReactNative.View style={x.container}>
        <components.Background />
        <reactNativeLargelist.LargeList
          ref={function (t) {
            return (e._list = t);
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
          renderHeader={function () {
            return (
              <ReactNative.View>
                <components.PlaylistForeground
                  coverImgUrl={img}
                  onMult={function () {
                    return e.setState({
                      showMult: true,
                    });
                  }}
                  disabledLastPlayedSong={true}
                />
              </ReactNative.View>
            );
          }}
          onScroll={this.onScroll}
          onNativeContentOffsetExtract={this._nativeOffset}
        />
        <components.HeaderBar
          headerStyle={x.header}
          title={this.state.title}
          goBack={this.goBack}
          onTop={this.onTop}
          textInput={!this.state.loading}
          onChangeText={function (t) {
            return e.searchSong(t);
          }}
          opacity={this._nativeOffset.y.interpolate({
            inputRange: [0, constants_DEVICE_WIDTH - 100],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          })}
          blur={true}
          bold={true}
        />
        <modals.MultiplySelectModal
          visible={this.state.showMult}
          onClose={function () {
            return e.setState({
              showMult: false,
            });
          }}
          data={this.state.playlist}
          api={'local'}
          isCustom={true}
          onDeleteCustom={this.onDeleteCustom}
        />
      </ReactNative.View>
    );
  }
}
var x = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
  },
});
export default CustomPlaylist;
