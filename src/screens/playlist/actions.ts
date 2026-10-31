import type {TrackFields, TrackId, Artist} from '../../services/track';
import type {Provider} from '../../services/providers';
export interface PlaylistActionContext {
  state: {
    playlistId: TrackId | null;
    api: Provider;
    searching: boolean;
    oriList: TrackFields[];
    playlist: TrackFields[];
    showRestore: boolean;
    heartMode: boolean;
  };
  collectPlaylistOrder(): void;
}
export interface PlaylistData {
  id: TrackId;
  name?: string;
  tracks: TrackFields[];
  trackCount?: number;
  moreFunc?: () => Promise<{songs: TrackFields[]} | undefined>;
}
import {toast} from '../../native/toast';
import providers from '../../services/providers';
import names from '../../events/names';
import locales from '../../locales/index';
import * as services from '../../services/index';
import * as events from '../../events/index';
import * as utils from '../../utils/index';
import queue from '../../events/queue';
import users from '../../storage/users';
const p = (
  tracks: TrackFields[],
  trackIds: {
    lr?: number;
  }[],
) => {
  for (let a = 0; a < tracks.length; a++) {
    const r = trackIds[a];
    if (r && Object.prototype.hasOwnProperty.call(r, 'lr')) {
      tracks[a].lastRank = r.lr;
    }
  }
};
const m = (e: 'subscribe' | 'unsubscribe') => {
  if (e === 'subscribe') {
    toast(locales.COLLECT_SUCCESS);
  } else if (e === 'unsubscribe') {
    toast(locales.DELETE_SUCCESS);
  }
};
const b = async (id: TrackId, op: 'subscribe' | 'unsubscribe') => {
  const response = await services.Netease.subscribe_playlist({
    id,
    op,
  });
  if (response?.code !== 200) {
    throw new Error(response?.msg || locales.ERROR);
  }
  m(op);
};
const v = async (id: TrackId, op: 'subscribe' | 'unsubscribe') => {
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
  deleteFromNetease: async function ({
    playlistId,
    trackid,
  }: {
    playlistId: TrackId;
    trackid: TrackId;
  }) {
    const response = await services.Netease.playlist_tracks({
      op: 'del',
      pid: playlistId,
      tracks: trackid,
    });
    if (response?.code !== 200) {
      throw new Error(response?.message || locales.ERROR);
    }
  },
  deleteFromQQMusic: async function (id: TrackId, dirid?: TrackId) {
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
      qq: account.userId!,
      cookies: account.cookies,
    });
    if (response?.code !== 0) {
      throw new Error(locales.ERROR);
    }
  },
  getFromNetease: async function (id: TrackId) {
    if (!id) {
      return;
    }
    const response = await services.Netease.playlist_detail(id);
    if (!response?.playlist) {
      throw new Error(response?.message || locales.ERROR);
    }
    const {tracks, name, trackIds} = response.playlist;
    if (!tracks || !trackIds || name == null) throw new Error('歌单响应缺少歌曲或名称');
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
  getFromQQMusic: async function (id: TrackId) {
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
    if (!songlist) throw new Error('歌单响应缺少歌曲列表');
    return {
      id,
      name: dissname,
      tracks: songlist,
      trackCount: songlist.length,
    };
  },
  formatItemData: function (e: TrackFields, t: Provider) {
    if (e) {
      const a: {
        song?: string;
        artist?: string | Artist[];
        album?: string;
        showMV?: boolean;
        alias?: string;
      } = {};
      if (t === providers.netEase) {
        a.song = e.name;
        a.artist = e.ar ? e.ar : e.artists;
        a.album = e.al
          ? !Array.isArray(e.al)
            ? e.al.name
            : undefined
          : typeof e.album === 'object'
            ? e.album?.name
            : undefined;
        a.showMV = !!(e.mvid || e.mv);
        a.alias = e.tns?.[0];
      } else if (t === providers.qqMusic) {
        a.song = e.songname;
        a.artist = e.singer;
        a.album = e.albumname;
        const n = (typeof e.mv === 'object' ? e.mv?.vid : undefined) || e.vid;
        a.showMV = typeof n === 'string' && n.length > 0;
      }
      return a;
    }
    throw new Error('歌曲数据为空');
  },
  onMV: function (e: TrackFields, t: Provider) {
    let a;
    if (t === providers.netEase) {
      a = (typeof e.mv === 'number' ? e.mv : undefined) || e.mvid;
    } else if (t === providers.qqMusic) {
      a = (typeof e.mv === 'object' ? e.mv?.vid : undefined) || e.vid;
    }
    queue.playMV(a!, t);
  },
  addToQueue: function (data: TrackFields, api: Provider) {
    events.toInsertToList({
      data,
      api,
    });
  },
  onDetail: function (item: TrackFields, index: number, {state}: PlaylistActionContext) {
    const {playlistId, api} = state;
    events.toDetailModal({
      item,
      index,
      api,
      playlistId,
    });
  },
  playMusic: function (item: TrackFields, t: number, a: PlaylistActionContext) {
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
      pid: playlistId ?? undefined,
    });
    a.collectPlaylistOrder();
  },
  savePic: function (img?: string, song?: string) {
    events.emitter.emit(names.SavePicModal, {
      img,
      song,
    });
  },
  onHeartMode: async function (page: PlaylistActionContext) {
    const {heartMode, playlist, playlistId, api} = page.state;
    if (heartMode !== true || !playlist.length) {
      return;
    }
    const song = playlist[utils.random.getInt(0, playlist.length)];
    const response = await services.Netease.heart_mode({
      songId: song.id!,
      playlistId: playlistId!,
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
  onSubscribe: function (e: TrackId, t: 'subscribe' | 'unsubscribe', a: Provider) {
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
