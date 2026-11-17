import {jest} from '@jest/globals';
import type PlayerPresentation from './PlayerPresentation';
const tasks = new Map<number, () => void>();
let timerId = 0;
const save = jest.fn();
const activate = jest.fn();
const deactivate = jest.fn();
let autoFinish = true;
const pending: (() => void)[] = [];
class Value {
  callback?: (result: {finished: boolean}) => void;
  value: number;
  constructor(value: number) {
    this.value = value;
  }
  setValue(value: number) {
    this.value = value;
  }
  stopAnimation() {
    this.callback?.({finished: false});
    this.callback = undefined;
  }
}
jest.unstable_mockModule('react-native', () => ({
  Animated: {
    Value,
    timing: (value: Value, {toValue}: {toValue: number}) => ({
      start(done: (result: {finished: boolean}) => void) {
        value.callback = done;
        const complete = () => {
          value.setValue(toValue);
          value.callback?.({finished: true});
          value.callback = undefined;
        };
        if (autoFinish) complete();
        else pending.push(complete);
      },
    }),
  },
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

function createPresentation(reducedMotion = false) {
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
    reduceMotion: () => reducedMotion,
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
  autoFinish = true;
  pending.length = 0;
});

test('展开即显示进度条，收起后释放亮屏锁，无延迟显示任务', () => {
  const {presentation, getState} = createPresentation();
  presentation.initialize();
  presentation.open();
  expect(getState()).toMatchObject({expanded: true, showSlider: true});
  expect(activate).toHaveBeenCalledTimes(1);
  expect(tasks.size).toBe(0);
  expect(presentation.onBackPress()).toBe(true);
  expect(getState()).toMatchObject({expanded: false, showSlider: false});
  expect(tasks.size).toBe(0);
  expect(deactivate).toHaveBeenCalledTimes(1);
  expect(presentation.onBackPress()).toBe(false);
});

test('收起过程中重新展开取消旧完成回调，歌词切换不隐藏进度条', () => {
  autoFinish = false;
  const {presentation, getState} = createPresentation();
  presentation.open();
  presentation.close();
  presentation.open();
  expect(getState()).toMatchObject({expanded: true, showSlider: true});
  expect(getState().playerStyle).not.toBeNull();
  presentation.toggleLyric();
  presentation.toggleLyric();
  expect(getState()).toMatchObject({showLyric: false, showSlider: true});
  presentation.dispose();
  expect(tasks.size).toBe(0);
});

test('减少动态效果时展开、歌词和收起立即完成', () => {
  autoFinish = false;
  const {presentation, getState} = createPresentation(true);
  presentation.open();
  presentation.toggleLyric();
  expect(getState()).toMatchObject({expanded: true, showLyric: true, showSlider: true});
  presentation.close();
  expect(getState()).toMatchObject({expanded: false, playerStyle: null, showLyric: false});
  expect(pending).toHaveLength(0);
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
