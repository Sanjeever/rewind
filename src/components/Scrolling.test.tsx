import {jest} from '@jest/globals';
import React from 'react';
import renderer, {act} from 'react-test-renderer';
Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true});
const Host = ({children}: React.PropsWithChildren) => <>{children}</>;
const NativeList = React.forwardRef(function List(_props: object, _ref) {
  return null;
});
jest.unstable_mockModule('react-native', () => ({
  View: Host,
  SectionList: NativeList,
  ScrollView: Host,
  RefreshControl: Host,
  ActivityIndicator: Host,
}));
const {LargeList} = await import('./Scrolling');

test('全部为空的分组移除占位分节，让原生列表能显示空态与首次加载占位；混合分组保留分节', async () => {
  let tree!: renderer.ReactTestRenderer;
  const Empty = () => null;
  await act(async () => {
    tree = renderer.create(
      <LargeList
        data={[{items: []}, {items: []}]}
        renderIndexPath={() => null}
        renderEmpty={() => <Empty />}
      />,
    );
  });
  const props = tree.root.findByType(NativeList).props;
  expect(props.sections).toEqual([]);
  expect(props.ListEmptyComponent().type).toBe(Empty);
  await act(async () =>
    tree.update(
      <LargeList data={[{items: []}, {items: [{id: 1}]}]} renderIndexPath={() => null} />,
    ),
  );
  expect(
    tree.root
      .findByType(NativeList)
      .props.sections.map((section: {data: object[]}) => section.data),
  ).toEqual([[], [{id: 1}]]);
  await act(async () => tree.unmount());
});
