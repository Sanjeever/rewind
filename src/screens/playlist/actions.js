import providers from '../../services/providers';
import names from '../../events/names';
import locales from '../../locales/index';
import * as services from '../../services/index';
import * as events from '../../events/index';
import * as utils from '../../utils/index';
import queue from '../../events/queue';
import users from '../../storage/users';
const p = (tracks, trackIds) => {
  for (let a = 0; a < tracks.length; a++) {
    const r = trackIds[a];
    if (r?.hasOwnProperty('lr')) {
      tracks[a].lastRank = r.lr;
    }
  }
};
const m = (e) => {
  if (e === 'subscribe') {
    toast(locales.COLLECT_SUCCESS);
  } else if (e === 'unsubscribe') {
    toast(locales.DELETE_SUCCESS);
  }
};
const b = async (id, op) => {
  const response = await services.Netease.subscribe_playlist({
    id,
    op,
  });
  if (response?.code !== 200) {
    throw new Error(response?.msg || locales.ERROR);
  }
  m(op);
};
const v = async (id, op) => {
  const response = await services.QQMusic.subscribe_playlist({
    id,
    op,
  });
  if (!response) {
    throw new Error(locales.ERROR);
  }
  m(op);
};
const g = {
  deleteFromNetease: async function ({playlistId, trackid}) {
    const response = await services.Netease.playlist_tracks({
      op: 'del',
      pid: playlistId,
      tracks: trackid,
    });
    if (response?.code !== 200) {
      throw new Error(response?.message || locales.ERROR);
    }
  },
  deleteFromQQMusic: async function (id, dirid) {
    if (!id || !dirid) {
      throw new Error(locales.ERROR);
    }
    const account = (await users.getUserInfo())?.qqMusic;
    if (!account?.cookies) {
      throw new Error('请先登录 QQ 音乐');
    }
    const response = await services.QQMusic.dislike({
      id,
      dirid,
      qq: account.userId,
      cookies: account.cookies,
    });
    if (response?.code !== 0) {
      throw new Error(locales.ERROR);
    }
  },
  getFromNetease: async function (id) {
    if (!id) {
      return;
    }
    const response = await services.Netease.playlist_detail(id);
    if (!response?.playlist) {
      throw new Error(response?.message || locales.ERROR);
    }
    const {tracks, name, trackIds} = response.playlist;
    if (name.includes('榜')) {
      p(tracks, trackIds);
    }
    await users.saveNeteasePlayListCache(id, name, tracks);
    return {
      id,
      name,
      tracks,
      trackCount: tracks.length,
      moreFunc: response.moreFunc,
    };
  },
  getFromQQMusic: async function (id) {
    if (!id) {
      return;
    }
    const response = await services.QQMusic.disslist({
      id,
    });
    if (!response?.[0]) {
      throw new Error(locales.ERROR);
    }
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
      const a = {};
      if (t === providers.netEase) {
        a.song = e.name;
        a.artist = e.ar ? e.ar : e.artists;
        a.album = e.al ? e.al.name : e.album.name;
        a.showMV = e.mvid || e.mv;
        a.alias = utils.delve(e, 'tns.0');
      } else if (t === providers.qqMusic) {
        a.song = e.songname;
        a.artist = e.singer;
        a.album = e.albumname;
        let n = e.mv?.vid || e.vid;
        n = typeof n === 'string' && n.length > 0;
        a.showMV = n;
      }
      return a;
    }
  },
  onMV: function (e, t) {
    let a;
    if (t === providers.netEase) {
      a = e.mv || e.mvid;
    } else if (t === providers.qqMusic) {
      a = e.mv?.vid || e.vid;
    }
    queue.playMV(a, t);
  },
  addToQueue: function (data, api) {
    events.toInsertToList({
      data,
      api,
    });
  },
  onDetail: function (item, index, {state}) {
    const {playlistId, api} = state;
    events.toDetailModal({
      item,
      index,
      api,
      playlistId,
    });
  },
  playMusic: function (item, t, a) {
    const a_state = a.state;
    const {searching, api, oriList, playlist, showRestore, playlistId} = a_state;
    const d = showRestore === false ? playlist : oriList;
    let index = t;
    if (searching === true) {
      d.forEach((t, a) => {
        if (t.id === item.id) {
          index = a;
        }
      });
    }
    events.toPlayer({
      item,
      data: d,
      index,
      api,
      localPath: item.localPath,
      pid: playlistId,
    });
    a.collectPlaylistOrder();
  },
  savePic: function (img, song) {
    events.emitter.emit(names.SavePicModal, {
      img,
      song,
    });
  },
  onHeartMode: async function (page) {
    const {heartMode, playlist, playlistId, api} = page.state;
    if (heartMode !== true || !playlist.length) {
      return;
    }
    const song = playlist[utils.random.getInt(0, playlist.length)];
    const response = await services.Netease.heart_mode({
      songId: song.id,
      playlistId,
    });
    if (String(response?.code) === '500') {
      toast(locales.NETEASE_NOT_LOGIN);
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
    if (a === providers.netEase) {
      return b(e, t);
    }
    if (a === providers.qqMusic) {
      return v(e, t);
    }
    return Promise.reject(new Error('未知音乐来源'));
  },
};
export default g;
