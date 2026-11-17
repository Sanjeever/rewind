import {jest} from '@jest/globals';
import type Actions from '../features/playlists/actions';
const heart = jest.fn<typeof Actions.onHeartMode>();
const subscribe = jest.fn<typeof Actions.onSubscribe>();
const toast = jest.fn();
jest.unstable_mockModule('../features/playlists/actions', () => ({
  default: {onHeartMode: heart, onSubscribe: subscribe},
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
jest.unstable_mockModule('../storage/index', () => ({storage: {}}));
jest.unstable_mockModule('@react-native-clipboard/clipboard', () => ({default: {}}));
jest.unstable_mockModule('../theme/constants', () => ({DEVICE_WIDTH: 400}));
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
