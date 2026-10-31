import {jest} from '@jest/globals';
import type {TrackFields} from '../services/track';
import type {PlayTracks} from '../player/commands';
const saved = jest.fn<(value: unknown) => Promise<void>>(async () => {});
const load = jest.fn<() => Promise<unknown>>();
const play = jest.fn<(value: PlayTracks) => void>();
const toast = jest.fn();
jest.unstable_mockModule('../storage/index', () => ({storage: {load, save: saved}}));
jest.unstable_mockModule('../storage', () => ({storage: {load, save: saved}}));
jest.unstable_mockModule('../components/index', () => ({}));
jest.unstable_mockModule('../components', () => ({
  Background: undefined,
  HeaderBar: undefined,
  Icon: undefined,
  SongRow: undefined,
  Title: undefined,
}));
jest.unstable_mockModule('../components/Text', () => ({default: undefined}));
jest.unstable_mockModule('../components/FadingEdge', () => ({default: undefined}));
jest.unstable_mockModule('../components/Scrolling', () => ({LargeList: undefined}));
jest.unstable_mockModule('../native/dimensions', () => ({default: {}}));
jest.unstable_mockModule('../native/mediaStore', () => ({
  default: {attachLocalPath: async (tracks: TrackFields[]) => tracks},
}));
jest.unstable_mockModule('../native/toast', () => ({toast}));
jest.unstable_mockModule('../theme/constants', () => ({ITEM_HEIGHT: 70, STATUS_BAR_HEIGHT: 24}));
jest.unstable_mockModule('../locales', () => ({default: {}}));
jest.unstable_mockModule('../locales/index', () => ({default: {}}));
jest.unstable_mockModule('../player/commands', () => ({playTracks: play, insertTracks() {}}));
jest.unstable_mockModule('react-native', () => ({
  Modal: undefined,
  TouchableOpacity: undefined,
  View: undefined,
  StyleSheet: {create: <T>(value: T) => value},
}));
const {default: History} = await import('./MusicHistory');
const {default: Selection} = await import('../modules/HistorySelection');
function createPage() {
  const page = new History({navigation: {goBack() {}}});
  page.setState = (update, callback) => {
    page.state = {
      ...page.state,
      ...(typeof update === 'function' ? update(page.state, page.props) : update),
    };
    callback?.();
  };
  return page;
}
beforeEach(() => {
  saved.mockClear();
  toast.mockClear();
});
test('历史播放使用重排后的完整队列，保存保留未知字段', async () => {
  const tracks = [
    {id: 1, name: '一'},
    {id: 2, name: '二'},
  ];
  load.mockResolvedValue({netEase: tracks, legacy: {keep: true}});
  const page = createPage();
  await page.loadHistory();
  page.playMusic(tracks[1], 1, 'netEase');
  expect(play).toHaveBeenLastCalledWith(
    expect.objectContaining({tracks: [tracks[1], tracks[0]], index: 0}),
  );
  page.componentWillUnmount();
  expect(saved).toHaveBeenCalledWith(
    expect.objectContaining({data: expect.objectContaining({legacy: {keep: true}})}),
  );
});
test('损坏的历史不会在离开页面时被空数组覆盖', async () => {
  load.mockResolvedValue({netEase: '损坏数据'});
  const page = createPage();
  await page.loadHistory();
  page.componentWillUnmount();
  expect(saved).not.toHaveBeenCalled();
  expect(toast).toHaveBeenCalledWith(expect.stringContaining('读取历史失败'));
});
test('历史多选不修改先前数组，相同数量选择保持确定的来源', () => {
  const tracks = [
    {id: 1, name: '一'},
    {id: 2, name: '二'},
  ];
  const selection = new Selection({
    netEase: tracks,
    qqMusic: tracks,
    local: [],
    isOpen: true,
    onClosed() {},
    onDelete() {},
  });
  selection.setState = (update) => {
    selection.state = {
      ...selection.state,
      ...(typeof update === 'function' ? update(selection.state, selection.props) : update),
    };
  };
  const previous = selection.state.checkedList;
  Object.freeze(previous.netEase);
  Object.freeze(previous);
  selection.onChecked(0, 'netEase');
  selection.onChecked(1, 'qqMusic');
  expect(previous.netEase).toEqual([]);
  expect(selection.mostChecked()).toEqual({api: 'netEase', data: [tracks[0]]});
  selection.clean();
  expect(selection.mostChecked()).toBeUndefined();
});
