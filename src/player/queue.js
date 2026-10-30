Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var names = babelHelpers.interopRequireDefault(require("../events/names")),
  trackInfo = require("../services/trackInfo");
exports.default = function i(a, n) {
  var t = this;
  babelHelpers.classCallCheck(this, i);
  this.data = function (i, a, n) {
    var e = a;
    if ('insert' === (null === i || void 0 === i ? void 0 : i.type) && t.props.tracks.length > 0) {
      var o = t.props.tracks.filter(function (i) {
        return (0, trackInfo.extractFullInfo)(i).song !== (0, trackInfo.extractFullInfo)(n).song;
      });
      if (i.api !== t.props.api) for (var l = 0; l < o.length; l++) o[l].api || (o[l].api = t.props.api);
      o.splice(0, 0, n);
      e = o;
    }
    return e;
  };
  this.index = function (i) {
    var a = i.index;
    (null === i || void 0 === i ? void 0 : i.type) === names.default.ChangePlaylist && 'random' !== t.playMode && (a = 0);
    'insert' === (null === i || void 0 === i ? void 0 : i.type) && t.props.tracks.length > 0 && (a = 0);
    return a;
  };
  this.songItem = function (i, a) {
    var n,
      e = i.song;
    (null === (n = e) || void 0 === n ? void 0 : n.mainTrackId) > 0 && (e.rid = e.id, e.id = e.mainTrackId);
    (null === i || void 0 === i ? void 0 : i.type) === names.default.ChangePlaylist && 'random' !== t.playMode && (e = a[0]);
    i.api !== t.props.api && (e.api = i.api);
    return e;
  };
  this.api = function (i) {
    var a,
      n = i.api;
    (null === (a = i.song) || void 0 === a ? void 0 : a.api) && i.song.api !== i.api && (n = i.song.api);
    return n;
  };
  this.props = a;
  this.playMode = n;
};
