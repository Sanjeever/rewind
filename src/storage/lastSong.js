import {storage} from './index';
import keys from './keys';

export default {
  async get(api) {
    try {
      const songs = await storage.load({key: keys.lastPlayedSong});
      return songs[api];
    } catch (error) {
      if (error.name === 'NotFoundError') return false;
      throw error;
    }
  },
  async save(api, song) {
    if (!api) return;
    let songs;
    try {
      songs = await storage.load({key: keys.lastPlayedSong});
    } catch (error) {
      if (error.name !== 'NotFoundError') throw error;
      songs = {};
    }
    return storage.save({key: keys.lastPlayedSong, data: {...songs, [api]: song}});
  },
};
