import {produce} from 'immer';
import providers from '../services/providers';
import {swap} from '../utils';
import users from './users';

function samePlaylist(api, next, previous) {
  if (api === providers.netEase) return next.id === previous.id;
  if (api === providers.qqMusic) return (next.id || next.dissid) === (previous.id || previous.dissid);
  return false;
}

async function ordered({api, newArr}) {
  const stored = await users.getUserPlayList();
  const previous = stored?.[api];
  if (!Array.isArray(previous) || !previous.length || previous.length !== newArr.length) return newArr;
  return previous.map(item => newArr.find(next => samePlaylist(api, next, item)) || item);
}

export default {
  async collect({api, playlist, index}) {
    if (!index || !playlist || !Array.isArray(playlist[api])) return;
    const result = produce(playlist[api], draft => { swap(draft, index, 1); });
    await users.saveUserPlayList(result, api);
    return result;
  },
  newOrder({api, newArr, on = true}) {
    return on === false ? Promise.resolve(newArr) : ordered({api, newArr});
  },
  async collectCharts({list, index}) {
    if (Array.isArray(list)) await users.saveCharts(produce(list, draft => { swap(draft, index, 0); }));
  },
};
