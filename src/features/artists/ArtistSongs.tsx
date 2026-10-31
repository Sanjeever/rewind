import * as React from 'react';
import * as components from '../../components/index';
import providers from '../../services/providers';
import * as events from '../../events/index';
import queue from '../../events/queue';
import type {TrackFields, TrackId, Artist} from '../../services/track';
import type {Provider} from '../../services/providers';
class ArtistSongs extends React.PureComponent<{api: Provider; hotSongs: TrackFields[]}> {
  formatListItem = (e: TrackFields) => {
    const n: {
      song?: string;
      singer?: string | Artist[];
      album?: string;
      img?: string;
      trans?: string;
      mvid?: TrackId;
    } = {};
    const album = typeof e.album === 'object' ? e.album : undefined;
    switch (this.props.api) {
      case providers.netEase:
        n.song = e.name;
        n.singer = e.artists;
        n.album = album!.name;
        n.img = `${album!.picUrl}?param=200y200`;
        n.trans = e.transNames?.[0];
        break;
      case providers.qqMusic:
        n.song = e.name;
        n.singer = e.singer;
        n.album = album!.name;
        n.img = `http://y.gtimg.cn/music/photo_new/T002R150x150M000${album!.mid}.jpg`;
    }
    n.mvid = (typeof e.mv === 'object' ? e.mv?.vid : undefined) || e.vid || e.mvid;
    return n;
  };
  onMV = (e: TrackId) => {
    const api = this.props.api;
    queue.playMV(e, api);
  };
  _renderItem = ({item, index}: {item: TrackFields; index: number}) => {
    const props = this.props;
    const {api, hotSongs} = props;
    const m = this.formatListItem(item);
    return (
      <components.SongRow
        key={index}
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
          return this.onMV(m.mvid!);
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
