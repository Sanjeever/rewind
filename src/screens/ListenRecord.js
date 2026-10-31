import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeLargelist from './../components/Scrolling.js';
import * as components from '../components/index';
import TabbedViewPager from '../native/TabbedViewPager';
import providers from '../services/providers';
import * as constants from '../theme/constants';
import locales from '../locales/index';
import * as services from '../services/index';
import * as events from '../events/index';
import * as trackInfo from '../services/trackInfo';
let l;
const tabNames = [locales.WEEKLY, locales.ALL];
l = {};
l[locales.WEEKLY] = '1';
l[locales.ALL] = '2';
const g = l;
const h = (e) =>
  e.map((e) => {
    e.song.playCount = e.playCount;
    return e.song;
  });
class ListenRecord extends React.PureComponent {
  state = {
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
  loadWeekData = async (id) => {
    const response = await services.Netease.listen_record(id, 1);
    if (response?.code === 200) {
      this.setState({
        weekData: h(response.weekData),
      });
    }
  };
  loadAllData = async (id) => {
    const response = await services.Netease.listen_record(id, 0);
    if (response?.code === 200) {
      this.setState({
        allData: h(response.allData),
      });
    }
  };
  handlePageSelected = (e) => {
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
  renderScenes = (e) => {
    const n_state = this.state;
    const {weekData, allData} = n_state;
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
              return (this._weekDataList = e);
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
              return (this._allDataList = e);
            }}
          />
        );
    }
  };
  renderItem = ({item, index, dataKey}) => {
    const l = trackInfo.extractFullInfo(item);
    const {song, singer, alias} = l;
    const album = item.playCount ? `${item.playCount} ${locales.TIMES}` : l.album;
    return (
      <components.SongRow
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
  playMusic = ({item, index, dataKey}) => {
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
    const e = this;
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
                {e.renderScenes(g[t])}
              </ReactNative.View>
            ))}
          </TabbedViewPager>
        </ReactNative.View>
      </ReactNative.View>
    );
  }
}
export default ListenRecord;
var D = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
