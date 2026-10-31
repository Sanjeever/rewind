import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeLargelist from './../components/Scrolling.js';
import * as components from '../components/index';
import ParallaxList from '../components/ParallaxList';
import providers from '../services/providers';
import * as constants from '../theme/constants';
import * as services from '../services/index';
import trackDescription from '../services/trackDescription';
import searchTypes from '../services/searchTypes';
class ArtistSearchResults extends React.PureComponent {
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
  fetchAPI = (e, keywords, offset = 0) => {
    switch (e) {
      case providers.netEase:
        services.Netease.search({
          keywords,
          type: 100,
          offset,
        }).then((e) => {
          const artists = e.result.artists;
          if (artists?.length > 0) {
            const a = this.formatAllData(artists);
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
          type: 'singer',
          page: offset / 30 + 1,
        }).then((e) => {
          const list = e.singer.list;
          if (list?.length > 0) {
            const a = this.formatAllData(list);
            if (list) {
              this.setState({
                data: [...this.state.data, ...a],
              });
            }
          }
          this.endLoading();
        });
    }
  };
  formatAllData = (e) => {
    const api = this.props.api;
    const a = [];
    for (const item of e) {
      const i = trackDescription({
        item,
        api,
        page: searchTypes.singers,
      });
      i.initItem = item;
      a.push(i);
    }
    return a;
  };
  getMore = () => {
    const r_props = this.props;
    const {search, api} = r_props;
    const length = this.state.data.length;
    this.fetchAPI(api, search, length);
  };
  endLoading = () => {
    this._list.endLoading?.();
  };
  goToArtistPage = (e) => {
    const api = this.props.api;
    this.props.navigation.navigate('ArtistPage', {
      item: e.initItem,
      api,
    });
  };
  _renderIndexPath = ({row}) => {
    const a = this.state.data[row];
    return (
      <components.ListItem
        img={a.img}
        title={a.title}
        subtitle={a.subtitle}
        trans={a.trans}
        onPress={() => {
          return this.goToArtistPage(a);
        }}
      />
    );
  };
  UNSAFE_componentWillReceiveProps({index, search}) {
    if (index === searchTypes.singers && this.state.preSearch !== search) {
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
      <ReactNative.View style={g.container}>
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
var g = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default ArtistSearchResults;
