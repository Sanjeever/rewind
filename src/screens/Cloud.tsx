import SongRow from '../features/tracks/SongRow';
import {toast} from '../native/toast';
import * as React from 'react';
import * as reactNativeSpringScrollview from './../components/Scrolling';
import * as components from '../components/index';
import providers from '../services/providers';
import names from '../events/names';
import locales from '../locales/index';
import * as services from '../services/index';
import * as events from '../events/index';
import '../utils/types';
import * as trackInfo from '../services/trackInfo';
import type {ScreenProps} from '../navigation/types';
import type {TrackFields} from '../services/track';
import {errorMessage} from '../utils/types';
class Cloud extends React.Component<ScreenProps<'Cloud'>, {data: TrackFields[]}> {
  _scrollView: reactNativeSpringScrollview.SpringScrollView | null = null;
  state: {data: TrackFields[]} = {
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
      toast(errorMessage(error));
    }
  };
  onTop = () => {
    this._scrollView?.scrollToBegin();
  };
  _renderItem = ({item, index}: {item: TrackFields; index: number}) => {
    const a = trackInfo.extractFullInfo(item);
    return (
      <SongRow
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
  addToQueue = (data: TrackFields) => {
    const api = providers.netEase;
    events.emitter.emit(names.InsertToList, {
      data,
      type: 'item',
      api,
    });
  };
  playMusic = (e: TrackFields, t: number) => {
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
    const data = this.state.data;
    return (
      <components.PageContainer
        goBack={() => {
          return this.props.navigation.goBack();
        }}
        onTop={this.onTop}
        title={locales.CLOUD_DRIVE}
      >
        <reactNativeSpringScrollview.SpringScrollView
          ref={(t) => {
            this._scrollView = t;
          }}
        >
          {data.map((t, n) =>
            this._renderItem({
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
