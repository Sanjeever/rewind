import {jest} from '@jest/globals';
jest.unstable_mockModule('react-native', () => ({
  Animated: {Value: class {}},
  StyleSheet: {create: <T>(value: T) => value},
}));
jest.unstable_mockModule('../components/index', () => ({}));
jest.unstable_mockModule('../features/tracks/SongRow', () => ({default: undefined}));
jest.unstable_mockModule('../components/Text', () => ({default: undefined}));
jest.unstable_mockModule('../native/toast', () => ({toast() {}}));
jest.unstable_mockModule('@react-native-clipboard/clipboard', () => ({default: {}}));
jest.unstable_mockModule('../theme/constants', () => ({DEVICE_WIDTH: 400}));
jest.unstable_mockModule('../locales/index', () => ({default: {}}));
jest.unstable_mockModule('../services/index', () => ({}));
jest.unstable_mockModule('../events/index', () => ({}));
jest.unstable_mockModule('../utils/index', () => ({}));
jest.unstable_mockModule('../events/queue', () => ({default: {}}));
jest.unstable_mockModule('../features/tracks/OverflowMenu', () => ({default: undefined}));
jest.unstable_mockModule('./album/Description', () => ({default: undefined}));
const {default: AlbumPage} = await import('./AlbumPage');
test('专辑总时长分别读取网易云毫秒与 QQ 秒数', () => {
  const page = new AlbumPage({
    route: {key: 'album', name: 'AlbumPage', params: {item: {id: 1}, api: 'qqMusic'}},
    navigation: {goBack() {}, navigate() {}},
  });
  page.state = {...page.state, api: 'qqMusic'};
  expect(page.getDurationSum([{interval: 120}, {interval: 65}])).toBe(185);
  page.state = {...page.state, api: 'netEase'};
  expect(page.getDurationSum([{duration: 9000}, {duration: 1000}])).toBe(10);
});
