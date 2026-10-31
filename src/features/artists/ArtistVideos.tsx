import * as React from 'react';
import * as components from '../../components/index';
import providers from '../../services/providers';
import * as utils from '../../utils/index';
import queue from '../../events/queue';
import type {SearchEntity} from '../../services/searchEntities';
import type {Provider} from '../../services/providers';
type Video = SearchEntity;
class ArtistVideos extends React.PureComponent<{api: Provider; mvs: Video[]}> {
  formatListItem = (e: Video) => {
    const t: {title?: string | null; subtitle?: string | null; img?: string | null} = {};
    switch (this.props.api) {
      case providers.netEase: {
        const r = utils.timeFormatter.parseTime(e.duration! / 1000);
        t.title = e.name;
        t.subtitle = `${r} | ${e.publishTime}`;
        t.img = `${e.imgurl}?param=500y500`;
        break;
      }
      case providers.qqMusic:
        t.title = e.title;
        t.subtitle = e.date;
        t.img = e.pic;
        break;
      default:
        t.title = null;
        t.subtitle = null;
        t.img = null;
    }
    return t;
  };
  _renderItem = ({item, index}: {item: Video; index: number}) => {
    const i = this.formatListItem(item);
    return (
      <components.ListItem
        key={index}
        img={i.img}
        title={i.title}
        subtitle={i.subtitle}
        onPress={() => {
          return this.playMV(item, this.props.api);
        }}
        numberOfLines={2}
      />
    );
  };
  playMV = function (e: Video, t: Provider) {
    const r = t === providers.netEase ? e.id : e.vid;
    queue.playMV(r!, t);
  };
  render() {
    return this.props.mvs.map((item, index) =>
      this._renderItem({
        item,
        index,
      }),
    );
  }
}
export default ArtistVideos;
