import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeSpringScrollview from './../components/Scrolling';
import * as components from '../components/index';
import * as constants from '../theme/constants';
import icons from '../theme/icons';
import locales from '../locales/index';
import * as services from '../services/index';
import * as utils from '../utils/index';
import queue from '../player/videoActions';
import ArtistHeader from '../features/artists/ArtistHeader';
import type {NewWork} from '../features/artists/ArtistHeader';
import type {ScreenProps} from '../navigation/types';
import type {responses} from '../services/netease/responses';
import type * as z from 'zod/mini';
import {errorMessage} from '../utils/types';
type NewVideo = NonNullable<z.output<typeof responses.sub_new_mv>['data']>['newWorks'][number];
const h = (songData: {publishTime?: number}[]) => {
  const t = [0];
  songData.forEach((n, r) => {
    if (r !== 0) {
      const a = songData[r - 1];
      if (!utils.timeFormatter.isSameDay(n.publishTime, a.publishTime)) {
        t.push(r);
      }
    }
  });
  return t;
};
interface State {
  songData: NewWork[];
  mvData: NewVideo[];
  dateIds: number[];
  showingMV: boolean;
  songsLoaded: boolean;
  mvLoaded: boolean;
  songsError: string | null;
  mvError: string | null;
}
class SubNewSongs extends React.PureComponent<ScreenProps<'SubNewSongs'>, State> {
  scrollView: reactNativeSpringScrollview.SpringScrollView | null = null;
  songRequest = 0;
  mvRequest = 0;
  state: State = {
    songData: [],
    mvData: [],
    dateIds: [],
    showingMV: false,
    songsLoaded: false,
    mvLoaded: false,
    songsError: null,
    mvError: null,
  };
  loadSongs = async () => {
    const request = ++this.songRequest;
    this.setState({songsLoaded: false, songsError: null});
    try {
      const response = await services.Netease.sub_new_songs();
      if (request !== this.songRequest) return;
      if (response.code !== 200 || !response.data?.newWorks)
        throw new Error(response.message || response.msg || `关注新歌读取失败（${response.code}）`);
      const songData = response.data.newWorks;
      this.setState({
        songData,
        dateIds: h(songData),
      });
    } catch (error) {
      if (request === this.songRequest) this.setState({songsError: errorMessage(error)});
    } finally {
      if (request === this.songRequest) this.setState({songsLoaded: true});
    }
  };
  loadMV = async () => {
    const request = ++this.mvRequest;
    this.setState({mvLoaded: false, mvError: null});
    try {
      const response = await services.Netease.sub_new_mv();
      if (request !== this.mvRequest) return;
      if (response.code !== 200 || !response.data?.newWorks)
        throw new Error(response.message || response.msg || `音画读取失败（${response.code}）`);
      this.setState({
        mvData: response.data.newWorks,
      });
    } catch (error) {
      if (request === this.mvRequest) this.setState({mvError: errorMessage(error)});
    } finally {
      if (request === this.mvRequest) this.setState({mvLoaded: true});
    }
  };
  onTop = () => {
    this.scrollView?.scrollToBegin();
  };
  onShowingMV = () => {
    this.setState({
      showingMV: !this.state.showingMV,
    });
  };
  renderSection = function ({index, publishTime}: {index: number; publishTime?: number}) {
    return (
      <ReactNative.View
        style={[
          {
            marginBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
          },
          index !== 0 && {
            marginTop: 10,
          },
        ]}
      >
        <components.Title>{utils.timeFormatter.localeString(publishTime)}</components.Title>
        <ReactNative.View
          style={{
            marginLeft: 10,
            height: 2,
            flex: 1,
            backgroundColor: constants.COLORS.primary,
            borderRadius: 5,
            alignSelf: 'center',
          }}
        />
      </ReactNative.View>
    );
  };
  renderMV = () => {
    const state = this.state;
    const {mvData} = state;
    const dateIds = h(mvData);
    return mvData.map((e, t) => (
      <React.Fragment key={e.mvId ?? t}>
        {dateIds.indexOf(t) > -1 &&
          this.renderSection({
            index: t,
            publishTime: e.publishTime,
          })}
        <components.ListItem
          img={`${e.mvCoverUrl}?param=200y200`}
          title={e.mvName}
          subtitle={`${utils.timeFormatter.parseTime(e.duration! / 1000)}  |  ${e.artistName}`}
          onPress={function () {
            return queue.playMV(e.mvId!, 'netEase');
          }}
        />
      </React.Fragment>
    ));
  };
  renderSongs = () => {
    const state = this.state;
    const {songData, dateIds} = state;
    return songData.map((item, t) => (
      <React.Fragment key={item.blockTitle.resourceId ?? t}>
        {dateIds.indexOf(t) > -1 &&
          this.renderSection({
            index: t,
            publishTime: item.publishTime,
          })}
        <ArtistHeader
          item={item}
          onAlbum={() => {
            return this.onAlbum(item);
          }}
          onArtist={() => {
            return this.onArtist(item);
          }}
        />
      </React.Fragment>
    ));
  };
  onAlbum = ({songLists}: NewWork) => {
    this.props.navigation.navigate('AlbumPage', {
      item: songLists[0].al!,
      api: 'netEase',
    });
  };
  onArtist = ({songLists}: NewWork) => {
    const item = songLists[0].ar![0];
    if (!item.name) return;
    this.props.navigation.navigate('ArtistPage', {
      item: {...item, name: item.name},
      api: 'netEase',
    });
  };
  componentDidMount() {
    this.loadSongs();
    this.loadMV();
  }
  componentWillUnmount() {
    this.songRequest++;
    this.mvRequest++;
  }
  render() {
    const state = this.state;
    const {showingMV} = state;
    const loaded = showingMV ? state.mvLoaded : state.songsLoaded;
    const error = showingMV ? state.mvError : state.songsError;
    const items = showingMV ? state.mvData : state.songData;
    return (
      <components.PageContainer
        title={showingMV ? locales.ARTIST_MV : locales.SUB_NEW_SONGS}
        goBack={this.props.navigation.goBack}
        onTop={this.onTop}
        rightIcon={
          showingMV
            ? {
                name: icons.MUSIC_CIRCLE_OUTLINE,
                onPress: this.onShowingMV,
              }
            : {
                name: icons.VIDEO_OUTLINE,
                onPress: this.onShowingMV,
              }
        }
      >
        {!loaded ? (
          <components.Spinkit />
        ) : error ? (
          <ReactNative.View style={v.status}>
            <components.Text>{error}</components.Text>
            <components.TextButton
              text="重试"
              onPress={showingMV ? this.loadMV : this.loadSongs}
              style={{padding: 16}}
            />
          </ReactNative.View>
        ) : items.length > 0 ? (
          <reactNativeSpringScrollview.SpringScrollView
            style={v.container}
            ref={(t) => {
              this.scrollView = t;
            }}
          >
            {showingMV ? this.renderMV() : this.renderSongs()}
          </reactNativeSpringScrollview.SpringScrollView>
        ) : (
          <ReactNative.View style={v.status}>
            <components.Text>{showingMV ? '暂无音画' : '暂无新歌'}</components.Text>
          </ReactNative.View>
        )}
      </components.PageContainer>
    );
  }
}
const v = ReactNative.StyleSheet.create({
  status: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20},
  container: {
    padding: 20,
  },
});
export default SubNewSongs;
