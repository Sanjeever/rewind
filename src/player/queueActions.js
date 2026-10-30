Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var immer = require("immer"),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  utils = require("../utils/index"),
  trackInfo = require("../services/trackInfo"),
  p = function (a, e, t, r) {
    if ('random' === a.state.playMode) {
      var i = a.state.randomArray,
        l = i.indexOf(e),
        s = i.indexOf(t);
      r || (i = (0, immer.produce)(i, function (a) {
        a.push(a.length);
      }));
      (0, utils.swap)(i, s, l + 1);
      a.setState({
        randomArray: i
      });
    }
  },
  d = function (a) {
    var e = a.that,
      t = a.item,
      r = a.api,
      i = e.props,
      n = i.tracks,
      o = i.songItemInfo,
      d = i.playingIndex,
      u = i.setPlayerData;
    if (n && 0 !== n.length) {
      var c = (0, trackInfo.extractFullInfo)(t);
      if (c.uid !== o.uid) {
        var f = e.props.api,
          y = babelHelpers.toConsumableArray(n),
          v = y[d],
          g = false;
        if (r !== f) {
          t.api = r;
          for (var m = 0; m < y.length; m++) y[m].api || (y[m].api = f);
        } else {
          var b = y.findIndex(function (a) {
            return (0, trackInfo.getUid)(a) === c.uid;
          });
          -1 !== b && (y.splice(b, 1), g = true);
        }
        var h = y.indexOf(v),
          x = h + 1;
        y.splice(x, 0, t);
        u({
          tracks: y,
          playingIndex: h < d ? h : d
        });
        toast(locales.default.NEXT_SONG + " " + c.song);
        p(e, h, x, g);
      }
    } else e.musicPlayerEmitter({
      song: t,
      data: [t],
      index: 0,
      api: r
    });
  },
  u = function (a, e) {
    var t = e.data,
      r = e.type,
      i = e.api,
      n = a.props,
      l = n.tracks,
      o = n.playingIndex,
      s = n.setPlayerData;
    switch (r) {
      case 'item':
        d({
          that: a,
          item: t,
          api: i
        });
        break;
      case 'array':
        if (null == t && (null === t || void 0 === t ? void 0 : t.length) < 1) return;
        var p = babelHelpers.toConsumableArray(l);
        p.splice.apply(p, [o + 1, 0].concat(babelHelpers.toConsumableArray(t)));
        0 === (null === l || void 0 === l ? void 0 : l.length) ? a.musicPlayerEmitter({
          song: t[0],
          data: t,
          index: 0,
          api: i
        }) : (s({
          tracks: p
        }), toast("\u5df2\u6dfb\u52a0 " + t.length + " \u9996\u6b4c\u5230\u64ad\u653e\u961f\u5217"));
    }
  };
exports.default = u;
