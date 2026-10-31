import SongRow from '../features/tracks/SongRow';
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
import type {ScreenProps, Navigation} from '../navigation/types';
import type {TrackFields} from '../services/track';
import type {Playlist} from '../storage/models';
import type {Provider} from '../services/providers';
import type {PagerViewOnPageSelectedEvent} from 'react-native-pager-view';
import {errorMessage} from '../utils/types';
const tabNames = [locales.ARTIST_SONGS, locales.MIX];
const l: Record<string, string> = {};
l[locales.ARTIST_SONGS] = '1';
l[locales.MIX] = '2';
const k = l;
interface State {
  api: Provider;
  data: TrackFields[];
  loaded: boolean;
  playlistData: Playlist[];
  tabIndex: number;
  dislikeMode: boolean;
}
class MusicRecommend extends React.Component<
  Pick<ScreenProps<'MusicRecommend'>, 'route'> & {navigation: Navigation},
  State
> {
  requestVersion = 0;
  _songScrollView: reactNativeSpringScrollview.SpringScrollView | null = null;
  _playlistScrollView: reactNativeSpringScrollview.SpringScrollView | null = null;
  backSubscription?: ReactNative.NativeEventSubscription;
  state: State = {
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
    const request = ++this.requestVersion;
    try {
      const response = await services.Netease.recommend_songs();
      if (request !== this.requestVersion) return;
      if (response?.code === 301) {
        toast(locales.NETEASE_NOT_LOGIN);
        this.props.navigation.navigate('NeteaseLogin');
        return;
      }
      if (response.code === 200 && response.recommend) {
        this.setState({
          data: response.recommend,
        });
        await this.getRePlaylist(request);
      } else throw new Error(response.message || locales.ERROR);
    } catch (error) {
      if (request === this.requestVersion) toast(errorMessage(error));
    } finally {
      if (request === this.requestVersion)
        this.setState({
          loaded: true,
        });
    }
  };
  getRePlaylist = async (request = this.requestVersion) => {
    const response = await services.Netease.recommend_playlists();
    if (request !== this.requestVersion) return;
    if (response?.code === 200 && response.recommend) {
      this.setState({
        playlistData: response.recommend,
      });
    } else throw new Error(response.message || locales.ERROR);
  };
  onTop = () => {
    (this.state.tabIndex === 0 ? this._songScrollView : this._playlistScrollView)?.scrollToBegin();
  };
  handlePageSelected = (e: PagerViewOnPageSelectedEvent) => {
    const position = e.nativeEvent.position;
    this.setState({
      tabIndex: position,
    });
  };
  _renderScenes = (e: string) => {
    const state = this.state;
    const {data, playlistData} = state;
    switch (e) {
      case '1':
        if (data?.length > 0) {
          return (
            <reactNativeSpringScrollview.SpringScrollView
              ref={(e) => {
                this._songScrollView = e;
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
        return this.state.loaded ? <ReactNative.View /> : <components.Spinkit />;
      case '2':
        if (playlistData?.length > 0) {
          return (
            <reactNativeSpringScrollview.SpringScrollView
              ref={(e) => {
                this._playlistScrollView = e;
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
        return this.state.loaded ? <ReactNative.View /> : <components.Spinkit />;
      default:
        return null;
    }
  };
  _renderItem = ({item, index}: {item: TrackFields; index: number}) => {
    const state = this.state;
    const {api, data, dislikeMode} = state;
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
      <SongRow
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
  _renderPlaylist = ({item}: {item: Playlist; index?: number}) => {
    return (
      <SongRow
        img={`${item.picUrl}?param=200y200`}
        song={item.name}
        singer={item.copywriter}
        onPress={() => {
          return this.onPlaylist(item);
        }}
      />
    );
  };
  onPlaylist = (playlist: Playlist) => {
    this.props.navigation.navigate('Playlist', {
      playlist,
      api: providers.netEase,
    });
  };
  onDisklikeSong = async (song: TrackFields, index: number) => {
    const request = this.requestVersion;
    try {
      if (song.id == null) throw new Error('歌曲缺少标识');
      const response = await services.Netease.recommend_dislike({
        id: song.id,
      });
      if (request !== this.requestVersion || this.state.data[index] !== song) return;
      if (response.code !== 200 || !response.data)
        throw new Error(response.message || locales.ERROR);
      const replacement = response.data;
      const data = immer.produce(this.state.data, (draft) => {
        draft[index] = replacement;
      });
      this.setState({
        data,
      });
    } catch (error) {
      if (request === this.requestVersion) toast(errorMessage(error));
    }
  };
  componentDidMount() {
    this.backSubscription = ReactNative.BackHandler.addEventListener(
      'hardwareBackPress',
      this.onBackPress,
    );
    this.getRe();
  }
  componentWillUnmount() {
    this.requestVersion++;
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
