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
class PlaylistSearchResults extends React.PureComponent {
  state = {
    data: [],
    preSearch: '',
  };
  fetchData = (preSearch) => {
    const api = this.props.api;
    if (preSearch) {
      this.setState(
        {
          data: [],
          preSearch,
        },
        () => {
          this.fetchAPI(api, preSearch);
        },
      );
    }
  };
  fetchAPI = (e, keywords, offset = 0) => {
    switch (e) {
      case providers.netEase:
        services.Netease.search({
          keywords,
          type: 1000,
          offset,
        }).then((e) => {
          const playlists = e.result.playlists;
          if (playlists?.length > 0) {
            const a = this.formatAllData(playlists);
            this.setState({
              data: [...this.state.data, ...a],
            });
          }
          this.endLoading();
        });
        break;
      case providers.qqMusic:
        services.QQMusic.search_playlist({
          keywords,
          page: offset / 30,
        }).then(({list}) => {
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
  endLoading = () => {
    this._list.endLoading?.();
  };
  header = function () {
    return <ReactNative.View style={v.header} />;
  };
  albumPage = (item, api) => {
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
        page: searchTypes.playlists,
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
        title={a.title}
        subtitle={a.subtitle}
        img={a.img}
        onPress={() => {
          return this.Playlist(a.initItem);
        }}
      />
    );
  };
  Playlist = (playlist) => {
    switch (this.props.api) {
      case providers.netEase:
        this.props.navigation.navigate('Playlist', {
          playlist,
          api: providers.netEase,
        });
        break;
      case providers.qqMusic:
        this.props.navigation.navigate('Playlist', {
          playlist,
          api: providers.qqMusic,
        });
    }
  };
  componentDidMount() {
    const onRef = this.props.onRef;
    if (onRef) {
      onRef(this);
    }
  }
  UNSAFE_componentWillReceiveProps({index, search}) {
    if (index === searchTypes.playlists && this.state.preSearch !== search) {
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
  header: {
    height: 10,
    width: '100%',
  },
});
export default PlaylistSearchResults;
