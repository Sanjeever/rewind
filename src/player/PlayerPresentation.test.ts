import {jest} from '@jest/globals';
import type PlayerPresentation from './PlayerPresentation';
const tasks = new Map<number, () => void>();
let timerId = 0;
const save = jest.fn();
const activate = jest.fn();
const deactivate = jest.fn();
jest.unstable_mockModule('react-native', () => ({
  Animated: {Value: class {}, timing: () => ({start: (done: () => void) => done()})},
  LayoutAnimation: {create() {}, configureNext() {}, Types: {}, Properties: {}},
  PanResponder: {create: () => ({panHandlers: {}})},
}));
jest.unstable_mockModule('../theme/constants', () => ({DEVICE_WIDTH: 400, DEVICE_HEIGHT: 800}));
jest.unstable_mockModule('../native/audioPlayer', () => ({default: {}}));
jest.unstable_mockModule('../native/wakeLock', () => ({default: {activate, deactivate}}));
jest.unstable_mockModule('../native/timer', () => ({
  default: {
    setTimeout(callback: () => void) {
      tasks.set(++timerId, callback);
      return timerId;
    },
    clearTimeout(id: number) {
      tasks.delete(id);
    },
  },
}));
jest.unstable_mockModule('./lyricPreferences', () => ({default: {save}}));
const {default: Presentation} = await import('./PlayerPresentation');

function createPresentation() {
  type State = ReturnType<ConstructorParameters<typeof PlayerPresentation>[0]['getState']>;
  let state: State = {
    expanded: false,
    url: '',
    showLyric: false,
    showSlider: false,
    showCoverElevation: true,
    showTool: true,
    currentTime: 10,
    duration: 100,
    playState: 'paused',
    lyricFontSize: 15,
    showTrans: true,
  };
  const togglePlay = jest.fn();
  const seek = jest.fn();
  const presentation = new Presentation({
    getState: () => state,
    getSong: () => ({id: 1, name: '歌曲', al: {picUrl: 'https://cover'}}),
    update(update, onCommitted) {
      state = {...state, ...(typeof update === 'function' ? update(state) : update)};
      onCommitted?.();
    },
    togglePlay,
    seek,
    refreshTime() {},
  });
  return {presentation, togglePlay, seek, getState: () => state};
}
beforeEach(() => {
  tasks.clear();
  save.mockClear();
  activate.mockClear();
  deactivate.mockClear();
});

test('展开后返回收起，取消延迟滑块显示并释放亮屏锁', () => {
  const {presentation, getState} = createPresentation();
  presentation.initialize();
  presentation.open();
  expect(getState()).toMatchObject({expanded: true, showSlider: false});
  expect(activate).toHaveBeenCalledTimes(1);
  expect(tasks.size).toBe(1);
  expect(presentation.onBackPress()).toBe(true);
  expect(getState()).toMatchObject({expanded: false, showSlider: false});
  expect(tasks.size).toBe(0);
  expect(deactivate).toHaveBeenCalledTimes(1);
  expect(presentation.onBackPress()).toBe(false);
});

test('返回优先关闭歌词，显示偏好在状态提交后保存', () => {
  const {presentation, getState} = createPresentation();
  presentation.open();
  presentation.toggleLyric();
  expect(getState().showLyric).toBe(true);
  presentation.onBackPress();
  expect(getState()).toMatchObject({expanded: true, showLyric: false});
  presentation.toggleTranslation();
  presentation.changeFontSize(18);
  expect(getState()).toMatchObject({showTrans: false, lyricFontSize: 18});
  expect(save.mock.calls.map((call) => call[1])).toEqual([false, 18]);
  presentation.dispose();
  expect(tasks.size).toBe(0);
});

test('隐藏工具时短滑动切换播放，大幅滑动定位进度，销毁清除交互计时', () => {
  const {presentation, togglePlay, seek} = createPresentation();
  presentation.toggleTools();
  presentation.slidingStart(30);
  presentation.slide(32);
  presentation.slidingEnd(32);
  expect(togglePlay).toHaveBeenCalledTimes(1);
  expect(seek).not.toHaveBeenCalled();
  presentation.dispose();
  presentation.slidingStart(30);
  presentation.slide(40);
  presentation.slidingEnd(40);
  expect(seek).toHaveBeenCalledWith(40);
  presentation.dispose();
  expect(tasks.size).toBe(0);
});
