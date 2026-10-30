Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "getUid", {
  enumerable: true,
  get: function () {
    return trackFields.getUid;
  }
});
exports.extractSingerName = exports.extractSingerItem = exports.extractFullInfo = exports.extractBasicInfo = exports.extractAlbumName = exports.extractAlbumItem = void 0;
var providers = babelHelpers.interopRequireDefault(require("./providers")),
  utils = require("../utils/index"),
  trackFields = require("./trackFields"),
  c = function () {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
      a = {};
    a.song = (0, trackFields.getSong)(e);
    a.album = (0, trackFields.getAlbum)(e);
    a.singer = (0, trackFields.getSinger)(e);
    return a;
  };
exports.extractBasicInfo = c;
exports.extractFullInfo = function () {
  var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
    a = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 'small',
    t = c(e);
  t.qqAlbumId = (0, utils.delve)(e, 'album.mid') || (0, utils.delve)(e, 'albummid');
  t.localAlbumId = e.albumId;
  t.api = (0, trackFields.getApi)(t);
  t.alias = (0, trackFields.getAlias)(e);
  t.uid = (0, trackFields.getUid)(e);
  t.img = (0, trackFields.getImg)(e, a, t.api);
  return t;
};
exports.extractSingerName = function (e, a) {
  var t = '',
    r = null;
  switch (a) {
    case providers.default.netEase:
      r = e.ar || e.artists;
      t = (0, utils.parseArtist)(r);
      break;
    case providers.default.qqMusic:
      r = e.singer;
      t = (0, utils.parseArtist)(r);
  }
  return t;
};
exports.extractAlbumName = function (e, a) {
  var t = '';
  switch (a) {
    case providers.default.netEase:
      var r = e.al || e.album;
      r && (t = r.name);
      break;
    case providers.default.qqMusic:
      t = (0, utils.delve)(e, 'album.name') || e.albumname;
  }
  return t;
};
exports.extractSingerItem = function (e, a) {
  var t = null;
  switch (a) {
    case providers.default.netEase:
      t = e.ar || e.artists;
      break;
    case providers.default.qqMusic:
      t = e.singer;
  }
  return t;
};
exports.extractAlbumItem = function (e, a) {
  var t = '';
  switch (a) {
    case providers.default.netEase:
      t = e.al || e.album;
      break;
    case providers.default.qqMusic:
      var r = {
        albummid: null === e || void 0 === e ? void 0 : e.albummid,
        albumname: null === e || void 0 === e ? void 0 : e.albumname
      };
      t = e.album || r;
  }
  return t;
};
