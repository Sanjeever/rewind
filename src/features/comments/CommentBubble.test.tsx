import {jest} from '@jest/globals';
import React from 'react';
import renderer, {act} from 'react-test-renderer';
jest.unstable_mockModule('react-native', () => ({
  StyleSheet: {create: <T,>(value: T) => value},
  View: ({children}: {children: React.ReactNode}) => React.createElement('View', {}, children),
  Image: () => React.createElement('Image'),
}));
jest.unstable_mockModule('../../components/Text', () => ({
  default: ({children}: {children: React.ReactNode}) => React.createElement('Text', {}, children),
}));
jest.unstable_mockModule('../../components/index', () => ({
  Selectable: ({children}: {children: React.ReactNode}) =>
    React.createElement('Selectable', {}, children),
}));
jest.unstable_mockModule('./formatItem', () => ({
  getFormattedItem: () => ({content: '喜欢 C++ 和音乐', userName: '用户'}),
}));
const {default: CommentBubble} = await import('./CommentBubble');
Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true});

test('词云回查使用真实高亮库并按原文匹配带正则符号的关键词', async () => {
  let view!: renderer.ReactTestRenderer;
  await act(async () => {
    view = renderer.create(
      <CommentBubble
        title="C++"
        item={{commentId: 1, content: '喜欢 C++ 和音乐', time: 1, user: {userId: 1}}}
      />,
    );
  });
  expect(view.root.findAll((node) => node.props.children === 'C++').length).toBeGreaterThan(0);
  await act(async () => view.unmount());
});
