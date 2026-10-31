import {playTracks} from '../player/commands';
import {storage} from './index';
import keys from './keys';

import type {SavedQueue} from './models';

async function load() {
  try {
    return await storage.load<SavedQueue>({key: keys.lastPlayedTracks});
  } catch (error) {
    if (error instanceof Error && error.name === 'NotFoundError') return null;
    throw error;
  }
}

export default {
  save({tracks, index, api}: SavedQueue) {
    return storage.save({key: keys.lastPlayedTracks, data: {tracks, index, api}});
  },
  load,
  async emit() {
    const queue = await load();
    if (queue?.tracks?.[queue.index] && queue.api) {
      playTracks({
        song: queue.tracks[queue.index],
        tracks: queue.tracks,
        index: queue.index,
        api: queue.api,
        restore: true,
      });
    }
  },
};
