import {jest} from '@jest/globals';
import type Actions from '../features/playlists/actions';
const heart = jest.fn<typeof Actions.onHeartMode>();
const subscribe = jest.fn<typeof Actions.onSubscribe>();
const toast = jest.fn();
const loadCached = jest.fn<() => Promise<{id: number; name: string; tracks: {id: number}[]}[]>>();
const loadPlaylist = jest.fn<typeof Actions.getFromNetease>();
jest.unstable_mockModule('../features/playlists/actions', () => ({
  default: {onHeartMode: heart, onSubscribe: subscribe, getFromNetease: loadPlaylist},
}));
jest.unstable_mockModule('../player/commands', () => ({
  subscribePlaybackEvent: () => ({remove() {}}),
}));
jest.unstable_mockModule('../components/index', () => ({}));
jest.unstable_mockModule('../components/Scrolling', () => ({}));
jest.unstable_mockModule('../features/tracks/SongRow', () => ({default: undefined}));
jest.unstable_mockModule('../features/playlists/PlaylistForeground', () => ({default: undefined}));
jest.unstable_mockModule('../features/playlists/PlaylistTabs', () => ({default: undefined}));
jest.unstable_mockModule('../modals/index', () => ({}));
jest.unstable_mockModule('../utils/index', () => ({}));
jest.unstable_mockModule('../native/toast', () => ({toast}));
jest.unstable_mockModule('../native/mediaStore', () => ({
  default: {attachLocalPath: async (tracks: object[]) => tracks},
}));
jest.unstable_mockModule('../storage/lastSong', () => ({default: {get: async () => null}}));
jest.unstable_mockModule('../storage/index', () => ({storage: {load: loadCached}}));
jest.unstable_mockModule('../components/Text', () => ({default: undefined}));
jest.unstable_mockModule('@react-native-clipboard/clipboard', () => ({default: {}}));
jest.unstable_mockModule('../theme/constants', () => ({DEVICE_WIDTH: 400, ITEM_HEIGHT: 70}));
jest.unstable_mockModule('../locales/index', () => ({default: {}}));
jest.unstable_mockModule('react-native', () => ({
  Animated: {Value: class {}},
  StyleSheet: {create: <T>(value: T) => value},
}));
const {default: Playlist} = await import('./Playlist');
function createPage() {
  const page = new Playlist({
    route: {key: 'playlist', name: 'Playlist', params: {api: 'netEase', playlist: {id: 42}}},
    navigation: {goBack() {}, navigate() {}},
  });
  page.active = true;
  page.state = {...page.state, playlist: [{id: 1}], playlistId: 42};
  page.setState = (update) => {
    page.state = {
      ...page.state,
      ...(typeof update === 'function' ? update(page.state, page.props) : update),
    };
  };
  return page;
}
beforeEach(() => {
  heart.mockReset();
  subscribe.mockReset();
  toast.mockClear();
});

test('歌单缓存保留已知歌曲数，网络新内容不被迟到缓存覆盖', async () => {
  const page = createPage();
  page.state = {...page.state, trackCount: 800};
  loadCached.mockResolvedValueOnce([{id: 42, name: '缓存', tracks: [{id: 1}]}]);
  page.netEaseStorageList(42);
  await Promise.resolve();
  expect(page.state.trackCount).toBe(800);
  let finish!: (value: {id: number; name: string; tracks: {id: number}[]}[]) => void;
  loadCached.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  page.netEaseStorageList(42);
  loadPlaylist.mockResolvedValueOnce({
    id: 42,
    name: '网络',
    tracks: [{id: 2}],
    trackCount: 801,
    moreFunc: undefined,
  });
  await page.switchNetease({api: 'netEase', playlist: {id: 42}});
  finish([{id: 42, name: '迟到缓存', tracks: [{id: 1}]}]);
  await Promise.resolve();
  expect(page.state).toMatchObject({name: '网络', trackCount: 801, playlist: [{id: 2}]});
});

test('刷新失败保留原列表和错误，首次失败结束加载', async () => {
  const page = createPage();
  loadPlaylist.mockRejectedValue(new Error('网络不可用'));
  await page.switchNetease({api: 'netEase', playlist: {id: 42}});
  expect(page.state).toMatchObject({playlist: [{id: 1}], loading: false, loadError: '网络不可用'});
  page.state = {...page.state, playlist: []};
  await page.switchNetease({api: 'netEase', playlist: {id: 42}});
  expect(page.state.loading).toBe(false);
});
test('心动等待时显示状态且重复点击共用一次请求，离开页面使结果失效', async () => {
  const page = createPage();
  let finish!: () => void;
  heart.mockImplementation(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
  );
  const pending = page.onHeartMode();
  await page.onHeartMode();
  expect(page.state.heartPending).toBe(true);
  expect(heart).toHaveBeenCalledTimes(1);
  const isCurrent = heart.mock.calls[0][1]!;
  expect(isCurrent()).toBe(true);
  page.active = false;
  expect(isCurrent()).toBe(false);
  finish();
  await pending;
});
test('收藏等待结束后恢复按钮，失败保留原收藏状态和原因', async () => {
  const page = createPage();
  let reject!: (error: Error) => void;
  subscribe.mockImplementation(
    () =>
      new Promise((_, fail) => {
        reject = fail;
      }),
  );
  const pending = page.onSubscribe(42);
  await page.onSubscribe(42);
  expect(subscribe).toHaveBeenCalledTimes(1);
  expect(page.state.subscribePending).toBe(true);
  const previous = page.state.subscribed;
  reject(new Error('收藏被拒绝'));
  await pending;
  expect(page.state.subscribePending).toBe(false);
  expect(page.state.subscribed).toBe(previous);
  expect(toast).toHaveBeenCalledWith('收藏被拒绝');
});
