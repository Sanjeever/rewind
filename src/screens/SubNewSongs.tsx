import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeSpringScrollview from './../components/Scrolling';
import * as components from '../components/index';
import * as constants from '../theme/constants';
import icons from '../theme/icons';
import locales from '../locales/index';
import * as services from '../services/index';
import * as utils from '../utils/index';
import queue from '../events/queue';
import ArtistHeader from './../modules/ArtistHeader';
import type {NewWork} from '../modules/ArtistHeader';
import type {ScreenProps} from '../navigation/types';
import type {responses} from '../services/netease/responses';
import type * as z from 'zod/mini';
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
}
class SubNewSongs extends React.PureComponent<ScreenProps<'SubNewSongs'>, State> {
  scrollView: reactNativeSpringScrollview.SpringScrollView | null = null;
  state: State = {
    songData: [],
    mvData: [],
    dateIds: [],
    showingMV: false,
  };
  loadSongs = async () => {
    const response = await services.Netease.sub_new_songs();
    if (Array.isArray(response?.data?.newWorks)) {
      const songData = response.data.newWorks;
      this.setState({
        songData,
        dateIds: h(songData),
      });
    }
  };
  loadMV = async () => {
    const response = await services.Netease.sub_new_mv();
    if (Array.isArray(response?.data?.newWorks)) {
      this.setState({
        mvData: response.data.newWorks,
      });
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
    const {mvData, dateIds} = state;
    return mvData.map((e, t) => (
      <React.Fragment>
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
      <React.Fragment>
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
    this.props.navigation.navigate('ArtistPage', {
      item: songLists[0].ar![0],
      api: 'netEase',
    });
  };
  componentDidMount() {
    this.loadSongs();
    this.loadMV();
  }
  render() {
    const state = this.state;
    const {songData, showingMV} = state;
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
        {songData?.length > 0 ? (
          <reactNativeSpringScrollview.SpringScrollView
            style={v.container}
            ref={(t) => {
              this.scrollView = t;
            }}
          >
            {showingMV ? this.renderMV() : this.renderSongs()}
          </reactNativeSpringScrollview.SpringScrollView>
        ) : (
          <components.Spinkit />
        )}
      </components.PageContainer>
    );
  }
}
const v = ReactNative.StyleSheet.create({
  container: {
    padding: 20,
  },
});
export default SubNewSongs;
