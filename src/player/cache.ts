import {LRUCache} from 'lru-cache';
import providers from '../services/providers';
import type {TrackFields} from '../services/track';
import type {Provider} from '../services/providers';
type RequestArgs = [{song: TrackFields}, Provider, boolean?];

const cache = new LRUCache<string, string>({max: 100});
export default (request: (...args: RequestArgs) => Promise<string>) =>
  async (...args: RequestArgs) => {
    const [{song}, provider] = args;
    const key =
      provider +
      ':' +
      (provider === providers.qqMusic ? song.songmid || song.mid : String(song.id));
    const cached = cache.get(key);
    if (cached) return cached;
    const result = await request(...args);
    if (result) cache.set(key, result);
    return result;
  };
