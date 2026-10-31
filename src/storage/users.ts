import {storage} from './index';
import providers from '../services/providers';
import keys from './keys';
import type {Provider} from '../services/providers';
import type {TrackFields, TrackId} from '../services/track';
import type {
  Accounts,
  NeteaseAccount,
  QQProfile,
  Playlist,
  ProviderPlaylists,
  PlaylistCache,
} from './models';
import type {defaultSettings} from '../settings/defaults';

async function read<T extends object>(key: string): Promise<T | null> {
  try {
    const value: unknown = await storage.load<unknown>({key});
    if (!value || typeof value !== 'object') throw new Error('存储数据格式无效：' + key);
    return value as T;
  } catch (error) {
    if (error instanceof Error && error.name === 'NotFoundError') return null;
    throw error;
  }
}

let writes = Promise.resolve();
function saveProvider(key: string, api: Provider, data: unknown) {
  const write = async () => {
    const current: Partial<Record<Provider, unknown>> = {
      ...(await read<Partial<Record<Provider, unknown>>>(key)),
    };
    if (data === undefined) delete current[api];
    else current[api] = data;
    await storage.save({key, data: current});
  };
  writes = writes.then(write, write);
  return writes;
}

export default {
  removeProvider: (key: string, api: Provider) => saveProvider(key, api, undefined),
  getUserInfo: () => read<Accounts>(keys.userInfo),
  getUserPlayList: () => read<ProviderPlaylists>(keys.playlist),
  async saveUserStorage(info: NeteaseAccount & QQProfile, api: Provider) {
    let account;
    if (api === providers.netEase)
      account = {
        userId: info.userId,
        avatarUrl: info.avatarUrl,
        nickname: info.nickname,
        signature: info.signature,
      };
    else if (api === providers.qqMusic)
      account = {
        userId: info.uin,
        avatarUrl: info.headpic,
        nickname: info.nick,
        cookies: info.cookies,
      };
    else throw new Error('未知账号来源：' + api);
    return saveProvider(keys.userInfo, api, account);
  },
  saveUserPlayList: (playlists: Playlist[], api: Provider) =>
    saveProvider(keys.playlist, api, playlists),
  saveUserLikeList: (list: TrackId[], api: Provider) => saveProvider(keys.likelist, api, list),
  async saveNeteasePlayListCache(id: TrackId, name: string, tracks: TrackFields[]) {
    const stored = await read<PlaylistCache[]>(keys.netEasePlaylistCache);
    if (stored !== null && !Array.isArray(stored)) throw new Error('歌单缓存格式无效');
    const entries = stored === null ? [] : stored.filter((item) => item.id !== id);
    if (entries.length > 64) entries.splice(0, 32);
    entries.push({tracks, name, id});
    return storage.save({key: keys.netEasePlaylistCache, data: entries});
  },
  async removeNetEasePlaylistCache(id?: TrackId) {
    if (!id) {
      const playlists = await read<ProviderPlaylists>(keys.playlist);
      if (!playlists?.netEase?.length) return;
      id = playlists.netEase[0].id;
    }
    const entries = await read<PlaylistCache[]>(keys.netEasePlaylistCache);
    if (entries === null) return;
    if (!Array.isArray(entries)) throw new Error('歌单缓存格式无效');
    return storage.save({
      key: keys.netEasePlaylistCache,
      data: entries.filter((item) => item.id !== id),
    });
  },
  getSettings: () => read<typeof defaultSettings>(keys.settings),
  getCharts: () => read<Playlist[]>(keys.charts),
  saveCharts: (data: Playlist[]) => storage.save({key: keys.charts, data}),
  getRestUsers: () => read<NeteaseAccount[]>(keys.restUsers),
  saveRestUsers: (data: NeteaseAccount[]) => storage.save({key: keys.restUsers, data}),
};
