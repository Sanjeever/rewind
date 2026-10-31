import {storage} from './index';
import keys from './keys';
import type {Provider} from '../services/providers';
import type {TrackFields} from '../services/track';
type LastSongs = Partial<Record<Provider, TrackFields>>;

export default {
  async get(api: Provider) {
    try {
      const songs = await storage.load<LastSongs>({key: keys.lastPlayedSong});
      return songs[api];
    } catch (error) {
      if (error instanceof Error && error.name === 'NotFoundError') return false;
      throw error;
    }
  },
  async save(api: Provider | null, song: TrackFields) {
    if (!api) return;
    let songs: LastSongs;
    try {
      songs = await storage.load<LastSongs>({key: keys.lastPlayedSong});
    } catch (error) {
      if (!(error instanceof Error && error.name === 'NotFoundError')) throw error;
      songs = {};
    }
    return storage.save({key: keys.lastPlayedSong, data: {...songs, [api]: song}});
  },
};
