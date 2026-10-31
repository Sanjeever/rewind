import {jest} from '@jest/globals';
const open = jest.fn();
jest.unstable_mockModule('../../modals/commands', () => ({showTrackActions: open}));
jest.unstable_mockModule('../../components/Text', () => ({default: undefined}));
jest.unstable_mockModule('../../components/TouchableScale', () => ({default: undefined}));
jest.unstable_mockModule('../../components/Icon', () => ({default: undefined}));
jest.unstable_mockModule('../../utils/index', () => ({}));
jest.unstable_mockModule('../../theme/constants', () => ({
  ITEM_HEIGHT: 70,
  COLORS: {primaryAlpha70: '#aaa', primaryAlpha10: '#333'},
}));
jest.unstable_mockModule('react-native-animatable', () => ({}));
jest.unstable_mockModule('react-native', () => ({StyleSheet: {create: <T>(value: T) => value}}));
const {default: SongRow} = await import('./SongRow');
test('歌曲行执行页面提供的长按操作，其余歌曲沿用详情长按入口', () => {
  const onLongPress = jest.fn();
  const song = {id: 1};
  new SongRow({songItem: song, onLongPress}).onLongPress();
  expect(onLongPress).toHaveBeenCalledTimes(1);
  expect(open).not.toHaveBeenCalled();
  new SongRow({songItem: song}).onLongPress();
  expect(open).toHaveBeenCalledWith({item: song});
});
