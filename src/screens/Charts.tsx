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
import type {Playlist} from '../storage/models';
import type {ScreenProps} from '../navigation/types';
import {errorMessage} from '../utils/types';
class Charts extends React.PureComponent<
  ScreenProps<'Charts'>,
  {data: Playlist[]; loading: boolean}
> {
  _scrollView: reactNativeSpringScrollview.SpringScrollView | null = null;
  state: {data: Playlist[]; loading: boolean} = {
    data: [],
    loading: true,
  };
  onTop = () => {
    this._scrollView?.scrollToBegin();
  };
  getCharts = async () => {
    try {
      const response = await services.Netease.charts();
      if (response?.code !== 200 || !response.list) {
        throw new Error(response?.message || locales.ERROR);
      }
      const stored = await users.getCharts();
      this.setState({
        data: stored?.length === response.list.length ? stored : response.list,
      });
    } catch (error) {
      toast(errorMessage(error));
    } finally {
      this.setState({
        loading: false,
      });
    }
  };
  _renderItem = ({item, index}: {item: Playlist; index: number}) => {
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
  Playlist = (playlist: Playlist, t: number) => {
    this.collect(t);
    this.props.navigation.navigate('Playlist', {
      playlist,
      api: providers.netEase,
    });
  };
  collect = (e: number) => {
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
            this._scrollView = t;
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
