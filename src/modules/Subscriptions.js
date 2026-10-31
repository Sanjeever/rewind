import {toast} from '../native/toast';
import Text from './../components/Text.js';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeLargelist from './../components/Scrolling.js';
import * as components from '../components/index';
import ParallaxList from '../components/ParallaxList';
import providers from '../services/providers';
import * as constants from '../theme/constants';
import names from '../events/names';
import locales from '../locales/index';
import * as services from '../services/index';
import '../utils/index';
class Subscriptions extends React.PureComponent {
  state = {
    data: [],
    offset: 0,
  };
  onTop = () => {
    let e;
    let t;
    if (this.props.index === 0) {
      if (!((e = this._artistList) === null || e === undefined)) {
        e.scrollTo({
          x: 0,
          y: 0,
        });
      }
    } else if (!((t = this._albumList) === null || t === undefined)) {
      t.scrollTo({
        x: 0,
        y: 0,
      });
    }
  };
  loadData = () => {
    switch (this.props.type) {
      case 'artist':
        this.loadArtist();
        break;
      case 'album':
        this.loadAlbum();
    }
  };
  renderSectionHeader = function ({section}) {
    if (section.data?.length > 0) {
      return (
        <ReactNative.View
          style={{
            padding: 10,
          }}
        >
          <Text style={[v.text, v.sectionHeader]}>{section.key}</Text>
        </ReactNative.View>
      );
    }
  };
  unLogined = () => {
    toast(locales.NETEASE_NOT_LOGIN);
    this.props.navigation.navigate('NeteaseLogin');
  };
  _renderIndexPath = ({row}) => {
    return this._renderItem({
      item: this.state.data[row],
      index: row,
    });
  };
  searchSong = (e) => {
    let t;
    const data = this.state.data;
    t = e ? this.filterList(e, data) : this.state.initData;
    this.setState({
      data: t,
    });
  };
  filterList = function (e, t) {
    const a = e.replace(/\?/gi, '\\?').replace(/\s/, '');
    const n = new RegExp(a, 'gi');
    return t.filter((e) => e.name.match(n)) || t;
  };
  loadArtist = async () => {
    const response = await services.Netease.sublist_artist({
      offset: 0,
    });
    if (response?.code === 200) {
      this.setState({
        data: response.data,
        initData: response.data,
      });
    } else if (response?.code === 301) {
      this.unLogined();
    } else {
      throw new Error(response?.message || locales.ERROR);
    }
  };
  loadAlbum = async () => {
    const response = await services.Netease.sublist_album({
      offset: 0,
    });
    if (response?.code === 200) {
      this.setState({
        data: response.data,
        initData: response.data,
      });
    }
  };
  getMore = () => {
    this.setState(
      {
        offset: this.state.offset + 1,
      },
      () => {
        const offset = this.state.offset;
        switch (this.props.type) {
          case 'artist':
            this.loadArtistMore(1000 * offset);
            break;
          case 'album':
            this.loadAlbumMore(30 * offset);
        }
      },
    );
  };
  loadArtistMore = async (offset) => {
    try {
      const response = await services.Netease.sublist_artist({
        offset,
      });
      if (response?.code === 200) {
        this.setState((previous) => ({
          data: [...previous.data, ...response.data],
        }));
        this._artistList?.endLoading?.(!response.data.length);
      }
    } catch (error) {
      this._artistList?.endLoading?.();
      toast(error.message);
    }
  };
  loadAlbumMore = async (offset) => {
    try {
      const response = await services.Netease.sublist_album({
        offset,
      });
      if (response?.code === 200) {
        this.setState((previous) => ({
          data: [...previous.data, ...response.data],
        }));
        this._albumList?.endLoading?.(!response.data.length);
      }
    } catch (error) {
      this._albumList?.endLoading?.();
      toast(error.message);
    }
  };
  formatData = (e) => {
    const type = this.props.type;
    const a = {};
    const r = e?.artists;
    switch (type) {
      case 'artist':
        a.title = e.name;
        a.subtitle = e.albumSize ? `${e.albumSize} ${locales.ALBUM_COUNT}` : null;
        a.img = e.img1v1Url
          ? `${e.img1v1Url}?param=200y200`
          : `http://y.gtimg.cn/music/photo_new/T001R150x150M000${e.mid}.jpg`;
        break;
      case 'album':
        a.title = e.name || e.albumname;
        a.subtitle = r
          ? `${e.artists[0].name}  |  ${e.size} ${locales.SONG_COUNT}`
          : `${e.singername}  |  ${e.songnum}`;
        a.img = e.picUrl ? `${e.picUrl}?param=200y200` : e.pic;
    }
    return a;
  };
  _renderItem = ({item}) => {
    const a = this.formatData(item);
    return (
      <components.ListItem
        title={a.title}
        subtitle={a.subtitle}
        img={a.img}
        onPress={() => {
          return this.onPress(item);
        }}
      />
    );
  };
  onPress = (e) => {
    const type = this.props.type;
    const providers_netEase = providers.netEase;
    switch (type) {
      case 'artist':
        this.props.onArtist(e, providers_netEase);
        break;
      case 'album':
        this.props.onAlbum(e, providers_netEase);
    }
  };
  componentDidUpdate(e) {
    if (this.props.searchText !== e.searchText) {
      this.searchSong(this.props.searchText);
    }
  }
  componentDidMount() {
    const e = this;
    this.sub = ReactNative.DeviceEventEmitter.addListener(names.UserLogined, function () {
      e.loadData();
    });
    this.loadData();
  }
  componentWillUnmount() {
    this.sub.remove?.();
  }
  render() {
    const e = this;
    const data = this.state.data;
    if (!data || data.length < 1) {
      return <components.Spinkit />;
    }
    if (data) {
      return (
        <reactNativeLargelist.LargeList
          ref={function (t) {
            return (e[`_${e.props.type}List`] = t);
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
      );
    }
    return null;
  }
}
export default Subscriptions;
var v = ReactNative.StyleSheet.create({
  sectionHeader: {
    borderRadius: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 14,
    padding: 5,
  },
});
