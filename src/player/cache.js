import {LRUCache} from 'lru-cache';
import providers from '../services/providers';

const cache = new LRUCache({max: 100});
export default request => async (...args) => {
  const [{song}, provider] = args;
  const key = provider + ':' + (provider === providers.qqMusic ? song.songmid || song.mid : String(song.id));
  const cached = cache.get(key);
  if (cached) return cached;
  const result = await request(...args);
  if (result) cache.set(key, result);
  return result;
};
