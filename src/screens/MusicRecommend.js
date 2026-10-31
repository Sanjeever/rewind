import {toast} from '../native/toast';
import * as immer from 'immer';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeSpringScrollview from './../components/Scrolling';
import * as components from '../components/index';
import TabbedViewPager from '../native/TabbedViewPager';
import providers from '../services/providers';
import icons from '../theme/icons';
import locales from '../locales/index';
import * as services from '../services/index';
import * as events from '../events/index';
import * as utils from '../utils/index';
import * as trackInfo from '../services/trackInfo';
let l;
const tabNames = [locales.ARTIST_SONGS, locales.MIX];
l = {};
l[locales.ARTIST_SONGS] = '1';
l[locales.MIX] = '2';
const k = l;
class MusicRecommend extends React.Component {
  state = {
    api: providers.netEase,
    data: [],
    loaded: false,
    playlistData: [],
    tabIndex: 0,
    dislikeMode: false,
  };
  onBackPress = () => {
    const dislikeMode = this.state.dislikeMode;
    return (
      !!dislikeMode &&
      (this.setState({
        dislikeMode: !dislikeMode,
      }),
      true)
    );
  };
  getRe = async () => {
    try {
      const response = await services.Netease.recommend_songs();
      if (response?.code === 301) {
        toast(locales.NETEASE_NOT_LOGIN);
        this.props.navigation.navigate('NeteaseLogin');
        return;
      }
      if (response?.recommend) {
        this.setState({
          data: response.recommend,
        });
        await this.getRePlaylist();
      }
    } catch (error) {
      toast(error.message);
    } finally {
      this.setState({
        loaded: true,
      });
    }
  };
  getRePlaylist = async () => {
    const response = await services.Netease.recommend_playlists();
    if (response?.code === 200) {
      this.setState({
        playlistData: response.recommend,
      });
    }
  };
  onTop = () => {
    let e;
    let t;
    let n;
    let r;
    if (this.state.tabIndex === 0) {
      if (!((e = (t = this._songScrollView).scrollToBegin) === null || e === undefined)) {
        e.call(t);
      }
    } else if (!((n = (r = this._playlistScrollView).scrollToBegin) === null || n === undefined)) {
      n.call(r);
    }
  };
  handlePageSelected = (e) => {
    const position = e.nativeEvent.position;
    this.setState({
      tabIndex: position,
    });
  };
  _renderScenes = (e) => {
    const a_state = this.state;
    const {data, playlistData} = a_state;
    switch (e) {
      case '1':
        if (data?.length > 0) {
          return (
            <reactNativeSpringScrollview.SpringScrollView
              ref={(e) => {
                return (this._songScrollView = e);
              }}
            >
              {data.map((e, t) =>
                this._renderItem({
                  item: e,
                  index: t,
                }),
              )}
              <components.EmptyFooter />
            </reactNativeSpringScrollview.SpringScrollView>
          );
        }
        return <components.Spinkit />;
      case '2':
        if (playlistData?.length > 0) {
          return (
            <reactNativeSpringScrollview.SpringScrollView
              ref={(e) => {
                return (this._playlistScrollView = e);
              }}
            >
              {playlistData.map((e, t) =>
                this._renderPlaylist({
                  item: e,
                  index: t,
                }),
              )}
              <components.EmptyFooter />
            </reactNativeSpringScrollview.SpringScrollView>
          );
        }
        return <components.Spinkit />;
      default:
        return null;
    }
  };
  _renderItem = ({item, index}) => {
    const a_state = this.state;
    const {api, data, dislikeMode} = a_state;
    const u = trackInfo.extractFullInfo(item);
    const onPress = dislikeMode
      ? () => {
          return this.onDisklikeSong(item, index);
        }
      : function () {
          return events.toPlayer({
            item,
            data,
            index,
            api,
          });
        };
    return (
      <components.SongRow
        img={`${u.img}?param=200y200`}
        song={u.song}
        album={u.album}
        singer={u.singer}
        onPress={onPress}
        detail={function () {
          return events.toDetailModal({
            item,
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
        songItem={item}
      />
    );
  };
  _renderPlaylist = ({item}) => {
    return (
      <components.SongRow
        img={`${item.picUrl}?param=200y200`}
        song={item.name}
        singer={item.copywriter}
        onPress={() => {
          return this.onPlaylist(item);
        }}
      />
    );
  };
  onPlaylist = (playlist) => {
    this.props.navigation.navigate('Playlist', {
      playlist,
      api: providers.netEase,
    });
  };
  onDisklikeSong = async (song, index) => {
    const response = await services.Netease.recommend_dislike({
      id: song.id,
    });
    const data = immer.produce(this.state.data, (draft) => {
      if (response.code === 200) {
        draft[index] = response.data;
      } else {
        toast(response.message);
        draft.splice(index, 1);
      }
    });
    this.setState({
      data,
    });
  };
  componentDidMount() {
    this.backSubscription = ReactNative.BackHandler.addEventListener(
      'hardwareBackPress',
      this.onBackPress,
    );
    this.getRe();
  }
  componentWillUnmount() {
    this.backSubscription?.remove();
  }
  render() {
    const dislikeMode = this.state.dislikeMode;
    return (
      <components.PageContainer
        title={utils.timeFormatter.localeString()}
        goBack={() => {
          return this.props.navigation.goBack();
        }}
        onTop={this.onTop}
        rightIcon={{
          name: dislikeMode ? icons.DELETE_OUTLINE : icons.DELETE,
          onPress: () => {
            return this.setState({
              dislikeMode: !dislikeMode,
            });
          },
        }}
        disabledTopFadingEdge={true}
      >
        <TabbedViewPager tabNames={tabNames} onPageSelected={this.handlePageSelected}>
          {tabNames.map((t, key) => (
            <ReactNative.View
              key={key}
              style={{
                flex: 1,
                paddingBottom: 50,
              }}
            >
              {this._renderScenes(k[t])}
            </ReactNative.View>
          ))}
        </TabbedViewPager>
      </components.PageContainer>
    );
  }
}
export default MusicRecommend;
