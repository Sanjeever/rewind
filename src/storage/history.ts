import {storage} from './index';
import providers from '../services/providers';
import keys from './keys';
import type {Provider} from '../services/providers';
import type {TrackFields} from '../services/track';
import type {SearchHistoryEntry} from './models';

let writes = Promise.resolve();
function update<T>(key: string, empty: T, transform: (value: T) => T) {
  const write = async () => {
    let value;
    try {
      value = await storage.load<T>({key});
    } catch (error) {
      if (!(error instanceof Error && error.name === 'NotFoundError')) throw error;
      value = empty;
    }
    await storage.save({key, data: transform(value)});
  };
  writes = writes.then(write, write);
  return writes;
}

export function cleanedData<T extends TrackFields>(tracks: T[], song: T, api: Provider) {
  const identity = (item: T) =>
    api === providers.qqMusic
      ? item.songmid || item.mid
      : api === providers.local
        ? item.path
        : item.id;
  return [song, ...tracks.filter((item) => identity(item) !== identity(song))];
}

export function musicHistory(song: TrackFields | null, api: Provider) {
  if (!song) return Promise.resolve();
  return update<Partial<Record<Provider, TrackFields[]>>>(
    keys.musicHistory,
    {netEase: [], qqMusic: [], local: []},
    (previous) => ({
      ...previous,
      [api]: cleanedData(previous[api] || [], song, api),
    }),
  );
}

export function searchHistory(text: string, api: Provider) {
  return update<SearchHistoryEntry[]>(keys.searchHistory, [], (previous) => [
    {text, api},
    ...previous.filter((item) => item.text !== text),
  ]);
}
