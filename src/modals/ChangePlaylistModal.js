import * as _appStorage from './../storage/index.js';
import * as React from 'react';
import * as ReactNative from 'react-native';
import FadingEdge from '../components/FadingEdge';
import * as reactNativeSpringScrollview from './../components/Scrolling.js';
import * as components from '../components/index';
import providers from '../services/providers';
import names from '../events/names';
import keys from '../storage/keys';
import locales from '../locales/index';
import * as services from '../services/index';
import * as events from '../events/index';
import * as utils from '../utils/index';
import '../utils/types';
import * as trackInfo from '../services/trackInfo';
import users from '../storage/users';
import CustomPlaylistHeader from './../modules/CustomPlaylistHeader.js';
import PlaylistChoice from './../modules/PlaylistChoice.js';
class ChangePlaylistModal extends React.PureComponent {
  state = {
    playlist: [],
    modalVisible: false,
  };
  closePickPlaylistModal = () => {
    this.setState({
      modalVisible: false,
      playlist: [],
    });
  };
  songName = function (e, t = 'big') {
    if (e) {
      return trackInfo.extractFullInfo(e, t);
    }
    return null;
  };
  getPlaylist = async () => {
    const stored = await users.getUserPlayList();
    const playlist = [];
    for (const api of [providers.netEase, providers.qqMusic]) {
      for (const item of stored?.[api] || []) {
        playlist.push({
          ...item,
          api,
        });
      }
    }
    this.setState({
      playlist,
    });
  };
  onTop = () => {
    this._scrollView.scrollToBegin?.();
  };
  _renderIndexPath = ({row}) => {
    const playlist = this.state.playlist;
    return this._renderItem({
      item: playlist[row],
      index: row,
    });
  };
  formatItem = (e) => {
    const t = {};
    if (e.api === providers.netEase) {
      t.title = e.name;
      t.img = `${e.coverImgUrl}?param=200y200`;
      t.trackCount = e.trackCount;
    } else if (e.api === providers.qqMusic) {
      const l = this.qqMusicItem(e);
      t.title = l.title;
      t.img = l.picurl;
      t.trackCount = l.num;
    }
    return t;
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
  _renderItem = ({item}) => {
    const l = this.formatItem(item);
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
  onChangePlaylist = (e) => {
    switch (e.api) {
      case providers.netEase:
        const t = e.id;
        this.getNeteasePlayListDetail(t);
        break;
      case providers.qqMusic:
        const l = e.id || e.dissid;
        this.getQQMusicPlayListDetail(l);
    }
  };
  getQQMusicPlayListDetail = (id) => {
    _appStorage.storage
      .load({
        key: keys.userInfo,
      })
      .then((t) => {
        if (t) {
          const qq = t.qqMusic.userId;
          services.QQMusic.disslist({
            id,
            qq,
          }).then((e) => {
            const songlist = e[0].songlist;
            this.qqMusicPlaylistPlay(songlist);
          });
        }
      })
      .catch(() => {
        services.QQMusic.disslist({
          id,
        }).then((e) => {
          if (e) {
            const t = e[0].songlist;
            this.qqMusicPlaylistPlay(t);
          }
        });
      });
  };
  qqMusicPlaylistPlay = (data) => {
    this.emit({
      data,
      api: providers.qqMusic,
    });
  };
  getNeteasePlayListDetail = async (id) => {
    const response = await services.Netease.playlist_detail(id);
    if (response?.playlist) {
      this.emit({
        data: response.playlist.tracks,
        api: providers.netEase,
      });
    }
  };
  emit = ({api, data}) => {
    const index = utils.random.getInt(1, data.length);
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
    const e = this;
    this.sub = events.emitter.addListener(names.ChangePlaylist, function () {
      e.setState({
        modalVisible: true,
      });
      e.getPlaylist();
    });
  }
  componentWillUnmount() {
    this.sub.remove?.();
  }
  render() {
    const e = this;
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
              ref={function (t) {
                return (e._scrollView = t);
              }}
            >
              {playlist?.length > 0 ? (
                playlist.map((item, index) =>
                  e._renderItem({
                    item,
                    index,
                  }),
                )
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
