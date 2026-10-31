const assert = require('node:assert/strict');

function suggestions(storage = {load: async () => [], remove: async () => {}}) {
  const requests = [];
  const request = (api) => new Promise((resolve, reject) => requests.push({api, resolve, reject}));
  const dependencies = {
    'react-native': {StyleSheet: {create: (value) => value}},
    'lodash/debounce': (callback) => Object.assign(callback, {cancel() {}}),
    '../components/FadingEdge': {},
    '../components/Scrolling': {},
    '../components': {},
    '../components/Text': {},
    '../theme/constants': {},
    '../theme/icons': {},
    '../storage': {storage},
    '../storage/keys': {},
    '../services': {
      Netease: {search_suggest: () => request('netEase')},
      QQMusic: {search_suggest: () => request('qqMusic')},
    },
    '../screens/search/sections': {
      SECTION_KEYS: {songs: 'songs', artists: 'artists', albums: 'albums', history: 'history'},
    },
  };
  for (const [name, value] of Object.entries(dependencies)) jest.doMock(name, () => value);
  let Suggestions;
  jest.isolateModules(() => {
    Suggestions = require('./SearchSuggestions.js').default;
  });
  const component = new Suggestions({
    query: '关键词',
    api: 'netEase',
    focusing: true,
    historyVersion: 0,
  });
  component.setState = (update) => {
    component.state = {...component.state, ...update};
  };
  return {component, requests};
}

const tick = () => new Promise((resolve) => setImmediate(resolve));

test('搜索建议切换来源后丢弃旧响应，清空输入和卸载也不会恢复旧建议', async () => {
  const {component, requests} = suggestions();
  component.componentDidMount();
  const previous = component.props;
  component.props = {...previous, api: 'qqMusic'};
  component.componentDidUpdate(previous);
  requests[1].resolve({code: 0, data: {song: {itemlist: [{name: 'QQ 建议'}]}}});
  requests[0].resolve({code: 200, result: {songs: [{name: '旧建议'}]}});
  await tick();
  assert.deepEqual(component.state.songs, [{name: 'QQ 建议'}]);
  const beforeClear = component.props;
  component.props = {...beforeClear, query: ''};
  component.componentDidUpdate(beforeClear);
  assert.deepEqual(component.state.songs, []);
  const beforeNext = component.props;
  component.props = {...beforeNext, query: '新词'};
  component.componentDidUpdate(beforeNext);
  component.componentWillUnmount();
  requests[2].resolve({code: 0, data: {song: {itemlist: [{name: '迟到建议'}]}}});
  await tick();
  assert.deepEqual(component.state.songs, []);
});

test('搜索建议错误保留可见原因，网易云歌手字段正确展示', async () => {
  const {component, requests} = suggestions();
  component.componentDidMount();
  requests[0].reject(new Error('网络断开'));
  await tick();
  assert.match(component.state.error.message, /网络断开/);
  assert.equal(
    component.formatSuggestion({name: '歌曲', artists: [{name: '歌手'}]}, 'songs').subName,
    '歌手',
  );
  component.componentWillUnmount();
});

test('清空历史成功后，较早读取返回不会恢复已删除的历史', async () => {
  let finishRead;
  const {component} = suggestions({
    load: () =>
      new Promise((resolve) => {
        finishRead = resolve;
      }),
    remove: async () => {},
  });
  component.mounted = true;
  const loading = component.loadHistory();
  await component.clearHistory();
  finishRead([{text: '旧历史'}]);
  await loading;
  assert.deepEqual(component.state.history, []);
});
