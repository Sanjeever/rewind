import {jest} from '@jest/globals';
import React from 'react';
import renderer, {act} from 'react-test-renderer';
import type {EntityKind, SearchEntity} from '../services/searchEntities';
import type {EntitySearchProps} from './EntitySearchResults';

Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true});
type Page = {items: SearchEntity[]; offset: number; hasMore: boolean};
const requests: {resolve(value: Page): void; reject(reason: Error): void}[] = [];
const search = jest.fn(
  () => new Promise<Page>((resolve, reject) => requests.push({resolve, reject})),
);
const Loading = () => React.createElement('Loading');
const Indicator = () => React.createElement('Indicator');
const NativeList = React.forwardRef(function List(
  {
    sections,
    onEndReached,
    ListFooterComponent,
  }: {sections: {data: unknown[]}[]; onEndReached(): void; ListFooterComponent: React.ReactNode},
  ref,
) {
  React.useImperativeHandle(ref, () => ({}));
  React.useEffect(() => {
    if (sections.every((section) => section.data.length === 0)) onEndReached();
  }, [onEndReached, sections]);
  return React.createElement('List', {}, ListFooterComponent);
});
const Retry = ({onPress, text}: {onPress(): void; text: string}) =>
  React.createElement('Retry', {onPress}, text);
jest.unstable_mockModule('react-native', () => ({
  StyleSheet: {create: <T,>(value: T) => value},
  View: ({children}: {children: React.ReactNode}) => React.createElement('View', {}, children),
  ScrollView: undefined,
  RefreshControl: undefined,
  SectionList: NativeList,
  ActivityIndicator: Indicator,
}));
jest.unstable_mockModule('../theme/constants', () => ({ITEM_HEIGHT: 70}));
jest.unstable_mockModule('../services/searchEntities', () => ({searchEntities: search}));
jest.unstable_mockModule('../components', () => ({
  ListItem: ({title}: {title: string}) => React.createElement('Row', {title}),
  Spinkit: Loading,
  TextButton: Retry,
}));
jest.unstable_mockModule('../components/Text', () => ({
  default: ({children}: {children: React.ReactNode}) => React.createElement('Text', {}, children),
}));
jest.unstable_mockModule('../services/trackDescription', () => ({
  default: ({item}: {item: SearchEntity}) => ({title: item.name}),
}));
jest.unstable_mockModule('../events/queue', () => ({default: {playMV: jest.fn()}}));
const {default: Results} = await import('./EntitySearchResults');
const indices = {singers: 1, albums: 2, playlists: 3, mvs: 4};
let tree: renderer.ReactTestRenderer;
const props = (kind: EntityKind): EntitySearchProps & {kind: EntityKind} => ({
  kind,
  search: '同词',
  api: 'netEase',
  index: indices[kind],
  navigation: {navigate() {}},
});

beforeEach(() => {
  requests.length = 0;
  search.mockClear();
});
afterEach(async () => {
  if (tree) await act(async () => tree.unmount());
});

test.each<EntityKind>(['playlists', 'albums', 'singers', 'mvs'])(
  '%s 空结果完成加载，失败显示重试并可恢复',
  async (kind) => {
    await act(async () => {
      tree = renderer.create(<Results {...props(kind)} index={0} />);
    });
    expect(tree.root.findAllByType(Indicator)).toHaveLength(0);
    await act(async () => tree.update(<Results {...props(kind)} />));
    expect(tree.toJSON()).toMatchObject({type: 'Loading'});
    await act(async () => requests[0].reject(new Error('服务拒绝')));
    expect(JSON.stringify(tree.toJSON())).toContain('服务拒绝');
    await act(async () => {
      tree.root.findByType(Retry).props.onPress();
    });
    await act(async () => requests[1].resolve({items: [], offset: 0, hasMore: false}));
    expect(JSON.stringify(tree.toJSON())).toContain('无搜索结果');
    expect(tree.root.findAllByType(Loading)).toHaveLength(0);
    expect(tree.root.findAllByType(Indicator)).toHaveLength(0);
  },
);

test.each<EntityKind>(['playlists', 'albums', 'singers', 'mvs'])(
  '%s 同词切换来源后忽略迟到响应，分页不重复请求，卸载使请求失效',
  async (kind) => {
    const initial = props(kind);
    await act(async () => {
      tree = renderer.create(<Results {...initial} />);
    });
    await act(async () => tree.update(<Results {...initial} api="qqMusic" />));
    expect(search).toHaveBeenCalledTimes(2);
    await act(async () => requests[1].resolve({items: [{id: 2}], offset: 1, hasMore: true}));
    const component = tree.root.findByType(Results).instance as InstanceType<typeof Results>;
    await act(async () => requests[0].resolve({items: [{id: 1}], offset: 1, hasMore: false}));
    expect(component.state.data).toEqual([{id: 2}]);
    let pending: Promise<void> | undefined;
    await act(async () => {
      pending = component.loadMore();
      component.loadMore();
    });
    expect(search).toHaveBeenCalledTimes(3);
    await act(async () => tree.unmount());
    await act(async () => {
      requests[2].resolve({items: [{id: 3}], offset: 2, hasMore: false});
      await pending;
    });
    expect(component.state.data).toEqual([{id: 2}]);
  },
);
