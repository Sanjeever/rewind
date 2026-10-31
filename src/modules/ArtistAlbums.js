import * as React from 'react';
import * as components from '../components/index';
import providers from '../services/providers';
import locales from '../locales/index';
import * as utils from '../utils/index';
class ArtistAlbums extends React.PureComponent {
  formatListItem = (e) => {
    const t = {};
    switch (this.props.api) {
      case providers.netEase:
        const r = utils.timeFormatter.localeString(e.publishTime);
        t.title = e.name;
        t.subtitle = `${e.size} ${locales.SONG_COUNT}, ${r}`;
        t.img = `${e.picUrl}?param=150y150`;
        t.trans = utils.delve(e, 'alias.0') || utils.delve(e, 'transNames.0');
        break;
      case providers.qqMusic:
        t.title = e.albumName;
        t.subtitle = `${e.latest_song.song_count} ${locales.SONG_COUNT}, ${e.pubTime}`;
        t.img = `http://y.gtimg.cn/music/photo_new/T002R150x150M000${e.albumMID}.jpg`;
        break;
      default:
        t.title = null;
        t.subtitle = null;
        t.img = null;
    }
    return t;
  };
  _renderItem = ({item, index}) => {
    const l = this.formatListItem(item);
    return (
      <components.ListItem
        key={index}
        img={l.img}
        title={l.title}
        subtitle={l.subtitle}
        trans={l.trans}
        onPress={() => {
          return this.albumPage(item, this.props.api);
        }}
      />
    );
  };
  albumPage = (e, api) => {
    this.props.navigation.navigate('AlbumPage', {
      item: e,
      api,
    });
  };
  render() {
    const e = this;
    return this.props.albums.map((t, index) =>
      e._renderItem({
        item: t,
        index,
      }),
    );
  }
}
export default ArtistAlbums;
