import providers from './providers';
import locales from '../locales/index';
import * as utils from '../utils/index';
import searchTypes from './searchTypes';
const s = ({item, api}) => {
  const i = {};
  if (api === providers.netEase) {
    const {name, albumSize, img1v1Url} = item;
    i.title = name;
    i.trans = utils.delve(item, 'alias.0');
    i.subtitle = albumSize ? `专辑：${albumSize}` : null;
    i.img = img1v1Url ? `${img1v1Url}?param=500y500` : null;
  } else if (api === providers.qqMusic) {
    const {singerPic, singerName, albumNum} = item;
    const d = singerPic ? singerPic.replace(/150x150/g, '500x500') : singerPic;
    i.title = singerName;
    i.subtitle = albumNum ? `专辑：${albumNum}` : null;
    i.img = d;
  }
  return i;
};
const f = ({item, api}) => {
  const i = {};
  if (api === providers.netEase) {
    const {name, artist, picUrl, publishTime} = item;
    const f = utils.timeFormatter.localeString(publishTime);
    i.title = name;
    i.subtitle = `${artist.name}  |  ${f}`;
    i.img = `${picUrl}?param=150y150`;
    i.trans = utils.delve(item, 'alias.0') || utils.delve(item, 'transNames.0');
  } else if (api === providers.qqMusic) {
    const {albumName, singerName, albumPic, publicTime} = item;
    i.title = albumName;
    i.subtitle = `${singerName}  |  ${publicTime}`;
    i.img = albumPic;
  }
  return i;
};
const c = ({item, api}) => {
  const i = {};
  if (api === providers.netEase) {
    const {name, coverImgUrl, trackCount, creator} = item;
    const f = creator?.nickname;
    i.title = name;
    i.subtitle = `${trackCount} ${locales.SONG_COUNT}  |  ${f}`;
    i.img = `${coverImgUrl}?param=500y500`;
  } else if (api === providers.qqMusic) {
    const {dissname, imgurl, creator, song_count} = item;
    const v = creator?.name;
    i.title = dissname.replace(/&#.+;/gi, ' ');
    i.subtitle = `${song_count} ${locales.SONG_COUNT}  |  ${v}`;
    i.img = imgurl;
  }
  return i;
};
const d = ({item, api}) => {
  const i = {};
  if (api === providers.netEase) {
    i.title = item.name;
    i.subtitle = utils.timeFormatter.parseTime(item.duration / 1000);
    i.img = `${item.cover}?param=500y500`;
  } else if (api === providers.qqMusic) {
    i.title = item.mv_name;
    i.subtitle = utils.timeFormatter.parseTime(item.duration);
    i.img = item.mv_pic_url;
  }
  return i;
};
const p = function ({item, page, api}) {
  let a;
  switch (page) {
    case searchTypes.singers:
      a = s({
        item,
        api,
      });
      break;
    case searchTypes.playlists:
      a = c({
        item,
        api,
      });
      break;
    case searchTypes.albums:
      a = f({
        item,
        api,
      });
      break;
    case searchTypes.mvs:
      a = d({
        item,
        api,
      });
  }
  return a;
};
export default p;
