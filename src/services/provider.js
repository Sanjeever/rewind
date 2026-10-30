const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var providers = _interopRequireDefault(require("./providers")),
  types = _interopRequireWildcard(require("../utils/types")),
  netease = _interopRequireDefault(require("./netease/index")),
  qqmusic = _interopRequireDefault(require("./qqmusic/index")),
  c = function (e) {
    var r = e.name || e.songname || e.song || e.title || e.filename,
      n = e.singer || e.artists || e.ar,
      t = r;
    n[0] && (t += ' - ' + n[0].name);
    return {
      text: t,
      song: r,
      singer: n[0].name
    };
  },
  o = function (e, r, n) {
    var t = e.songs;
    return t && 0 !== t.length ? n ? t.find(function (e) {
      return e.id !== r.id && e.dt === r.dt;
    }) || null : t[0] : null;
  },
  f = async function (song, alternate = false) {
    const {
      text
    } = c(song);
    const result = await netease.default.search({
      keywords: text
    });
    if (!types.isObject(result)) return null;
    const match = o(result.result, song, alternate);
    if (!types.isObject(match)) return null;
    const response = await netease.default.freeMusicUrl({
      id: match.id
    });
    return response?.data?.[0]?.url || null;
  },
  d = async function (song) {
    const {
      text,
      song: title,
      singer
    } = c(song);
    const exact = item => item.name === title && item.singer?.[0]?.name === singer;
    const candidates = await qqmusic.default.searchSong(text);
    if (!Array.isArray(candidates) || !candidates.length) return null;
    let match = candidates[0].name === title ? candidates[0] : candidates.slice(1).find(exact);
    if (!match) {
      const more = await qqmusic.default.searchSong(title);
      match = more?.find(exact);
    }
    if (!match) return null;
    return (await qqmusic.default.getMusicUrl(match.songmid || match.mid)) || null;
  },
  g = {
    getUrlFromOther: async function (song, api = providers.default.netEase) {
      if (api === providers.default.qqMusic) return f(song);
      if (api === providers.default.netEase) {
        const url = await d(song);
        return url || f(song, true);
      }
      return null;
    }
  };
exports.default = g;
