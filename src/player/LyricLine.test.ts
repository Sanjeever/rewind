import {jest} from '@jest/globals';
jest.unstable_mockModule('react-native', () => ({
  StyleSheet: {create: <T>(value: T) => value},
  FlatList: () => null,
}));
jest.unstable_mockModule('../components/Text', () => ({default: () => null}));
jest.unstable_mockModule('../theme/constants', () => ({DEVICE_WIDTH: 400, STATUS_BAR_HEIGHT: 0}));
jest.unstable_mockModule('../locales/index', () => ({default: {}}));
const {default: LyricLine} = await import('./LyricLine');
test('歌词说明行不发送无效跳转，带时间行保留半秒提前量', () => {
  const seekTo = jest.fn();
  const view = new LyricLine({
    lyric: [],
    currentTime: 0,
    getIndex: () => 0,
    showTrans: true,
    hasTrans: false,
    changeShowTrans() {},
    changeFontSize() {},
    fontSize: 15,
    seekTo,
    onTap() {},
    playState: 'paused',
    showTool: false,
  });
  const credit = view._renderItem({item: {txt: '翻译贡献者'}, index: 0});
  expect(credit.props.onPress).toBeUndefined();
  const line = view._renderItem({item: {txt: '歌词', total: 12}, index: 1});
  line.props.onPress?.();
  expect(seekTo).toHaveBeenCalledWith(11.5);
});
