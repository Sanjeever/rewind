import {jest} from '@jest/globals';
import React, {useContext} from 'react';
import renderer, {act} from 'react-test-renderer';
Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true});
let resolve!: (value: boolean) => void;
let changed!: (value: boolean) => void;
const remove = jest.fn();
jest.unstable_mockModule('react-native', () => ({
  AccessibilityInfo: {
    isReduceMotionEnabled: () =>
      new Promise<boolean>((done) => {
        resolve = done;
      }),
    addEventListener: (_: string, listener: typeof changed) => {
      changed = listener;
      return {remove};
    },
  },
}));
const {MotionProvider, ReducedMotionContext} = await import('./motion');
function Report(_props: {reduced: boolean}) {
  return null;
}
function Content() {
  return <Report reduced={useContext(ReducedMotionContext)} />;
}
test('系统动态设置即时更新，迟到的初始查询不覆盖新设置，卸载解除监听', async () => {
  let tree!: renderer.ReactTestRenderer;
  await act(async () => {
    tree = renderer.create(
      <MotionProvider>
        <Content />
      </MotionProvider>,
    );
  });
  await act(async () => changed(true));
  expect(tree.root.findByType(Report).props.reduced).toBe(true);
  await act(async () => resolve(false));
  expect(tree.root.findByType(Report).props.reduced).toBe(true);
  await act(async () => changed(false));
  expect(tree.root.findByType(Report).props.reduced).toBe(false);
  await act(async () => tree.unmount());
  expect(remove).toHaveBeenCalledTimes(1);
});
