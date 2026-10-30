import {storage} from './index';
import providers from '../services/providers';
import keys from './keys';

let writes = Promise.resolve();
function update(key, empty, transform) {
  const write = async () => {
    let value;
    try { value = await storage.load({key}); }
    catch (error) {
      if (error.name !== 'NotFoundError') throw error;
      value = empty;
    }
    await storage.save({key, data: transform(value)});
  };
  writes = writes.then(write, write);
  return writes;
}

export function cleanedData(tracks, song, api) {
  const identity = item => api === providers.qqMusic ? item.songmid || item.mid : api === providers.local ? item.path : item.id;
  return [song, ...tracks.filter(item => identity(item) !== identity(song))];
}

export function musicHistory(song, api) {
  if (!song) return Promise.resolve();
  return update(keys.musicHistory, {netEase: [], qqMusic: [], local: []}, previous => ({
    ...previous,
    [api]: cleanedData(previous[api] || [], song, api),
  }));
}

export function searchHistory(text, api) {
  return update(keys.searchHistory, [], previous => [{text, api}, ...previous.filter(item => item.text !== text)]);
}
