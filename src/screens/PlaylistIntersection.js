import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeLargelist from './../components/Scrolling.js';
import * as components from '../components/index';
import * as constants from '../theme/constants';
import locales from '../locales/index';
import * as services from '../services/index';
import * as events from '../events/index';
import * as trackInfo from '../services/trackInfo';
import IntersectionHeader from './../modules/IntersectionHeader.js';
import PlaylistComparison from './../modules/PlaylistComparison.js';
const b = {
  intersection: 'intersection',
  difference: 'difference',
};
class PlaylistIntersection extends React.PureComponent {
  state = {
    item: null,
    left: null,
    right: null,
    selectorShow: false,
    data: [],
    intersectionData: [],
    differenceData: [],
    type: b.intersection,
  };
  init = async (item) => {
    const response = await services.Netease.playlist_detail(item.id);
    if (!response?.playlist) {
      throw new Error(response?.message || locales.ERROR);
    }
    this.setState({
      left: {
        ...item,
        playlist: response.playlist,
      },
      selectorShow: true,
    });
  };
  onTop = () => {
    this._list?.scrollToIndexPath({
      row: 0,
    });
  };
  _renderIndexPath = ({row}) => {
    const data = this.state.data;
    const a = data[row];
    const index = row;
    const o = trackInfo.extractFullInfo(a);
    return (
      <components.SongRow
        song={o.song}
        singer={o.singer}
        album={o.album}
        index={index}
        alias={o.alias}
        onPress={function () {
          return events.toPlayer({
            item: a,
            data,
            index,
          });
        }}
        detail={function () {
          return events.toDetailModal({
            item: a,
            index,
          });
        }}
        addToQueue={function () {
          return events.toInsertToList({
            data: a,
          });
        }}
      />
    );
  };
  toggleType = () => {
    let e;
    let t;
    const r_state = this.state;
    const {type, intersectionData, differenceData} = r_state;
    if (type === b.intersection) {
      e = b.difference;
      t = differenceData;
    } else {
      e = b.intersection;
      t = intersectionData;
    }
    this.setState({
      type: e,
      data: t,
    });
  };
  onSelect = (right) => {
    this.setState(
      {
        right,
        selectorShow: false,
      },
      () => {
        this.fetchRightPlaylist();
      },
    );
  };
  fetchRightPlaylist = async () => {
    const response = await services.Netease.playlist_detail(this.state.right.id, true);
    if (response?.playlist) {
      this.intersection(response);
    }
  };
  intersection = (e) => {
    const left = this.state.left;
    if (left && e) {
      const n = left.playlist.tracks;
      const a = e.playlist.tracks;
      const i = [];
      n.forEach((e) =>
        a.forEach((t) => {
          if (e.id === t.id) {
            i.push(e);
          }
        }),
      );
      if (i.length !== 0) {
        this.setState({
          data: i,
          intersectionData: i,
          type: b.intersection,
        });
        this.difference(n, a, i);
      } else {
        const l = [...n, ...a];
        this.setState({
          data: l,
          type: b.difference,
          differenceData: l,
        });
      }
    }
  };
  difference = (e, t, n) => {
    const differenceData = [];
    const i = {};
    n.forEach((e) => {
      i[e.id] = true;
    });
    e.forEach((e) => {
      if (!i[e.id]) {
        differenceData.push(e);
      }
    });
    t.forEach((e) => {
      if (!i[e.id]) {
        differenceData.push(e);
      }
    });
    this.setState({
      differenceData,
    });
  };
  componentDidMount() {
    const params = this.props.route.params;
    if (params) {
      const t = params.item;
      this.init(t);
    }
  }
  render() {
    const state = this.state;
    const {left, right, selectorShow, data, type} = state;
    const title = type === b.intersection ? locales.INTERSECTION : locales.DIFFERENCE;
    return (
      <React.Fragment>
        <components.PageContainer
          title={title}
          goBack={this.props.navigation.goBack}
          onTop={this.onTop}
        >
          <reactNativeLargelist.LargeList
            ref={(t) => {
              return (this._list = t);
            }}
            data={[
              {
                items: data,
              },
            ]}
            heightForIndexPath={function () {
              return constants.ITEM_HEIGHT;
            }}
            renderIndexPath={this._renderIndexPath}
            renderHeader={() => {
              return (
                <ReactNative.View
                  style={{
                    paddingTop: 20,
                  }}
                >
                  <IntersectionHeader
                    left={left}
                    right={right}
                    onChangePlaylist={() => {
                      return this.setState({
                        selectorShow: true,
                      });
                    }}
                    iLength={data ? data.length : 0}
                    type={type}
                    toggleType={this.toggleType}
                  />
                </ReactNative.View>
              );
            }}
          />
        </components.PageContainer>
        <PlaylistComparison
          visible={selectorShow}
          onSelect={this.onSelect}
          onRequestClose={() => {
            return this.setState({
              selectorShow: false,
            });
          }}
        />
      </React.Fragment>
    );
  }
}
export default PlaylistIntersection;
