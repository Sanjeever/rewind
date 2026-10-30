import {storage} from './index';
import providers from '../services/providers';
import keys from './keys';

async function read(key) {
  try {
    const value = await storage.load({key});
    if (!value || typeof value !== 'object') throw new Error('存储数据格式无效：' + key);
    return value;
  } catch (error) {
    if (error.name === 'NotFoundError') return null;
    throw error;
  }
}

let writes = Promise.resolve();
function saveProvider(key, api, data) {
  const write = async () => {
    const current = {...await read(key)};
    if (data === undefined) delete current[api];
    else current[api] = data;
    await storage.save({key, data: current});
  };
  writes = writes.then(write, write);
  return writes;
}

export default {
  removeProvider: (key, api) => saveProvider(key, api, undefined),
  getUserInfo: () => read(keys.userInfo),
  getUserPlayList: () => read(keys.playlist),
  async saveUserStorage(info, api) {
    let account;
    if (api === providers.netEase) account = {userId: info.userId, avatarUrl: info.avatarUrl, nickname: info.nickname, signature: info.signature};
    else if (api === providers.qqMusic) account = {userId: info.uin, avatarUrl: info.headpic, nickname: info.nick, cookies: info.cookies};
    else throw new Error('未知账号来源：' + api);
    return saveProvider(keys.userInfo, api, account);
  },
  saveUserPlayList: (playlists, api) => saveProvider(keys.playlist, api, playlists),
  saveUserLikeList: (list, api) => saveProvider(keys.likelist, api, list),
  async saveNeteasePlayListCache(id, name, tracks) {
    const stored = await read(keys.netEasePlaylistCache);
    if (stored !== null && !Array.isArray(stored)) throw new Error('歌单缓存格式无效');
    const entries = stored === null ? [] : stored.filter(item => item.id !== id);
    if (entries.length > 64) entries.splice(0, 32);
    entries.push({tracks, name, id});
    return storage.save({key: keys.netEasePlaylistCache, data: entries});
  },
  async removeNetEasePlaylistCache(id) {
    if (!id) {
      const playlists = await read(keys.playlist);
      if (!playlists?.netEase?.length) return;
      id = playlists.netEase[0].id;
    }
    const entries = await read(keys.netEasePlaylistCache);
    if (entries === null) return;
    if (!Array.isArray(entries)) throw new Error('歌单缓存格式无效');
    return storage.save({key: keys.netEasePlaylistCache, data: entries.filter(item => item.id !== id)});
  },
  getSettings: () => read(keys.settings),
  getCharts: () => read(keys.charts),
  saveCharts: data => storage.save({key: keys.charts, data}),
  getRestUsers: () => read(keys.restUsers),
  saveRestUsers: data => storage.save({key: keys.restUsers, data}),
};
