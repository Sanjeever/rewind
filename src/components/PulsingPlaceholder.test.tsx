import {jest} from '@jest/globals';
import React from 'react';
import renderer, {act} from 'react-test-renderer';
Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true});
const timing = jest.fn(() => {
  let complete: ((event: {finished: boolean}) => void) | undefined;
  return {
    start(callback: (event: {finished: boolean}) => void) {
      complete = callback;
    },
    stop() {
      complete?.({finished: false});
    },
  };
});
const Host = () => React.createElement('View');
jest.unstable_mockModule('react-native', () => ({
  Animated: {Value: class {}, timing, View: Host, Text: Host},
}));
const {default: Placeholder} = await import('./PulsingPlaceholder');
test('卸载停止占位动画，不再通过完成回调重启循环', async () => {
  let tree: renderer.ReactTestRenderer;
  await act(async () => {
    tree = renderer.create(<Placeholder />);
  });
  expect(timing).toHaveBeenCalledTimes(1);
  await act(async () => tree.unmount());
  expect(timing).toHaveBeenCalledTimes(1);
});
