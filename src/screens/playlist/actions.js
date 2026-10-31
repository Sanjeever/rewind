const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var providers = _interopRequireDefault(require('../../services/providers')),
  names = _interopRequireDefault(require('../../events/names')),
  locales = _interopRequireDefault(require('../../locales/index')),
  services = require('../../services/index'),
  events = require('../../events/index'),
  utils = require('../../utils/index'),
  queue = _interopRequireDefault(require('../../events/queue')),
  users = _interopRequireDefault(require('../../storage/users')),
  p = function (e, t) {
    for (var a = 0; a < e.length; a++) {
      var r = t[a];
      (null === r || void 0 === r ? void 0 : r.hasOwnProperty('lr')) && (e[a].lastRank = r.lr);
    }
  },
  m = function (e) {
    'subscribe' === e
      ? toast(locales.default.COLLECT_SUCCESS)
      : 'unsubscribe' === e && toast(locales.default.DELETE_SUCCESS);
  },
  b = async function (id, op) {
    const response = await services.Netease.subscribe_playlist({
      id,
      op,
    });
    if (response?.code !== 200) throw new Error(response?.msg || locales.default.ERROR);
    m(op);
  },
  v = async function (id, op) {
    const response = await services.QQMusic.subscribe_playlist({
      id,
      op,
    });
    if (!response) throw new Error(locales.default.ERROR);
    m(op);
  },
  g = {
    deleteFromNetease: async function ({playlistId, trackid}) {
      const response = await services.Netease.playlist_tracks({
        op: 'del',
        pid: playlistId,
        tracks: trackid,
      });
      if (response?.code !== 200) throw new Error(response?.message || locales.default.ERROR);
    },
    deleteFromQQMusic: async function (id, dirid) {
      if (!id || !dirid) throw new Error(locales.default.ERROR);
      const account = (await users.default.getUserInfo())?.qqMusic;
      if (!account?.cookies) throw new Error('请先登录 QQ 音乐');
      const response = await services.QQMusic.dislike({
        id,
        dirid,
        qq: account.userId,
        cookies: account.cookies,
      });
      if (response?.code !== 0) throw new Error(locales.default.ERROR);
    },
    getFromNetease: async function (id) {
      if (!id) return;
      const response = await services.Netease.playlist_detail(id);
      if (!response?.playlist) throw new Error(response?.message || locales.default.ERROR);
      const {tracks, name, trackIds} = response.playlist;
      if (name.includes('榜')) p(tracks, trackIds);
      await users.default.saveNeteasePlayListCache(id, name, tracks);
      return {
        id,
        name,
        tracks,
        trackCount: tracks.length,
        moreFunc: response.moreFunc,
      };
    },
    getFromQQMusic: async function (id) {
      if (!id) return;
      const response = await services.QQMusic.disslist({
        id,
      });
      if (!response?.[0]) throw new Error(locales.default.ERROR);
      const {songlist, dissname} = response[0];
      return {
        id,
        name: dissname,
        tracks: songlist,
        trackCount: songlist.length,
      };
    },
    formatItemData: function (e, t) {
      if (e) {
        var a = {};
        if (t === providers.default.netEase) {
          a.song = e.name;
          a.artist = e.ar ? e.ar : e.artists;
          a.album = e.al ? e.al.name : e.album.name;
          a.showMV = e.mvid || e.mv;
          a.alias = (0, utils.delve)(e, 'tns.0');
        } else if (t === providers.default.qqMusic) {
          var r;
          a.song = e.songname;
          a.artist = e.singer;
          a.album = e.albumname;
          var n = (null === (r = e.mv) || void 0 === r ? void 0 : r.vid) || e.vid;
          n = 'string' == typeof n && n.length > 0;
          a.showMV = n;
        }
        return a;
      }
    },
    onMV: function (e, t) {
      var a;
      if (t === providers.default.netEase) a = e.mv || e.mvid;
      else if (t === providers.default.qqMusic) {
        var r;
        a = (null === (r = e.mv) || void 0 === r ? void 0 : r.vid) || e.vid;
      }
      queue.default.playMV(a, t);
    },
    addToQueue: function (e, t) {
      (0, events.toInsertToList)({
        data: e,
        api: t,
      });
    },
    onDetail: function (e, t, a) {
      var r = a.state,
        n = r.playlistId,
        s = r.api;
      (0, events.toDetailModal)({
        item: e,
        index: t,
        api: s,
        playlistId: n,
      });
    },
    playMusic: function (e, t, a) {
      var r = a.state,
        n = r.searching,
        s = r.api,
        i = r.oriList,
        u = r.playlist,
        o = r.showRestore,
        c = r.playlistId,
        d = false === o ? u : i,
        f = t;
      true === n &&
        d.forEach(function (t, a) {
          t.id === e.id && (f = a);
        });
      (0, events.toPlayer)({
        item: e,
        data: d,
        index: f,
        api: s,
        localPath: e.localPath,
        pid: c,
      });
      a.collectPlaylistOrder();
    },
    savePic: function (e, t) {
      events.emitter.emit(names.default.SavePicModal, {
        img: e,
        song: t,
      });
    },
    onHeartMode: async function (page) {
      const {heartMode, playlist, playlistId, api} = page.state;
      if (heartMode !== true || !playlist.length) return;
      const song = playlist[utils.random.getInt(0, playlist.length)];
      const response = await services.Netease.heart_mode({
        songId: song.id,
        playlistId,
      });
      if (String(response?.code) === '500') {
        toast(locales.default.NETEASE_NOT_LOGIN);
        return;
      }
      if (response?.data?.length) {
        const tracks = response.data.map((item) => ({
          id: item.id,
          ...item.songInfo,
        }));
        events.toPlayer({
          item: tracks[0],
          data: tracks,
          index: 0,
          api,
        });
      }
    },
    onSubscribe: function (e, t, a) {
      return a === providers.default.netEase
        ? b(e, t)
        : a === providers.default.qqMusic
          ? v(e, t)
          : Promise.reject(new Error('未知音乐来源'));
    },
  };
exports.default = g;
