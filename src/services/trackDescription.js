const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var providers = _interopRequireDefault(require('./providers')),
  locales = _interopRequireDefault(require('../locales/index')),
  utils = require('../utils/index'),
  searchTypes = _interopRequireDefault(require('./searchTypes')),
  s = function (e) {
    var a = e.item,
      t = e.api,
      i = {};
    if (t === providers.default.netEase) {
      var l = a.name,
        u = a.albumSize,
        n = a.img1v1Url;
      i.title = l;
      i.trans = (0, utils.delve)(a, 'alias.0');
      i.subtitle = u ? '专辑：' + u : null;
      i.img = n ? n + '?param=500y500' : null;
    } else if (t === providers.default.qqMusic) {
      var s = a.singerPic,
        f = a.singerName,
        c = a.albumNum,
        d = s ? s.replace(/150x150/g, '500x500') : s;
      i.title = f;
      i.subtitle = c ? '专辑：' + c : null;
      i.img = d;
    }
    return i;
  },
  f = function (e) {
    var a = e.item,
      t = e.api,
      i = {};
    if (t === providers.default.netEase) {
      var l = a.name,
        u = a.artist,
        n = a.picUrl,
        s = a.publishTime,
        f = utils.timeFormatter.localeString(s);
      i.title = l;
      i.subtitle = u.name + '  |  ' + f;
      i.img = n + '?param=150y150';
      i.trans = (0, utils.delve)(a, 'alias.0') || (0, utils.delve)(a, 'transNames.0');
    } else if (t === providers.default.qqMusic) {
      var c = a.albumName,
        d = a.singerName,
        p = a.albumPic,
        o = a.publicTime;
      i.title = c;
      i.subtitle = d + '  |  ' + o;
      i.img = p;
    }
    return i;
  },
  c = function (e) {
    var a = e.item,
      t = e.api,
      i = {};
    if (t === providers.default.netEase) {
      var l = a.name,
        m = a.coverImgUrl,
        n = a.trackCount,
        s = a.creator,
        f = null === s || void 0 === s ? void 0 : s.nickname;
      i.title = l;
      i.subtitle = n + ' ' + locales.default.SONG_COUNT + '  |  ' + f;
      i.img = m + '?param=500y500';
    } else if (t === providers.default.qqMusic) {
      var c = a.dissname,
        d = a.imgurl,
        p = a.creator,
        o = a.song_count,
        v = null === p || void 0 === p ? void 0 : p.name;
      i.title = c.replace(/&#.+;/gi, ' ');
      i.subtitle = o + ' ' + locales.default.SONG_COUNT + '  |  ' + v;
      i.img = d;
    }
    return i;
  },
  d = function (e) {
    var a = e.item,
      t = e.api,
      i = {};
    t === providers.default.netEase
      ? ((i.title = a.name),
        (i.subtitle = utils.timeFormatter.parseTime(a.duration / 1e3)),
        (i.img = a.cover + '?param=500y500'))
      : t === providers.default.qqMusic &&
        ((i.title = a.mv_name),
        (i.subtitle = utils.timeFormatter.parseTime(a.duration)),
        (i.img = a.mv_pic_url));
    return i;
  },
  p = function (e) {
    var a,
      t = e.item,
      i = e.page,
      l = e.api;
    switch (i) {
      case searchTypes.default.singers:
        a = s({
          item: t,
          api: l,
        });
        break;
      case searchTypes.default.playlists:
        a = c({
          item: t,
          api: l,
        });
        break;
      case searchTypes.default.albums:
        a = f({
          item: t,
          api: l,
        });
        break;
      case searchTypes.default.mvs:
        a = d({
          item: t,
          api: l,
        });
    }
    return a;
  };
exports.default = p;
