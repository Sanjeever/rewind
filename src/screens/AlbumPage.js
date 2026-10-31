import {toast} from '../native/toast';
import Clipboard from '@react-native-clipboard/clipboard';
import _default2 from './../components/Text';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as components from '../components/index';
import OverflowMenu from './../modules/OverflowMenu.js';
import providers from '../services/providers';
import * as constants from '../theme/constants';
import icons from '../theme/icons';
import locales from '../locales/index';
import * as services from '../services/index';
import * as events from '../events/index';
import * as utils from '../utils/index';
import queue from '../events/queue';
import * as sharedUrlsModule from '../services/sharedUrls';
import Description from './album/Description';
const constants_DEVICE_WIDTH = constants.DEVICE_WIDTH;
class AlbumPage extends React.PureComponent {
  _nativeOffset = {
    x: new ReactNative.Animated.Value(0),
    y: new ReactNative.Animated.Value(0),
  };
  getDurationSum = (e) => {
    const api = this.state.api;
    if (api == providers.netEase) {
      return e.reduce((acc, item) => acc + item.duration, 0) / 1000;
    }
    if (api === providers.duration) {
      return e.reduce((acc, item) => acc + item.interval, 0);
    }
  };
  netEaseAlbum = async (id) => {
    const response = await services.Netease.album(id);
    if (!utils.usable(response)) {
      return;
    }
    if (response.code !== 200) {
      toast(`${locales.ERROR} -> ${response.code}`);
      return;
    }
    const album = response.album;
    const songs = response.songs || album.songs;
    if (songs) {
      this.setState({
        data: songs,
        loaded: true,
        id,
        publishTime: utils.timeFormatter.localeString(album.publishTime),
        company: album.company,
        description: album.description,
        duration: this.getDurationSum(songs),
      });
      await this.netEaseIsLikedAlbum();
    }
  };
  qqMusicAlbum = (id) => {
    services.QQMusic.album_song(id).then(({aDate, company, desc, list}) => {
      if (list) {
        this.setState({
          data: list,
          loaded: true,
          id,
          publishTime: aDate,
          company,
          description: desc,
          duration: this.getDurationSum(list),
        });
      }
    });
  };
  getAlbum = (e, t) => {
    if (e) {
      switch (t) {
        case providers.netEase:
          const n = `${e.picUrl}?param=500y500`;
          this.setState({
            title: e.name,
            albumImg: n,
          });
          this.netEaseAlbum(e.id);
          break;
        case providers.qqMusic:
          const i = e.albumMID || e.mid || e.albummid;
          const title = e.albumName || e.name || e.albumname;
          const l = `http://y.gtimg.cn/music/photo_new/T002R500x500M000${i}.jpg`;
          this.setState({
            title,
            albumImg: l,
          });
          this.qqMusicAlbum(i);
      }
    }
  };
  goBack = () => {
    this.props.navigation.goBack();
  };
  onDesc = () => {
    this.setState({
      showModal: true,
    });
  };
  onPlayAll = () => {
    const a_state = this.state;
    const {api, data} = a_state;
    const item = data[0];
    events.toPlayer({
      item,
      data,
      index: 0,
      api,
    });
  };
  addToPlaylist = () => {
    const a_state = this.state;
    const {api, data} = a_state;
    events.toInsertToList({
      data,
      api,
      type: 'array',
    });
  };
  onWebview = () => {
    const url = this.getSharedLink();
    this.props.navigation.navigate('WebViewPage', {
      url,
    });
  };
  onCopy = () => {
    const title = this.state.title;
    Clipboard.setString(title);
    toast(`${locales.COPIED} ${title}`);
  };
  onOpenUrl = () => {
    const e = this.getSharedLink();
    ReactNative.Linking.openURL(e);
  };
  onShare = () => {
    const message = this.getSharedLink();
    ReactNative.Share.share({
      message,
    });
  };
  getSharedLink = () => {
    const a_state = this.state;
    const {api, id} = a_state;
    return sharedUrlsModule.sharedUrls[api].album + id;
  };
  onLikeAlbumImpl = () => {
    const a_state = this.state;
    const {api, followed, id} = a_state;
    switch (api) {
      case providers.netEase:
        this.setState({
          followed: !followed,
        });
        this.netEaseLikeAlbum(id, !followed);
    }
    toast(!followed == true ? '已收藏。' : '取消收藏。');
  };
  onLikeAlbum = () => {
    if (this.state.followed) {
      ReactNative.Alert.alert(null, '取消收藏？', [
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
            this.onLikeAlbumImpl();
          },
        },
      ]);
    } else {
      this.onLikeAlbumImpl();
    }
  };
  netEaseIsLikedAlbum = async () => {
    const response = await services.Netease.sublist_album({
      limit: 1000,
    });
    if (response?.code === 200 && Array.isArray(response.data)) {
      this.setState({
        followed: response.data.some((album) => album.id === this.state.id),
      });
    }
  };
  netEaseLikeAlbum = async (id, like) => {
    const response = await services.Netease.sublist_album_add({
      id,
      op: like === true ? 'sub' : 'unsub',
    });
    if (utils.usable(response) && response.code !== 200) {
      toast(`${locales.ERROR} -> ${response.code}`);
    }
  };
  onTop = () => {
    this._list?.scrollTo({
      x: 0,
      y: 0,
    });
  };
  formatListItem = (e) => {
    const t = {};
    const api = this.state.api;
    if (api === providers.netEase) {
      t.song = e.name;
      t.singer = e.artists;
      t.duration = utils.timeFormatter.parseTime(e.duration / 1000);
      t.alias = utils.delve(e, 'transNames.0');
      t.showMV = e.mvid || e.mv;
    } else if (api === providers.qqMusic) {
      t.song = e.songname;
      t.singer = e.singer;
      t.duration = utils.timeFormatter.parseTime(e.interval);
      let o = e.mv?.vid || e.vid;
      o = typeof o === 'string' && o.length > 0;
      t.showMV = o;
    }
    return t;
  };
  onMV = (e) => {
    let t;
    const api = this.state.api;
    if (api === providers.netEase) {
      t = e.mv || e.mvid;
    } else if (api === providers.qqMusic) {
      t = e.mv?.vid || e.vid;
    }
    queue.playMV(t, api);
  };
  _renderItem = ({item, index}) => {
    const a_state = this.state;
    const {api, data} = a_state;
    const s = this.formatListItem(item);
    return (
      <components.SongRow
        textStyle={E.songRow}
        curIndex={null}
        index={index}
        song={s.song}
        album={s.duration}
        singer={s.singer}
        onPress={function () {
          return events.toPlayer({
            item,
            data,
            index,
            api,
          });
        }}
        addToQueue={function () {
          return events.toInsertToList({
            data: item,
            api,
          });
        }}
        detail={function () {
          return events.toDetailModal({
            item,
            index,
            api,
          });
        }}
        alias={s.alias}
        showMV={s.showMV}
        onMV={() => {
          return this.onMV(item);
        }}
        songItem={item}
      />
    );
  };
  state = {
    albumImg: '',
    api: providers.netEase,
    id: null,
    data: [],
    loaded: false,
    followed: null,
    title: '',
    publishTime: null,
    company: null,
    description: null,
    showModal: false,
    showElevation: true,
    duration: 0,
  };
  componentDidMount() {
    const params = this.props.route.params;
    if (params) {
      const {item, api} = params;
      if (api) {
        this.setState({
          api,
        });
        this.getAlbum(item, api);
      }
    }
  }
  componentWillUnmount() {
    this.setState({
      showElevation: false,
    });
  }
  render() {
    const e = this;
    const state = this.state;
    const {
      followed,
      data,
      albumImg,
      publishTime,
      company,
      title,
      loaded,
      showModal,
      description,
      duration,
    } = state;
    return (
      <ReactNative.View style={E.container}>
        <components.Background />
        {loaded === false && (
          <components.Spinkit
            style={{
              paddingTop: constants_DEVICE_WIDTH,
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          />
        )}
        <components.ParallaxScrollView
          onNativeContentOffsetExtract={this._nativeOffset}
          onRef={function (t) {
            return (e._list = t);
          }}
        >
          <components.ParallaxForeground
            img={albumImg}
            title={title}
            subtitle={[
              `${data.length} ${locales.SONG_COUNT} ｜ ${utils.timeFormatter.parseTime(duration)}`,
              `${publishTime}`,
            ]}
            animOffsetY={this._nativeOffset.y}
            onInfo={this.onDesc}
          />
          {data.map((item, index) =>
            React.cloneElement(
              e._renderItem({
                item,
                index,
              }),
              {
                key: item.id || index,
              },
            ),
          )}
          <components.EmptyFooter />
        </components.ParallaxScrollView>
        {!!showModal && (
          <Description
            showModal={showModal}
            albumImg={albumImg}
            onClose={function () {
              return e.setState({
                showModal: false,
              });
            }}
            company={company}
            publishTime={publishTime}
            description={description}
          />
        )}
        <ReactNative.View style={E.hoverArea}>
          <ReactNative.View style={E.hoverCon}>
            <ReactNative.TouchableOpacity onPress={this.onPlayAll}>
              {React.createElement(
                _default2,
                {
                  style: {
                    color: '#000',
                    padding: 10,
                    fontWeight: 'bold',
                  },
                },
                '播放全部',
              )}
            </ReactNative.TouchableOpacity>
            <ReactNative.View
              style={{
                width: 1,
                height: 18,
                backgroundColor: '#000',
              }}
            />
            <ReactNative.TouchableOpacity
              style={{
                padding: 5,
              }}
              onPress={this.addToPlaylist}
            >
              <components.Icon
                name={icons.PLUS}
                color={'#000'}
                style={{
                  fontWeight: 'bold',
                }}
              />
            </ReactNative.TouchableOpacity>
          </ReactNative.View>
        </ReactNative.View>
        <components.HeaderBar
          headerStyle={[E.header, utils.animInterpolate.forHeader(this._nativeOffset.y)]}
          title={title}
          goBack={this.goBack}
          onTop={this.onTop}
          rightIcon={function () {
            return (
              <OverflowMenu
                followed={followed}
                onLike={e.onLikeAlbum}
                onWebview={e.onWebview}
                onCopy={e.onCopy}
                onOpenUrl={e.onOpenUrl}
                onShare={e.onShare}
              />
            );
          }}
          backIcon={{
            name: icons.WINDOW_CLOSE,
          }}
          bold={true}
          blur={true}
        />
      </ReactNative.View>
    );
  }
}
var E = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    zIndex: 10,
    paddingRight: 20,
  },
  hoverArea: {
    position: 'absolute',
    bottom: 36,
    alignSelf: 'center',
  },
  hoverCon: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 100,
    elevation: 2,
  },
});
export default AlbumPage;
