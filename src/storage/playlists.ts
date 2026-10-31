import {produce} from 'immer';
import providers from '../services/providers';
import {swap} from '../utils';
import users from './users';
import type {Provider} from '../services/providers';
import type {Playlist, ProviderPlaylists} from './models';
type OrderOptions = {api: Provider; newArr: Playlist[]; on?: boolean};

function samePlaylist(api: Provider, next: Playlist, previous: Playlist) {
  if (api === providers.netEase) return next.id === previous.id;
  if (api === providers.qqMusic)
    return (next.id || next.dissid) === (previous.id || previous.dissid);
  return false;
}

async function ordered({api, newArr}: OrderOptions) {
  const stored = await users.getUserPlayList();
  const previous = stored?.[api];
  if (!Array.isArray(previous) || !previous.length || previous.length !== newArr.length)
    return newArr;
  return previous.map((item) => newArr.find((next) => samePlaylist(api, next, item)) || item);
}

export default {
  async collect({
    api,
    playlist,
    index,
  }: {
    api: Provider;
    playlist: ProviderPlaylists;
    index: number;
  }) {
    if (!index || !playlist || !Array.isArray(playlist[api])) return;
    const result = produce(playlist[api], (draft) => {
      swap(draft, index, 1);
    });
    await users.saveUserPlayList(result, api);
    return result;
  },
  newOrder({api, newArr, on = true}: OrderOptions) {
    return on === false ? Promise.resolve(newArr) : ordered({api, newArr});
  },
  async collectCharts({list, index}: {list: Playlist[]; index: number}) {
    if (Array.isArray(list))
      await users.saveCharts(
        produce(list, (draft) => {
          swap(draft, index, 0);
        }),
      );
  },
};
