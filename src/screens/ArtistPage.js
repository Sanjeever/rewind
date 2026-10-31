import {toast} from '../native/toast';
import Clipboard from '@react-native-clipboard/clipboard';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as components from '../components/index';
import OverflowMenu from './../modules/OverflowMenu.js';
import providers from '../services/providers';
import * as constants from '../theme/constants';
import icons from '../theme/icons';
import locales from '../locales/index';
import * as services from '../services/index';
import * as utils from '../utils/index';
import * as types from '../utils/types';
import * as sharedUrlsModule from '../services/sharedUrls';
import users from '../storage/users';
import ArtistAlbums from './../modules/ArtistAlbums.js';
import ArtistVideos from './../modules/ArtistVideos.js';
import albumPagination from './../modules/albumPagination.js';
import artistAliases from './../modules/artistAliases.js';
import ArtistSongs from './../modules/ArtistSongs.js';
import styles from './artist/styles';
export const RELEASE_MODE = {
  all: 'all',
  albums: 'albums',
  singlesAndEps: 'singlesAndEps',
};
const x = {
  all: '作品',
  albums: '专辑',
  singlesAndEps: '单曲 & EPs',
};
class ArtistPage extends React.PureComponent {
  _nativeOffset = {
    x: new ReactNative.Animated.Value(0),
    y: new ReactNative.Animated.Value(0),
  };
  state = {
    artistName: '',
    artistImg: '',
    subtitle: '',
    index: 0,
    api: providers.netEase,
    id: null,
    hotSongs: [],
    albums: [],
    mvs: [],
    followed: null,
    releaseMode: RELEASE_MODE.all,
    albumsGroup: [],
    singlesAndEpsGroup: [],
  };
  getNeteaseArtistSongs = async (id) => {
    const response = await services.Netease.artist(id);
    if (!response?.artist) {
      return;
    }
    const artist = response.artist;
    this.setState({
      hotSongs: response.hotSongs,
      followed: artist.followed || false,
      subtitle: artistAliases(artist),
    });
    this.setImgUrl(artist.img1v1Url ? `${artist.img1v1Url}?param=500y500` : null);
  };
  getQQmusicArtistSongs = (e) => {
    services.QQMusic.artist_song(e)
      .then((e) => {
        if (e?.length > 0) {
          this.setState({
            hotSongs: e.map((e) => e.songInfo),
          });
        }
      })
      .catch(() => null);
  };
  getArtistInfo = (e, t) => {
    if (e) {
      switch (t) {
        case providers.netEase:
          this.setState({
            artistName: e.name,
            id: e.id,
          });
          this.getNeteaseArtistSongs(e.id);
          this.getAlbums(e.id, t);
          this.getMVs(e.id, t);
          break;
        case providers.qqMusic:
          const id = e.singerMID || e.mid;
          const r = `http://y.gtimg.cn/music/photo_new/T001R500x500M000${id}.jpg`;
          const artistName = e.singerName || e.name;
          this.setState({
            artistName,
            id,
          });
          this.setImgUrl(r);
          this.getQQmusicArtistSongs(id);
          this.getAlbums(id, t);
          this.getMVs(id, t);
      }
    }
  };
  getAlbums = async (id, api) => {
    const albums = await albumPagination.albums({
      id,
      api,
    });
    const albumsGroup = [];
    const singlesAndEpsGroup = [];
    for (const album of albums) {
      const full =
        api === providers.qqMusic ? album.albumtype.includes('专辑') : album.type === '专辑';
      (full ? albumsGroup : singlesAndEpsGroup).push(album);
    }
    this.setState({
      albums,
      albumsGroup,
      singlesAndEpsGroup,
    });
  };
  getMVs = async (id, api) => {
    this.setState({
      mvs: await albumPagination.mvs({
        id,
        api,
      }),
    });
  };
  setImgUrl = (artistImg) => {
    if (artistImg) {
      this.setState({
        artistImg,
      });
    }
  };
  onLikeArtistImpl = () => {
    const a_state = this.state;
    const {api, followed, id} = a_state;
    switch (api) {
      case providers.netEase:
        this.netEaseLikeArtist(id, !followed);
        break;
      case providers.qqMusic:
        this.qqMusicLikeArtist(id, !followed);
    }
    this.setState({
      followed: !followed,
    });
    toast(!followed == true ? '已收藏。' : '取消收藏。');
  };
  onLikeArtist = () => {
    const a_state = this.state;
    a_state.api;
    const e_followed = a_state.followed;
    a_state.id;
    if (e_followed) {
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
            this.onLikeArtistImpl();
          },
        },
      ]);
    } else {
      this.onLikeArtistImpl();
    }
  };
  qqMusicLikeArtist = async (mid, isLike) => {
    const account = (await users.getUserInfo())?.qqMusic;
    if (account) {
      await services.QQMusic.like_artist({
        mid,
        cookies: account.cookies,
        userId: account.userId,
        isLike,
      });
    }
  };
  netEaseLikeArtist = async (id, like) => {
    const response = await services.Netease.sublist_artist_add({
      id,
      op: like === true ? 'sub' : 'unsub',
    });
    if (utils.usable(response) && response.code !== 200) {
      toast(locales.ERROR);
    }
  };
  onTop = () => {
    this._list.scrollToBegin?.();
  };
  onReleaseTab = () => {
    let releaseMode_1;
    const a_state = this.state;
    const {index, releaseMode} = a_state;
    if (index !== 1) {
      this.setState({
        index: 1,
      });
    } else {
      if (releaseMode === RELEASE_MODE.albums) {
        releaseMode_1 = RELEASE_MODE.singlesAndEps;
      } else if (releaseMode === RELEASE_MODE.singlesAndEps) {
        releaseMode_1 = RELEASE_MODE.all;
      } else if (releaseMode === RELEASE_MODE.all) {
        releaseMode_1 = RELEASE_MODE.albums;
      }
      this.setState({
        releaseMode: releaseMode_1,
      });
    }
  };
  onCopy = () => {
    const artistName = this.state.artistName;
    Clipboard.setString(artistName);
    toast(`${locales.COPIED} ${artistName}`);
  };
  onWebview = () => {
    const url = this.getSharedLink();
    this.props.navigation.navigate('WebViewPage', {
      url,
    });
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
    return sharedUrlsModule.sharedUrls[api].artist + id;
  };
  getAlbumData = (e, t, n) => {
    const a_state = this.state;
    const {albumsGroup, singlesAndEpsGroup} = a_state;
    if (n === RELEASE_MODE.all) {
      return e;
    }
    if (n === RELEASE_MODE.albums) {
      return albumsGroup;
    }
    return singlesAndEpsGroup;
  };
  renderTabs = () => {
    const navigation = this.props.navigation;
    const a_state = this.state;
    const {index, hotSongs, albums, mvs, api, releaseMode} = a_state;
    switch (index) {
      case 0:
        if (hotSongs.length > 0) {
          return <ArtistSongs hotSongs={hotSongs} api={api} navigation={navigation} />;
        }
        return null;
      case 1:
        if (albums.length > 0) {
          return (
            <ArtistAlbums
              albums={this.getAlbumData(albums, api, releaseMode)}
              api={api}
              navigation={navigation}
              releaseMode={releaseMode}
            />
          );
        }
        return null;
      case 2:
        if (mvs.length > 0) {
          return <ArtistVideos api={api} mvs={mvs} navigation={navigation} />;
        }
        return null;
    }
  };
  goBack = () => {
    this.props.navigation.goBack();
  };
  componentDidMount() {
    const params = this.props.route.params;
    if (params) {
      const {item, api} = params;
      if (api) {
        this.getArtistInfo(item, api);
        this.setState({
          api,
          followed: item.is_follow === 1,
        });
      }
    }
  }
  render() {
    const e = this;
    const state = this.state;
    const {index, hotSongs, followed, artistImg, artistName, subtitle, albums, mvs, releaseMode} =
      state;
    return (
      <ReactNative.View style={styles.container}>
        <components.Background />
        <components.ParallaxScrollView
          onNativeContentOffsetExtract={this._nativeOffset}
          onRef={function (t) {
            return (e._list = t);
          }}
        >
          <components.ParallaxForeground
            img={artistImg}
            title={artistName}
            alias={subtitle}
            subtitle={[
              types.isArray(albums) && `${albums.length} ${locales.ALBUM_COUNT}`,
              types.isArray(mvs) && `${mvs.length} ${locales.MV_COUNT}`,
            ]}
            animOffsetY={this._nativeOffset.y}
          />
          <ReactNative.View
            style={{
              margin: 15,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}
          >
            <components.TextButton
              text={locales.ARTIST_SONGS}
              style={styles.btnCon}
              textStyle={index === 0 && styles.strong}
              onPress={function () {
                return e.setState({
                  index: 0,
                });
              }}
            />
            <ReactNative.View
              style={{
                alignItems: 'center',
              }}
            >
              <components.TextButton
                text={x[releaseMode]}
                style={styles.btnCon}
                textStyle={index === 1 && styles.strong}
                onPress={this.onReleaseTab}
              />
              <ReactNative.View style={styles.dotContainer}>
                {[RELEASE_MODE.all, RELEASE_MODE.albums, RELEASE_MODE.singlesAndEps].map(
                  (e, key) => (
                    <ReactNative.View
                      key={key}
                      style={[
                        styles.dot,
                        e !== releaseMode && {
                          opacity: 0.4,
                        },
                      ]}
                    />
                  ),
                )}
              </ReactNative.View>
            </ReactNative.View>
            <components.TextButton
              text={locales.ARTIST_MV}
              style={styles.btnCon}
              textStyle={index === 2 && styles.strong}
              onPress={function () {
                return e.setState({
                  index: 2,
                });
              }}
            />
          </ReactNative.View>
          {hotSongs?.length > 0 ? (
            this.renderTabs()
          ) : (
            <components.Spinkit
              style={[
                ReactNative.StyleSheet.absoluteFill,
                {
                  paddingTop: constants.DEVICE_WIDTH + 200,
                },
              ]}
            />
          )}
          <components.EmptyFooter />
        </components.ParallaxScrollView>
        <components.HeaderBar
          headerStyle={[styles.header, utils.animInterpolate.forHeader(this._nativeOffset.y)]}
          title={artistName}
          goBack={this.goBack}
          onTop={this.onTop}
          iconColor={'#eee'}
          fontColor={'#fff'}
          rightIcon={function () {
            return (
              <OverflowMenu
                followed={followed}
                onLike={e.onLikeArtist}
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
          blur={true}
          bold={true}
        />
      </ReactNative.View>
    );
  }
}
export default ArtistPage;
