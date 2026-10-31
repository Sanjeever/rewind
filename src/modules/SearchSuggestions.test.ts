import {jest} from '@jest/globals';
import assert from 'node:assert/strict';
import type {OnlineProvider} from '../services/providers';
import type {SearchHistoryEntry} from '../storage/models';
async function suggestions(
  storage: {load(): Promise<SearchHistoryEntry[]>; remove(): Promise<void>} = {
    load: async () => [],
    remove: async () => {},
  },
) {
  jest.resetModules();
  const requests: {
    api: OnlineProvider;
    resolve(value: unknown): void;
    reject(reason: Error): void;
  }[] = [];
  const request = (api: OnlineProvider) =>
    new Promise((resolve, reject) =>
      requests.push({
        api,
        resolve,
        reject,
      }),
    );
  const dependencies = {
    'react-native': {
      StyleSheet: {
        create: <T>(value: T) => value,
      },
      TouchableNativeFeedback: undefined,
      View: undefined,
    },
    'lodash/debounce': <T extends (...args: never[]) => unknown>(callback: T) =>
      Object.assign(callback, {
        cancel() {},
      }),
    '../components/FadingEdge': {},
    '../components/Scrolling': {
      SpringScrollView: undefined,
    },
    '../components': {
      Icon: undefined,
    },
    '../components/Text': {},
    '../theme/constants': {
      STATUS_BAR_HEIGHT: undefined,
    },
    '../theme/icons': {},
    '../storage': {
      storage,
    },
    '../storage/keys': {},
    '../services': {
      Netease: {
        search_suggest: () => request('netEase'),
      },
      QQMusic: {
        search_suggest: () => request('qqMusic'),
      },
    },
    '../screens/search/sections': {
      SECTION_KEYS: {
        songs: 'songs',
        artists: 'artists',
        albums: 'albums',
        history: 'history',
      },
      SECTIONS: undefined,
      SECTION_NAMES: undefined,
    },
  };
  for (const [name, value] of Object.entries(dependencies))
    jest.unstable_mockModule(name, () => ({
      default: value,
      ...value,
    }));
  let Suggestions!: typeof import('./SearchSuggestions').default;
  await jest.isolateModulesAsync(async () => {
    Suggestions = (await import('./SearchSuggestions')).default;
  });
  const component = new Suggestions({
    query: '关键词',
    api: 'netEase',
    focusing: true,
    historyVersion: 0,
    onSuggest() {},
  });
  component.setState = (update) => {
    component.state = {
      ...component.state,
      ...(typeof update === 'function' ? update(component.state, component.props) : update),
    };
  };
  return {
    component,
    requests,
  };
}
const tick = () => new Promise((resolve) => setImmediate(resolve));
test('搜索建议切换来源后丢弃旧响应，清空输入和卸载也不会恢复旧建议', async () => {
  const {component, requests} = await suggestions();
  component.componentDidMount();
  const previous = component.props;
  Object.assign(component, {
    props: {
      ...previous,
      api: 'qqMusic',
    },
  });
  component.componentDidUpdate(previous);
  requests[1].resolve({
    code: 0,
    data: {
      song: {
        itemlist: [
          {
            name: 'QQ 建议',
          },
        ],
      },
    },
  });
  requests[0].resolve({
    code: 200,
    result: {
      songs: [
        {
          name: '旧建议',
        },
      ],
    },
  });
  await tick();
  assert.deepEqual(component.state.songs, [
    {
      name: 'QQ 建议',
    },
  ]);
  const beforeClear = component.props;
  Object.assign(component, {
    props: {
      ...beforeClear,
      query: '',
    },
  });
  component.componentDidUpdate(beforeClear);
  assert.deepEqual(component.state.songs, []);
  const beforeNext = component.props;
  Object.assign(component, {
    props: {
      ...beforeNext,
      query: '新词',
    },
  });
  component.componentDidUpdate(beforeNext);
  component.componentWillUnmount();
  requests[2].resolve({
    code: 0,
    data: {
      song: {
        itemlist: [
          {
            name: '迟到建议',
          },
        ],
      },
    },
  });
  await tick();
  assert.deepEqual(component.state.songs, []);
});
test('搜索建议错误保留可见原因，网易云歌手字段正确展示', async () => {
  const {component, requests} = await suggestions();
  component.componentDidMount();
  requests[0].reject(new Error('网络断开'));
  await tick();
  assert.ok(component.state.error);
  assert.match(component.state.error.message, /网络断开/);
  assert.equal(
    component.formatSuggestion(
      {
        name: '歌曲',
        artists: [
          {
            name: '歌手',
          },
        ],
      },
      'songs',
    ).subName,
    '歌手',
  );
  component.componentWillUnmount();
});
test('清空历史成功后，较早读取返回不会恢复已删除的历史', async () => {
  let finishRead!: (value: SearchHistoryEntry[]) => void;
  const {component} = await suggestions({
    load: () =>
      new Promise((resolve) => {
        finishRead = resolve;
      }),
    remove: async () => {},
  });
  component.mounted = true;
  const loading = component.loadHistory();
  await component.clearHistory();
  finishRead([
    {
      text: '旧历史',
      api: 'netEase',
    },
  ]);
  await loading;
  assert.deepEqual(component.state.history, []);
});
