import SongRow from '../features/tracks/SongRow';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeLargelist from './../components/Scrolling';
import * as components from '../components/index';
import TabbedViewPager from '../native/TabbedViewPager';
import providers from '../services/providers';
import * as constants from '../theme/constants';
import locales from '../locales/index';
import * as services from '../services/index';
import * as events from '../events/index';
import * as trackInfo from '../services/trackInfo';
import type {ScreenProps, UserProfile} from '../navigation/types';
import type {TrackFields, TrackId} from '../services/track';
import type {PagerViewOnPageSelectedEvent} from 'react-native-pager-view';
const tabNames = [locales.WEEKLY, locales.ALL];
const l: Record<string, string> = {};
l[locales.WEEKLY] = '1';
l[locales.ALL] = '2';
const g = l;
const h = (e: {song: TrackFields; playCount: number}[]) =>
  e.map((e) => {
    e.song.playCount = e.playCount;
    return e.song;
  });
interface State {
  index: number;
  weekData: TrackFields[];
  allData: TrackFields[];
  profile: Partial<UserProfile>;
}
class ListenRecord extends React.PureComponent<ScreenProps<'ListenRecord'>, State> {
  _weekDataList: reactNativeLargelist.LargeList<TrackFields> | null = null;
  _allDataList: reactNativeLargelist.LargeList<TrackFields> | null = null;
  state: State = {
    index: 0,
    weekData: [],
    allData: [],
    profile: {},
  };
  init = () => {
    const params = this.props.route.params;
    if (params) {
      const profile = params.profile;
      if (profile) {
        this.setState({
          profile,
        });
        this.loadWeekData(profile.userId);
        this.loadAllData(profile.userId);
      }
    }
  };
  loadWeekData = async (id: TrackId) => {
    const response = await services.Netease.listen_record(id, 1);
    if (response?.code === 200 && response.weekData) {
      this.setState({
        weekData: h(response.weekData),
      });
    }
  };
  loadAllData = async (id: TrackId) => {
    const response = await services.Netease.listen_record(id, 0);
    if (response?.code === 200 && response.allData) {
      this.setState({
        allData: h(response.allData),
      });
    }
  };
  handlePageSelected = (e: PagerViewOnPageSelectedEvent) => {
    const position = e.nativeEvent.position;
    this.setState({
      index: position,
    });
  };
  onTop = () => {
    let e;
    let t;
    if (this.state.index === 0) {
      if (!((e = this._weekDataList) === null || e === undefined)) {
        e.scrollTo({
          x: 0,
          y: 0,
        });
      }
    } else if (!((t = this._allDataList) === null || t === undefined)) {
      t.scrollTo({
        x: 0,
        y: 0,
      });
    }
  };
  renderScenes = (e: string) => {
    const state = this.state;
    const {weekData, allData} = state;
    switch (e) {
      case '1':
        return (
          <reactNativeLargelist.LargeList
            data={[
              {
                items: weekData,
              },
            ]}
            heightForIndexPath={function () {
              return constants.ITEM_HEIGHT;
            }}
            renderIndexPath={({row}) => {
              return this.renderItem({
                item: weekData[row],
                index: row,
                dataKey: 'weekData',
              });
            }}
            ref={(e) => {
              this._weekDataList = e;
            }}
          />
        );
      case '2':
        return (
          <reactNativeLargelist.LargeList
            data={[
              {
                items: allData,
              },
            ]}
            heightForIndexPath={function () {
              return constants.ITEM_HEIGHT;
            }}
            renderIndexPath={({row}) => {
              return this.renderItem({
                item: allData[row],
                index: row,
                dataKey: 'allData',
              });
            }}
            ref={(e) => {
              this._allDataList = e;
            }}
          />
        );
    }
  };
  renderItem = ({
    item,
    index,
    dataKey,
  }: {
    item: TrackFields;
    index: number;
    dataKey: 'weekData' | 'allData';
  }) => {
    const l = trackInfo.extractFullInfo(item);
    const {song, singer, alias} = l;
    const album = item.playCount ? `${item.playCount} ${locales.TIMES}` : l.album;
    return (
      <SongRow
        index={index}
        song={song}
        singer={singer}
        alias={alias}
        album={album}
        onPress={() => {
          return this.playMusic({
            item,
            index,
            dataKey,
          });
        }}
        detail={function () {
          return events.toDetailModal({
            item,
            index,
            api: providers.netEase,
          });
        }}
        addToQueue={function () {
          return events.toInsertToList({
            data: item,
            api: providers.netEase,
          });
        }}
        songItem={item}
      />
    );
  };
  playMusic = ({
    item,
    index,
    dataKey,
  }: {
    item: TrackFields;
    index: number;
    dataKey: 'weekData' | 'allData';
  }) => {
    const l = this.state[dataKey];
    if (l.length > 0) {
      events.toPlayer({
        item,
        data: l,
        index,
        api: providers.netEase,
      });
    }
  };
  componentDidMount() {
    this.init();
  }
  render() {
    return (
      <ReactNative.View style={D.container}>
        <components.Background />
        <components.HeaderBar
          title={locales.LISTEN_RECORD}
          goBack={this.props.navigation.goBack}
          onTop={this.onTop}
        />
        <ReactNative.View style={D.content}>
          <TabbedViewPager tabNames={tabNames} onPageSelected={this.handlePageSelected}>
            {tabNames.map((t, key) => (
              <ReactNative.View
                key={key}
                style={{
                  flex: 1,
                  paddingBottom: 50,
                }}
              >
                {this.renderScenes(g[t])}
              </ReactNative.View>
            ))}
          </TabbedViewPager>
        </ReactNative.View>
      </ReactNative.View>
    );
  }
}
export default ListenRecord;
const D = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
