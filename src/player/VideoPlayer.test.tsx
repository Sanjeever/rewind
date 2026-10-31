import {jest} from '@jest/globals';
import React from 'react';
import renderer, {act} from 'react-test-renderer';

Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true});
const seek = jest.fn();
const Host = ({children}: {children?: React.ReactNode}) =>
  React.createElement('View', {}, children);
const Slider = (props: object) => React.createElement('Slider', props);
class Value {
  interpolate() {
    return 0;
  }
  stopAnimation() {}
}
const stop = jest.fn();
const animation = () => ({start() {}, stop});
jest.unstable_mockModule('react-native', () => ({
  View: Host,
  Image: Host,
  ImageBackground: Host,
  TouchableHighlight: Host,
  Animated: {Value, View: Host, timing: animation, parallel: animation, sequence: animation},
  Easing: {linear: (value: number) => value},
  PanResponder: {create: () => ({panHandlers: {}})},
  StyleSheet: {create: <T,>(value: T) => value},
}));
jest.unstable_mockModule('@react-native-community/slider', () => ({default: Slider}));
jest.unstable_mockModule('react-native-safe-area-context', () => ({SafeAreaView: Host}));
jest.unstable_mockModule('react-native-text-ticker', () => ({default: Host}));
jest.unstable_mockModule('../components/Text', () => ({default: Host}));
jest.unstable_mockModule('../components/index', () => ({Icon: Host, Spinkit: Host}));
jest.unstable_mockModule('../theme/constants', () => ({
  COLORS: {primary: '#fff', primaryAlpha50: '#777'},
}));
jest.unstable_mockModule('react-native-video', () => ({
  default: React.forwardRef(function Video(_props, ref) {
    React.useImperativeHandle(ref, () => ({seek}));
    return React.createElement('Video');
  }),
}));
const {default: VideoPlayer} = await import('./VideoPlayer');
let tree: renderer.ReactTestRenderer;
beforeEach(() => {
  jest.useFakeTimers();
  seek.mockClear();
  stop.mockClear();
});
afterEach(async () => {
  await act(async () => tree.unmount());
  jest.useRealTimers();
});

test('视频加载、进度、播放、全屏和拖动使用新状态，保留旧状态对象', async () => {
  await act(async () => {
    tree = renderer.create(<VideoPlayer source={{uri: 'https://video'}} />);
  });
  const player = tree.root.findByType(VideoPlayer).instance as InstanceType<typeof VideoPlayer>;
  const beforeLoad = Object.freeze(player.state);
  await act(async () => player._onLoadStart());
  expect(beforeLoad.loading).toBe(false);
  expect(player.state.loading).toBe(true);
  Object.freeze(player.state);
  await act(async () =>
    player._onLoad({
      duration: 120,
      currentTime: 0,
      naturalSize: {width: 640, height: 360, orientation: 'landscape'},
      audioTracks: [],
      textTracks: [],
      videoTracks: [],
    }),
  );
  Object.freeze(player.state);
  await act(async () =>
    player._onProgress({currentTime: 30, playableDuration: 120, seekableDuration: 120}),
  );
  expect(player.state.currentTime).toBe(30);
  expect(player.state.seekerPosition).toBe(0.25);
  Object.freeze(player.state);
  await act(async () => {
    player._togglePlayPause();
    player._toggleFullscreen();
  });
  expect(player.state.paused).toBe(true);
  expect(player.state.isFullscreen).toBe(true);
  Object.freeze(player.state);
  await act(async () => tree.root.findByType(Slider).props.onSlidingStart(0.5));
  Object.freeze(player.state);
  await act(async () => tree.root.findByType(Slider).props.onSlidingComplete(0.5));
  expect(seek).toHaveBeenCalledWith(60);
  expect(player.state.currentTime).toBe(60);
  expect(player.state.seeking).toBe(false);
});

test('卸载清除点击和控制计时，停止加载动画，迟到计时不能操作播放器', async () => {
  await act(async () => {
    tree = renderer.create(<VideoPlayer source={{uri: 'https://video'}} />);
  });
  const player = tree.root.findByType(VideoPlayer).instance as InstanceType<typeof VideoPlayer>;
  await act(async () => player._onLoadStart());
  const existingTimers = jest.getTimerCount();
  player._onScreenTouch();
  player.setControlTimeout();
  player.setControlTimeout();
  expect(jest.getTimerCount()).toBe(existingTimers + 2);
  const clear = jest.spyOn(globalThis, 'clearTimeout');
  const tapTimer = player.player.tapActionTimeout;
  const controlTimer = player.player.controlTimeout;
  await act(async () => tree.unmount());
  expect(clear).toHaveBeenCalledWith(tapTimer);
  expect(clear).toHaveBeenCalledWith(controlTimer);
  expect(stop).toHaveBeenCalled();
  jest.runAllTimers();
  expect(seek).not.toHaveBeenCalled();
});
