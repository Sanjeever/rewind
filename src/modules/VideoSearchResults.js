import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeLargelist from './../components/Scrolling.js';
import * as components from '../components/index';
import ParallaxList from '../components/ParallaxList';
import providers from '../services/providers';
import * as constants from '../theme/constants';
import * as services from '../services/index';
import queue from '../events/queue';
import trackDescription from '../services/trackDescription';
import searchTypes from '../services/searchTypes';
class VideoSearchResults extends React.PureComponent {
  state = {
    data: [],
    loaded: false,
    preSearch: '',
  };
  fetchData = (preSearch) => {
    const api = this.props.api;
    if (preSearch) {
      this.setState({
        data: [],
        loaded: true,
        preSearch,
      });
      this.fetchAPI(api, preSearch);
    }
  };
  fetchAPI = (e, keywords, offset) => {
    switch (e) {
      case providers.netEase:
        services.Netease.search({
          keywords,
          type: 1004,
          offset,
        }).then((e) => {
          const mvs = e.result.mvs;
          if (mvs?.length > 0) {
            const a = this.formatAllData(mvs);
            this.setState({
              data: [...this.state.data, ...a],
            });
          }
          this.endLoading();
        });
        break;
      case providers.qqMusic:
        services.QQMusic.search({
          keywords,
          type: 'mv',
          page: offset / 30 + 1,
        }).then((e) => {
          const list = e.mv.list;
          if (list?.length > 0) {
            const a = this.formatAllData(list);
            this.setState({
              data: [...this.state.data, ...a],
            });
          }
          this.endLoading();
        });
    }
  };
  getMore = () => {
    const r_props = this.props;
    const {api, search} = r_props;
    const length = this.state.data.length;
    this.fetchAPI(api, search, length);
  };
  formatAllData = (e) => {
    const api = this.props.api;
    const a = [];
    for (const item of e) {
      const i = trackDescription({
        item,
        api,
        page: searchTypes.mvs,
      });
      i.initItem = item;
      a.push(i);
    }
    return a;
  };
  endLoading = () => {
    this._list.endLoading?.();
  };
  _renderIndexPath = ({row}) => {
    const a = this.state.data[row];
    return (
      <components.ListItem
        title={a.title}
        subtitle={a.subtitle}
        img={a.img}
        onPress={() => {
          return this.playMV(a.initItem);
        }}
      />
    );
  };
  playMV = (e) => {
    const api = this.props.api;
    const a = api === providers.netEase ? e.id : e.v_id;
    queue.playMV(a, api);
  };
  UNSAFE_componentWillReceiveProps({index, search}) {
    if (index === searchTypes.mvs && this.state.preSearch !== search) {
      this.fetchData(search);
    }
  }
  render() {
    const e = this;
    const data = this.state.data;
    if (data.length < 1) {
      return <components.Spinkit />;
    }
    return (
      <ReactNative.View style={m.container}>
        <reactNativeLargelist.LargeList
          ref={function (t) {
            return (e._list = t);
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
          onLoading={this.getMore}
          loadingFooter={ParallaxList}
        />
      </ReactNative.View>
    );
  }
}
var m = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default VideoSearchResults;
