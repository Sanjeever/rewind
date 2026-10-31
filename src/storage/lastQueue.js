import {storage} from './index';
import keys from './keys';
import {toPlayer} from '../events';

async function load() {
  try {
    return await storage.load({key: keys.lastPlayedTracks});
  } catch (error) {
    if (error.name === 'NotFoundError') return null;
    throw error;
  }
}

export default {
  save({tracks, index, api}) {
    return storage.save({key: keys.lastPlayedTracks, data: {tracks, index, api}});
  },
  load,
  async emit() {
    const queue = await load();
    if (queue?.tracks?.[queue.index] && queue.api) {
      toPlayer({
        item: queue.tracks[queue.index],
        data: queue.tracks,
        index: queue.index,
        api: queue.api,
      });
    }
  },
};
