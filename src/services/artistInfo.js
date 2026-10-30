Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var utils = require("../utils/index"),
  m = {
    netEase: function (e, t) {
      var l = (0, utils.delve)(e, 'album.picUrl') || (0, utils.delve)(e, 'al.picUrl') || e.coverUrl;
      if (l) return 'small' === t ? l + '?param=100y100' : l + '?param=1000y1000';
    },
    qqMusic: function (e, t) {
      var l = 'small' === t ? 'http://y.gtimg.cn/music/photo_new/T002R150x150M000' : 'http://y.gtimg.cn/music/photo_new/T002R500x500M000',
        i = 'small' === t ? 'https://y.gtimg.cn/music/photo_new/T001R150x150M000' : 'https://y.gtimg.cn/music/photo_new/T001R500x500M000',
        a = (0, utils.delve)(e, 'singer.0.mid'),
        m = (0, utils.delve)(e, 'album.mid') || (0, utils.delve)(e, 'albummid');
      return '001ZaCQY2OxVMg' !== m ? l + m + '.jpg' : i + a + '.jpg';
    },
    local: function (e) {
      return e.img ? 'data:image/png;base64,' + e.img : null;
    }
  };
exports.default = m;
