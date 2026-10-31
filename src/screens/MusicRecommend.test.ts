import {jest} from '@jest/globals';
const dislike = jest.fn<() => Promise<unknown>>();
const toast = jest.fn();
jest.unstable_mockModule('../services/index', () => ({Netease: {recommend_dislike: dislike}}));
jest.unstable_mockModule('../native/toast', () => ({toast}));
jest.unstable_mockModule('../components/index', () => ({}));
jest.unstable_mockModule('../features/tracks/SongRow', () => ({default: undefined}));
jest.unstable_mockModule('../components/Scrolling', () => ({}));
jest.unstable_mockModule('../native/TabbedViewPager', () => ({default: undefined}));
jest.unstable_mockModule('../locales/index', () => ({default: {ERROR: '失败'}}));
jest.unstable_mockModule('../utils/index', () => ({}));
jest.unstable_mockModule('../events/index', () => ({}));
jest.unstable_mockModule('react-native', () => ({}));
const {default: Recommend} = await import('./MusicRecommend');
test('不感兴趣请求失败保留原歌曲，成功后才替换，卸载使迟到响应失效', async () => {
  const page = new Recommend({
    navigation: {navigate() {}, goBack() {}},
    route: {key: 'recommend', name: 'MusicRecommend'},
  });
  page.setState = (update) => {
    page.state = {
      ...page.state,
      ...(typeof update === 'function' ? update(page.state, page.props) : update),
    };
  };
  const song = {id: 1, name: '原歌曲'};
  page.state = {...page.state, data: [song]};
  dislike.mockRejectedValue(new Error('请求被拒绝'));
  await page.onDisklikeSong(song, 0);
  expect(page.state.data).toEqual([song]);
  expect(toast).toHaveBeenCalledWith('请求被拒绝');
  dislike.mockResolvedValue({code: 200, data: {id: 2, name: '替换'}});
  await page.onDisklikeSong(song, 0);
  expect(page.state.data).toEqual([{id: 2, name: '替换'}]);
  const current = page.state.data[0];
  let resolve!: (value: unknown) => void;
  dislike.mockImplementation(
    () =>
      new Promise((done) => {
        resolve = done;
      }),
  );
  const pending = page.onDisklikeSong(current, 0);
  page.componentWillUnmount();
  resolve({code: 200, data: {id: 3, name: '迟到'}});
  await pending;
  expect(page.state.data).toEqual([current]);
});
