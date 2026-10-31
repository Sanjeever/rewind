import {jest} from '@jest/globals';
const document = {
  playlists: [{title: '原歌单', tracks: [{id: 1, name: '保留'}]}],
  legacy: {keep: true},
};
const save = jest.fn<(value: unknown) => Promise<void>>(async () => {});
const toast = jest.fn();
jest.unstable_mockModule('../../storage/playlistFiles', () => ({
  default: {getPlaylist: async () => document, toPlaylist: save},
}));
jest.unstable_mockModule('../../components/Text', () => ({default: undefined}));
jest.unstable_mockModule('../../components/Pager', () => ({default: undefined}));
jest.unstable_mockModule('../../components/index', () => ({}));
jest.unstable_mockModule('../../components/Scrolling', () => ({}));
jest.unstable_mockModule('../playlists/PlaylistTabs', () => ({default: undefined}));
jest.unstable_mockModule('../../modals/CreatePlaylist', () => ({default: undefined}));
jest.unstable_mockModule('../../native/toast', () => ({toast}));
jest.unstable_mockModule('../../theme/constants', () => ({}));
jest.unstable_mockModule('../../locales/index', () => ({default: {}}));
jest.unstable_mockModule('react-native', () => ({
  Animated: {Value: class {}},
  StyleSheet: {create: <T>(value: T) => value},
}));
const {default: Playlists} = await import('./Playlists');
test('创建与删除本地歌单保留文档未知字段，写入失败不改变页面列表', async () => {
  const page = new Playlists({
    apisOrder: ['custom'],
    netEase: [],
    qqMusic: [],
    navigation: {goBack() {}, navigate() {}},
    Playlist() {},
    onRefresh: async () => {},
  });
  page.setState = (update) => {
    page.state = {
      ...page.state,
      ...(typeof update === 'function' ? update(page.state, page.props) : update),
    };
  };
  await page.createPL({title: '新歌单', img: ''});
  expect(save).toHaveBeenLastCalledWith({
    ...document,
    playlists: [...document.playlists, {title: '新歌单', img: '', tracks: []}],
  });
  await page.deleteLocalPL(0);
  expect(save).toHaveBeenLastCalledWith({...document, playlists: []});
  const previous = page.state.custom;
  save.mockRejectedValue(new Error('无法写入'));
  await page.createPL({title: '不应出现', img: ''});
  expect(page.state.custom).toBe(previous);
  expect(toast).toHaveBeenCalledWith('创建歌单失败：无法写入');
  expect(document.playlists).toHaveLength(1);
});
