import * as React from 'react';
import * as components from '../components/index';
import providers from '../services/providers';
import * as events from '../events/index';
import * as utils from '../utils/index';
import queue from '../events/queue';
class ArtistSongs extends React.PureComponent {
  formatListItem = (e) => {
    const n = {};
    switch (this.props.api) {
      case providers.netEase:
        n.song = e.name;
        n.singer = e.artists;
        n.album = e.album.name;
        n.img = `${e.album.picUrl}?param=200y200`;
        n.trans = utils.delve(e, 'transNames.0');
        break;
      case providers.qqMusic:
        n.song = e.name;
        n.singer = e.singer;
        n.album = e.album.name;
        n.img = `http://y.gtimg.cn/music/photo_new/T002R150x150M000${e.album.mid}.jpg`;
    }
    n.mvid = e.mv?.vid || e.vid || e.mvid;
    return n;
  };
  onMV = (e) => {
    const api = this.props.api;
    queue.playMV(e, api);
  };
  _renderItem = ({item, index}) => {
    const r_props = this.props;
    const {api, hotSongs} = r_props;
    const m = this.formatListItem(item);
    return (
      <components.SongRow
        key={index}
        curIndex={null}
        album={m.album}
        song={m.song}
        singer={m.singer}
        img={m.img}
        alias={m.trans}
        onPress={function () {
          return events.toPlayer({
            item,
            data: hotSongs,
            api,
            index,
          });
        }}
        addToQueue={function () {
          return events.toInsertToList({
            data: item,
            api,
          });
        }}
        detail={function () {
          return events.toDetailModal({
            item,
            index,
            api,
          });
        }}
        songItem={item}
        showMV={!!m.mvid}
        onMV={() => {
          return this.onMV(m.mvid);
        }}
      />
    );
  };
  render() {
    return this.props.hotSongs.map((item, index) =>
      this._renderItem({
        item,
        index,
      }),
    );
  }
}
export default ArtistSongs;
