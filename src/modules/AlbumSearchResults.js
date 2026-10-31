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
class AlbumSearchResults extends React.PureComponent {
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
      case providers.qqMusic:
        services.QQMusic.search({
          keywords,
          type: 'album',
          page: offset / 30 + 1,
        }).then((e) => {
          const list = e.album.list;
          if (list?.length > 0) {
            const a = this.formatAllData(list);
            this.setState({
              data: [...this.state.data, ...a],
            });
          }
          this.endLoading();
        });
        break;
      case providers.netEase:
        services.Netease.search({
          keywords,
          type: 10,
          offset,
        }).then((e) => {
          const albums = e.result.albums;
          if (albums?.length > 0) {
            const a = this.formatAllData(albums);
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
  endLoading = () => {
    this._list.endLoading?.();
  };
  albumPage = (item) => {
    const api = this.props.api;
    this.props.navigation.navigate('AlbumPage', {
      item,
      api,
    });
  };
  formatAllData = (e) => {
    const api = this.props.api;
    const a = [];
    for (const item of e) {
      const i = trackDescription({
        item,
        api,
        page: searchTypes.albums,
      });
      i.initItem = item;
      a.push(i);
    }
    return a;
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
          return this.albumPage(a.initItem);
        }}
      />
    );
  };
  UNSAFE_componentWillReceiveProps({index, search}) {
    if (index === searchTypes.albums && this.state.preSearch !== search) {
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
      <ReactNative.View style={v.container}>
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
var v = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default AlbumSearchResults;
