const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react")),
  components = require("../components/index"),
  providers = _interopRequireDefault(require("../services/providers")),
  events = require("../events/index"),
  utils = require("../utils/index"),
  queue = _interopRequireDefault(require("../events/queue")),
  p = class t extends React.PureComponent {
    constructor() {
      var e, n, r;
      for (var a = arguments.length, p = new Array(a), d = 0; d < a; d++) p[d] = arguments[d];
      return n = r = super(...p), r.formatListItem = function (e) {
        var t,
          n = {};
        switch (r.props.api) {
          case providers.default.netEase:
            n.song = e.name;
            n.singer = e.artists;
            n.album = e.album.name;
            n.img = e.album.picUrl + '?param=200y200';
            n.trans = (0, utils.delve)(e, 'transNames.0');
            break;
          case providers.default.qqMusic:
            n.song = e.name;
            n.singer = e.singer;
            n.album = e.album.name;
            n.img = "http://y.gtimg.cn/music/photo_new/T002R150x150M000" + e.album.mid + ".jpg";
        }
        n.mvid = (null === (t = e.mv) || void 0 === t ? void 0 : t.vid) || e.vid || e.mvid;
        return n;
      }, r.onMV = function (e) {
        var t = r.props.api;
        queue.default.playMV(e, t);
      }, r._renderItem = function (e) {
        var t = e.item,
          n = e.index,
          a = r.props,
          s = a.api,
          u = a.hotSongs,
          m = r.formatListItem(t);
        return React.default.createElement(components.SongRow, {
          key: n,
          curIndex: null,
          album: m.album,
          song: m.song,
          singer: m.singer,
          img: m.img,
          alias: m.trans,
          onPress: function () {
            return (0, events.toPlayer)({
              item: t,
              data: u,
              api: s,
              index: n
            });
          },
          addToQueue: function () {
            return (0, events.toInsertToList)({
              data: t,
              api: s
            });
          },
          detail: function () {
            return (0, events.toDetailModal)({
              item: t,
              index: n,
              api: s
            });
          },
          songItem: t,
          showMV: !!m.mvid,
          onMV: function () {
            return r.onMV(m.mvid);
          }
        });
      }, n;
    }
    "render"() {
      var e = this;
      return this.props.hotSongs.map(function (t, n) {
        return e._renderItem({
          item: t,
          index: n
        });
      });
    }
  };
exports.default = p;
