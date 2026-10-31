import {toast} from '../native/toast';
import * as React from 'react';
import * as components from '../components/index';
import providers from '../services/providers';
import names from '../events/names';
import icons from '../theme/icons';
import locales from '../locales/index';
import * as events from '../events/index';
import * as utils from '../utils/index';
import mediaStore from '../native/mediaStore';
import LocalMusicList from './../modules/LocalMusicList';
import type {ScreenProps} from '../navigation/types';
import type {MediaTrack} from '../native/mediaStore';
import type {Subscription} from '../events/Emitter';
const h = {
  time: 'random',
  random: 'song',
  song: 'artist',
  artist: 'album',
  album: 'time',
} as const;
class LocalMusic extends React.Component<
  ScreenProps<'LocalMusic'>,
  {playList: MediaTrack[] | null; oriList: MediaTrack[]; sortMode: keyof typeof h}
> {
  listParent: LocalMusicList | null = null;
  deleteReciver!: Subscription;
  state: {playList: MediaTrack[] | null; oriList: MediaTrack[]; sortMode: keyof typeof h} = {
    playList: null,
    oriList: [],
    sortMode: 'time',
  };
  loadPlayList = () => {
    mediaStore.getPlayList().then((e) => {
      if (e) {
        const t = e.data.filter((e) => e.duration / 1000 > 30 && !e.path.includes('record'));
        t.reverse();
        this.setState({
          oriList: t,
          playList: t,
        });
      }
    });
  };
  goBack = () => {
    return this.props.navigation.goBack();
  };
  onSort = () => {
    let e;
    const state = this.state;
    const {sortMode, oriList} = state;
    const sortMode_1 = h[sortMode];
    switch (sortMode_1) {
      case 'time':
        e = locales.DEFAULT_ORDER;
        this.setState({
          playList: oriList,
        });
        break;
      case 'song':
        e = locales.SONG_ORDER;
        this.searchSong(':1');
        break;
      case 'artist':
        e = locales.ARTIST_ORDER;
        this.searchSong(':2');
        break;
      case 'album':
        e = locales.ALBUM_ORDER;
        this.searchSong(':3');
        break;
      case 'random':
        e = locales.RANDOM_ORDER;
        this.searchSong(':4');
    }
    toast(e);
    this.setState({
      sortMode: sortMode_1,
    });
  };
  searchSong = (e: string) => {
    const oriList = this.state.oriList;
    if (oriList) {
      const a = utils.filterHelper.search(oriList, e);
      this.setState({
        playList: a,
      });
    }
  };
  onTop = () => {
    this.listParent?.onTop();
  };
  componentDidMount() {
    this.deleteReciver = events.emitter.addListener(names.DeleteFromLocal, ({deleteIndex}) => {
      const playList = this.state.playList;
      if (playList) {
        const n = playList.filter((e, t) => deleteIndex !== t);
        this.setState({
          playList: n,
        });
      }
    });
    this.loadPlayList();
  }
  componentWillUnmount() {
    this.deleteReciver.remove();
  }
  render() {
    return (
      <components.PageContainer
        title={locales.LOCAL_MUSIC}
        goBack={this.goBack}
        onTop={this.onTop}
        onChangeText={(t) => {
          return this.searchSong(t);
        }}
        rightIcon={[
          {
            name: icons.SORT_VARIANT,
            onPress: this.onSort,
          },
          {
            name: icons.MAGNIFY,
          },
        ]}
      >
        <LocalMusicList
          data={this.state.playList ?? undefined}
          playMusic={(t, a) => {
            return this.playMusic(t, a);
          }}
          onDetail={function (item, t) {
            return events.toDetailModal({
              item,
              index: t,
              api: providers.local,
            });
          }}
          addToQueue={function (e) {
            return events.toInsertToList({
              data: e,
              api: providers.local,
            });
          }}
          ref={(instance) => {
            this.listParent = instance;
          }}
        />
      </components.PageContainer>
    );
  }
  playMusic(item: MediaTrack, _index?: number) {
    const playList = this.state.playList;
    if (!playList) return;
    const a = playList;
    const r = playList.findIndex((t) => t.title === item.title);
    events.toPlayer({
      item,
      data: a,
      index: r,
      api: providers.local,
    });
  }
}
export default LocalMusic;
