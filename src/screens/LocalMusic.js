import * as React from 'react';
import * as components from '../components/index';
import providers from '../services/providers';
import names from '../events/names';
import icons from '../theme/icons';
import locales from '../locales/index';
import * as events from '../events/index';
import * as utils from '../utils/index';
import mediaStore from '../native/mediaStore';
import LocalMusicList from './../modules/LocalMusicList.js';
const h = {
  time: 'random',
  random: 'song',
  song: 'artist',
  artist: 'album',
  album: 'time',
};
class LocalMusic extends React.Component {
  state = {
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
    const r_state = this.state;
    const {sortMode, oriList} = r_state;
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
        this.searchSong(':1', false, false);
        break;
      case 'artist':
        e = locales.ARTIST_ORDER;
        this.searchSong(':2', false, false);
        break;
      case 'album':
        e = locales.ALBUM_ORDER;
        this.searchSong(':3', false, false);
        break;
      case 'random':
        e = locales.RANDOM_ORDER;
        this.searchSong(':4', false, false);
    }
    toast(e);
    this.setState({
      sortMode: sortMode_1,
    });
  };
  searchSong = (e) => {
    const oriList = this.state.oriList;
    if (oriList) {
      const a = utils.filterHelper.search(oriList, e);
      this.setState({
        playList: a,
      });
    }
  };
  onTop = () => {
    this.listParent.onTop?.();
  };
  componentDidMount() {
    const e = this;
    this.deleteReciver = events.emitter.addListener(
      names.DeleteFromLocal,
      function ({deleteIndex}) {
        const playList = e.state.playList;
        if (playList) {
          const n = playList.filter((e, t) => deleteIndex !== t);
          e.setState({
            playList: n,
          });
        }
      },
    );
    this.loadPlayList();
  }
  componentWillUnmount() {
    this.deleteReciver.remove();
  }
  render() {
    const e = this;
    return (
      <components.PageContainer
        title={locales.LOCAL_MUSIC}
        goBack={this.goBack}
        opacity={this.opacity}
        onTop={this.onTop}
        onChangeText={function (t) {
          return e.searchSong(t);
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
          data={this.state.playList}
          playMusic={function (t, a) {
            return e.playMusic(t, a);
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
          ref={(instance) => (this.listParent = instance)}
        />
      </components.PageContainer>
    );
  }
  playMusic(item) {
    const playList = this.state.playList;
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
