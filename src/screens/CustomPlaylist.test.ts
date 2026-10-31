import {jest} from '@jest/globals';
import type {TrackFields} from '../services/track';
const tracks: TrackFields[] = [
  {id: 1, api: 'netEase', name: '网易'},
  {id: 1, api: 'qqMusic', name: 'QQ'},
  {id: 1, api: 'local', path: 'content://one', title: '本地'},
];
const document = {playlists: [{title: '混合', tracks}], legacy: '保留'};
const saved: unknown[] = [];
jest.unstable_mockModule('../storage/playlistFiles', () => ({
  default: {
    getPlaylist: async () => document,
    toPlaylist: async (value: unknown) => {
      saved.push(value);
    },
  },
}));
jest.unstable_mockModule('../native/toast', () => ({toast() {}}));
jest.unstable_mockModule('../components/Text', () => ({default: undefined}));
jest.unstable_mockModule('../components/index', () => ({}));
jest.unstable_mockModule('../features/playlists/PlaylistForeground', () => ({default: undefined}));
jest.unstable_mockModule('../components/Scrolling', () => ({}));
jest.unstable_mockModule('../modals/index', () => ({}));
jest.unstable_mockModule('../theme/constants', () => ({DEVICE_WIDTH: 400}));
jest.unstable_mockModule('../locales/index', () => ({default: {}}));
jest.unstable_mockModule('../utils/index', () => ({}));
jest.unstable_mockModule('react-native', () => ({
  Animated: {Value: class {}},
  StyleSheet: {create: <T>(value: T) => value},
}));
const {default: CustomPlaylist} = await import('./CustomPlaylist');
test('本地混合歌单按来源身份删除，保留其它来源相同 ID 与未知文档字段', async () => {
  const page = new CustomPlaylist({
    route: {
      key: 'custom',
      name: 'CustomPlaylist',
      params: {playlist: document.playlists[0], index: 0},
    },
    navigation: {goBack() {}, navigate() {}},
  });
  page.setState = (update) => {
    page.state = {
      ...page.state,
      ...(typeof update === 'function' ? update(page.state, page.props) : update),
    };
  };
  page.componentDidMount();
  await page.onDeleteCustom([tracks[0]]);
  expect(page.state.playlist).toEqual([tracks[1], tracks[2]]);
  expect(saved).toEqual([
    {playlists: [{title: '混合', tracks: [tracks[1], tracks[2]]}], legacy: '保留'},
  ]);
  expect(document.playlists[0].tracks).toHaveLength(3);
});
