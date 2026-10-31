import {toast} from '../native/toast';
import * as React from 'react';
import * as reactNativeSpringScrollview from './../components/Scrolling';
import * as components from '../components/index';
import providers from '../services/providers';
import locales from '../locales/index';
import * as services from '../services/index';
import '../utils/index';
import playlists from '../storage/playlists';
import users from '../storage/users';
class Charts extends React.PureComponent {
  state = {
    data: [],
    loading: true,
  };
  onTop = () => {
    this._scrollView.scrollToBegin?.();
  };
  getCharts = async () => {
    try {
      const response = await services.Netease.charts();
      if (response?.code !== 200) {
        throw new Error(response?.message || locales.ERROR);
      }
      const stored = await users.getCharts();
      this.setState({
        data: stored?.length === response.list.length ? stored : response.list,
      });
    } catch (error) {
      toast(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };
  _renderItem = ({item, index}) => {
    return (
      <components.ListItem
        key={index}
        img={`${item.coverImgUrl}?param=200y200`}
        title={item.name}
        subtitle={`${item.trackCount} ${locales.SONG_COUNT}`}
        onPress={() => {
          return this.Playlist(item, index);
        }}
      />
    );
  };
  Playlist = (playlist, t) => {
    this.collect(t);
    this.props.navigation.navigate('Playlist', {
      playlist,
      api: providers.netEase,
    });
  };
  collect = (e) => {
    const data = this.state.data;
    playlists.collectCharts({
      list: data,
      index: e,
    });
    this.getCharts();
  };
  componentDidMount() {
    this.getCharts();
  }
  render() {
    const state = this.state;
    const {loading, data} = state;
    return (
      <components.PageContainer
        goBack={() => {
          return this.props.navigation.goBack();
        }}
        onTop={this.onTop}
        title={locales.CHARTS}
      >
        {loading && (
          <components.Spinkit
            style={{
              position: 'absolute',
              top: 100,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          />
        )}
        <reactNativeSpringScrollview.SpringScrollView
          ref={(t) => {
            return (this._scrollView = t);
          }}
        >
          {data.map((item, r) =>
            this._renderItem({
              item,
              index: r,
            }),
          )}
        </reactNativeSpringScrollview.SpringScrollView>
      </components.PageContainer>
    );
  }
}
export default Charts;
