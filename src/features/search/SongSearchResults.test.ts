import {jest} from '@jest/globals';
import assert from 'node:assert/strict';
import type {SearchOptions, SearchPage} from '../../services/search';
import type {PlayTracks} from '../../player/commands';
import type {DisplayTrack} from '../../services/track';
const fixture = (key: string): DisplayTrack => ({
  key,
  api: 'netEase',
  title: '歌曲',
  artists: [],
  album: '',
  artwork: 'https://cover',
  duration: null,
  source: {id: key},
});
async function screen(
  searchSongs: (options: SearchOptions) => Promise<SearchPage> = async () => ({
    tracks: [],
    offset: 0,
    hasMore: false,
  }),
) {
  jest.resetModules();
  const commands: PlayTracks[] = [];
  const dependencies = {
    'react-native': {
      StyleSheet: {
        create: <T>(value: T) => value,
      },
      View: undefined,
    },
    '../../components/Scrolling': {
      LargeList: undefined,
    },
    '../../components': {
      SongRow: undefined,
      Spinkit: undefined,
      TextButton: undefined,
    },
    '../../components/Text': {},
    '../../theme/constants': {
      ITEM_HEIGHT: undefined,
    },
    '../../services/search': {
      searchSongs,
    },
    '../../services/trackFields': {
      getAlias: undefined,
    },
    '../../events': {
      toDetailModal: undefined,
    },
    '../../player/commands': {
      playTracks: (value: PlayTracks) => commands.push(value),
      insertTracks: undefined,
    },
  };
  for (const [name, value] of Object.entries(dependencies))
    jest.unstable_mockModule(name, () => ({
      default: value,
      ...value,
    }));
  let Results!: typeof import('./SongSearchResults').default;
  await jest.isolateModulesAsync(async () => {
    Results = (await import('./SongSearchResults')).default;
  });
  const instance = new Results({
    search: '同一个关键词',
    api: 'netEase',
  });
  instance.setState = (update, callback) => {
    instance.state = {
      ...instance.state,
      ...(typeof update === 'function' ? update(instance.state, instance.props) : update),
    };
    callback?.();
  };
  return {
    instance,
    commands,
  };
}
test('同词切换来源发起新搜索，旧请求晚到不会覆盖结果', async () => {
  const requests: {options: SearchOptions; resolve(value: SearchPage): void}[] = [];
  const {instance} = await screen(
    (options) =>
      new Promise<SearchPage>((resolve) =>
        requests.push({
          options,
          resolve,
        }),
      ),
  );
  const first = instance.search();
  const previous = instance.props;
  Object.assign(instance, {
    props: {
      ...previous,
      api: 'qqMusic',
    },
  });
  instance.componentDidUpdate(previous);
  assert.equal(requests.length, 2);
  requests[1].resolve({
    tracks: [fixture('qq:2')],
    offset: 1,
    hasMore: false,
  });
  await new Promise((resolve) => setImmediate(resolve));
  requests[0].resolve({
    tracks: [fixture('netease:1')],
    offset: 1,
    hasMore: false,
  });
  await first;
  assert.deepEqual(instance.state.tracks, [fixture('qq:2')]);
  assert.equal(instance.state.loading, false);
});
test('请求失败可重试，分页期间重复触底不并发请求，卸载丢弃响应', async () => {
  let count = 0;
  let complete!: (value: SearchPage) => void;
  const {instance} = await screen(async () => {
    count++;
    if (count === 1) throw new Error('网络失败');
    return new Promise<SearchPage>((resolve) => {
      complete = resolve;
    });
  });
  await instance.search();
  assert.ok(instance.state.error);
  assert.match(instance.state.error.message, /网络失败/);
  const retry = instance.fetchPage();
  await instance.fetchPage();
  assert.equal(count, 2);
  instance.componentWillUnmount();
  complete({
    tracks: [fixture('ignored')],
    offset: 1,
    hasMore: false,
  });
  await retry;
  assert.deepEqual(instance.state.tracks, []);
});
test('搜索结果发出显式播放命令，传递原始歌曲而不把展示结构写入队列', async () => {
  const {instance, commands} = await screen();
  const source = {
    id: 7,
  };
  const track: DisplayTrack = {
    ...fixture('netEase:7'),
    key: 'netEase:7',
    api: 'netEase',
    source,
  };
  instance.state.tracks = [track];
  instance.play(track, 0);
  assert.deepEqual(commands, [
    {
      song: source,
      tracks: [source],
      index: 0,
      api: 'netEase',
      type: 'insert',
    },
  ]);
});
