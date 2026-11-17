import {jest} from '@jest/globals';
const songs = jest.fn<() => Promise<unknown>>();
const videos = jest.fn<() => Promise<unknown>>();
const Content = () => null;
const Spinner = () => null;
jest.unstable_mockModule('../services/index', () => ({
  Netease: {sub_new_songs: songs, sub_new_mv: videos},
}));
jest.unstable_mockModule('../components/index', () => ({
  PageContainer: Content,
  Spinkit: Spinner,
  Title: Content,
  ListItem: Content,
}));
jest.unstable_mockModule('../components/Scrolling', () => ({SpringScrollView: Content}));
jest.unstable_mockModule('../features/artists/ArtistHeader', () => ({default: Content}));
jest.unstable_mockModule('../player/videoActions', () => ({default: {}}));
jest.unstable_mockModule('../utils/index', () => ({
  timeFormatter: {isSameDay: () => true, localeString: () => '', parseTime: () => ''},
}));
jest.unstable_mockModule('../locales/index', () => ({default: {}}));
jest.unstable_mockModule('../theme/constants', () => ({COLORS: {primary: '#fff'}}));
jest.unstable_mockModule('react-native', () => ({
  View: Content,
  StyleSheet: {create: <T>(value: T) => value},
}));
const {default: SubNewSongs} = await import('./SubNewSongs');
function createPage() {
  const page = new SubNewSongs({
    route: {key: 'new', name: 'SubNewSongs'},
    navigation: {goBack() {}, navigate() {}},
  });
  page.setState = (update) => {
    page.state = {
      ...page.state,
      ...(typeof update === 'function' ? update(page.state, page.props) : update),
    };
  };
  return page;
}
test('关注新歌空结果结束加载，业务拒绝和网络失败显示原因', async () => {
  const page = createPage();
  songs.mockResolvedValue({code: 200, data: {newWorks: []}});
  await page.loadSongs();
  expect(page.state.songsLoaded).toBe(true);
  expect(page.state.songsError).toBeNull();
  songs.mockResolvedValue({code: 301});
  await page.loadSongs();
  expect(page.state.songsLoaded).toBe(true);
  expect(page.state.songsError).toContain('301');
  songs.mockRejectedValue(new Error('网络失败'));
  await page.loadSongs();
  expect(page.state.songsError).toBe('网络失败');
});
test('歌曲为空或仍在请求时，已完成的音画独立展示；卸载后忽略迟到响应', async () => {
  const page = createPage();
  videos.mockResolvedValue({code: 200, data: {newWorks: [{mvId: 1}]}});
  await page.loadMV();
  page.state = {...page.state, showingMV: true};
  expect(page.state.songsLoaded).toBe(false);
  expect(page.render().props.children.type).toBe(Content);
  let finish!: (value: unknown) => void;
  songs.mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  const pending = page.loadSongs();
  page.componentWillUnmount();
  const update = jest.fn();
  page.setState = update;
  finish({code: 200, data: {newWorks: []}});
  await pending;
  expect(update).not.toHaveBeenCalled();
});
