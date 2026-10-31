import {toast} from '../native/toast';
import * as React from 'react';
import * as reactNativeSpringScrollview from './../components/Scrolling.js';
import * as components from '../components/index';
import providers from '../services/providers';
import names from '../events/names';
import locales from '../locales/index';
import * as services from '../services/index';
import * as events from '../events/index';
import '../utils/types';
import * as trackInfo from '../services/trackInfo';
class Cloud extends React.Component {
  state = {
    data: [],
  };
  getList = async () => {
    try {
      const response = await services.Netease.cloud();
      if (response?.code === 301) {
        toast(locales.NETEASE_NOT_LOGIN);
        this.props.navigation.navigate('NeteaseLogin');
        return;
      }
      if (!Array.isArray(response?.data)) {
        throw new Error(response?.message || locales.ERROR);
      }
      this.setState({
        data: response.data.map((song) => ({
          name: song.songName,
          id: song.songId,
          title: song.songName,
          singer: song.artist,
          duration: song.simpleSong.dt,
          ar: [
            {
              id: -1,
              name: song.artist,
            },
          ],
          al: [
            {
              id: -1,
              name: song.album,
            },
          ],
        })),
      });
    } catch (error) {
      toast(error.message);
    }
  };
  onTop = () => {
    this._scrollView.scrollToBegin?.();
  };
  _renderItem = ({item, index}) => {
    const a = trackInfo.extractFullInfo(item);
    return (
      <components.SongRow
        key={index}
        index={index}
        song={a.song}
        album={a.album}
        singer={a.singer}
        onPress={() => {
          return this.playMusic(item, index);
        }}
        addToQueue={() => {
          return this.addToQueue(item);
        }}
      />
    );
  };
  addToQueue = (data) => {
    const api = this.state.api;
    events.emitter.emit(names.InsertToList, {
      data,
      type: 'item',
      api,
    });
  };
  playMusic = (e, t) => {
    const data = this.state.data;
    events.toPlayer({
      item: e,
      data,
      index: t,
      api: providers.netEase,
    });
  };
  componentDidMount() {
    this.getList();
  }
  render() {
    const e = this;
    const data = this.state.data;
    return (
      <components.PageContainer
        goBack={function () {
          return e.props.navigation.goBack();
        }}
        onTop={this.onTop}
        title={locales.CLOUD_DRIVE}
      >
        <reactNativeSpringScrollview.SpringScrollView
          ref={function (t) {
            return (e._scrollView = t);
          }}
        >
          {data.map((t, n) =>
            e._renderItem({
              item: t,
              index: n,
            }),
          )}
        </reactNativeSpringScrollview.SpringScrollView>
      </components.PageContainer>
    );
  }
}
export default Cloud;
