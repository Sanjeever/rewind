const assert = require('node:assert/strict');

function screen(searchSongs) {
  const commands = [];
  const dependencies = {
    'react-native': {StyleSheet: {create: value => value}},
    '../components/Scrolling': {}, '../components': {}, '../components/Text': {},
    '../theme/constants': {}, '../services/search': {searchSongs},
    '../services/trackFields': {}, '../events': {},
    '../player/commands': {playTracks: value => commands.push(value)},
  };
  for (const [name, value] of Object.entries(dependencies)) jest.doMock(name, () => value);
  let Results;
  jest.isolateModules(() => { Results = require('./SongSearchResults.js').default; });
  const instance = new Results({search: '同一个关键词', api: 'netEase'});
  instance.setState = (update, callback) => {
    instance.state = {...instance.state, ...(typeof update === 'function' ? update(instance.state) : update)};
    callback?.();
  };
  return {instance, commands};
}

test('同词切换来源发起新搜索，旧请求晚到不会覆盖结果', async () => {
  const requests = [];
  const {instance} = screen(options => new Promise(resolve => requests.push({options, resolve})));
  const first = instance.search();
  const previous = instance.props;
  instance.props = {...previous, api: 'qqMusic'};
  instance.componentDidUpdate(previous);
  assert.equal(requests.length, 2);
  requests[1].resolve({tracks: [{key: 'qq:2'}], offset: 1, hasMore: false});
  await new Promise(resolve => setImmediate(resolve));
  requests[0].resolve({tracks: [{key: 'netease:1'}], offset: 1, hasMore: false});
  await first;
  assert.deepEqual(instance.state.tracks, [{key: 'qq:2'}]);
  assert.equal(instance.state.loading, false);
});

test('请求失败可重试，分页期间重复触底不并发请求，卸载丢弃响应', async () => {
  let count = 0;
  let complete;
  const {instance} = screen(async () => {
    count++;
    if (count === 1) throw new Error('网络失败');
    return new Promise(resolve => { complete = resolve; });
  });
  await instance.search();
  assert.match(instance.state.error.message, /网络失败/);
  const retry = instance.fetchPage();
  await instance.fetchPage();
  assert.equal(count, 2);
  instance.componentWillUnmount();
  complete({tracks: [{key: 'ignored'}], offset: 1, hasMore: false});
  await retry;
  assert.deepEqual(instance.state.tracks, []);
});

test('搜索结果发出显式播放命令，传递原始歌曲而不把展示结构写入队列', () => {
  const {instance, commands} = screen();
  const source = {id: 7};
  const track = {key: 'netEase:7', api: 'netEase', source};
  instance.state.tracks = [track];
  instance.play(track, 0);
  assert.deepEqual(commands, [{song: source, tracks: [source], index: 0, api: 'netEase', type: 'insert'}]);
});
