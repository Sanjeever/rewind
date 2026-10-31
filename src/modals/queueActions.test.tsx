import {jest} from '@jest/globals';
import React from 'react';
import renderer, {act} from 'react-test-renderer';
import type {TrackFields} from '../services/track';
import type {PlayTracks} from '../player/commands';
import {collectTracks} from './commands';
Object.assign(globalThis, {IS_REACT_ACT_ENVIRONMENT: true});
const Host = ({children}: {children?: React.ReactNode}) =>
  React.createElement('View', {}, children);
const List = (props: object) => React.createElement('List', props);
const play = jest.fn<(options: PlayTracks) => void>();
const toast = jest.fn();
const collect = jest.fn<() => Promise<{code: number}>>(async () => ({code: 500}));
const qqLike = jest.fn<() => Promise<{code: number}>>(async () => ({code: 0}));
const savePlaylist = jest.fn<(value: unknown) => Promise<void>>(async () => {});
let document: {playlists: {title: string; tracks: TrackFields[]}[]; opaque?: string} = {
  playlists: [],
};
const tracks: TrackFields[] = [
  {id: 1, name: '同名'},
  {id: 2, name: '同名'},
  {id: 3, name: '其它'},
];
jest.unstable_mockModule('react-native', () => ({
  View: Host,
  Modal: Host,
  Image: Host,
  TouchableWithoutFeedback: Host,
  TouchableOpacity: Host,
  StyleSheet: {create: <T,>(value: T) => value},
}));
jest.unstable_mockModule('../components/Text', () => ({default: Host}));
jest.unstable_mockModule('../components/FadingEdge', () => ({default: Host}));
jest.unstable_mockModule('../components/index', () => ({
  Background: Host,
  Icon: Host,
  Input: Host,
  Selectable: Host,
  Spinkit: Host,
  EmptyFooter: Host,
}));
jest.unstable_mockModule('../components/Scrolling', () => ({
  LargeList: List,
  SpringScrollView: Host,
}));
jest.unstable_mockModule('../features/tracks/SongRow', () => ({default: Host}));
jest.unstable_mockModule('../features/playlists/CustomPlaylistHeader', () => ({default: Host}));
jest.unstable_mockModule('../features/playlists/PlaylistChoice', () => ({default: Host}));
jest.unstable_mockModule('../theme/constants', () => ({ITEM_HEIGHT: 70}));
jest.unstable_mockModule('../locales/index', () => ({default: {}}));
jest.unstable_mockModule('../native/toast', () => ({toast}));
jest.unstable_mockModule('../services/index', () => ({
  Netease: {playlist_tracks: collect},
  QQMusic: {like: qqLike},
}));
jest.unstable_mockModule('../storage/playlistFiles', () => ({
  default: {getPlaylist: async () => document, toPlaylist: savePlaylist},
}));
jest.unstable_mockModule('../storage/users', () => ({
  default: {
    getUserPlayList: async () => ({}),
    getUserInfo: async () => ({qqMusic: {userId: 2, cookies: 'session=test'}}),
  },
}));
jest.unstable_mockModule('../utils/index', () => ({
  usable: (value: unknown) => value != null,
  filterHelper: {
    quickSearch: (items: TrackFields[], query: string) =>
      items.filter((item) => item.name?.includes(query)),
  },
  random: {getInt: (min: number, max: number) => Math.floor(0.99 * (max - min)) + min},
}));
jest.unstable_mockModule('../player/commands', () => ({
  playTracks: play,
  clearQueue() {},
  insertTracks() {},
  removeFromPlaybackQueue() {},
}));
const {default: NowPlaying} = await import('./NowPlayingModal');
const {default: ChangePlaylist} = await import('./ChangePlaylistModal');
const {default: Collect} = await import('./CollectModal');
beforeEach(() => {
  document = {playlists: []};
  savePlaylist.mockClear();
  qqLike.mockReset().mockResolvedValue({code: 0});
  toast.mockClear();
});

test('队列筛选使用当前输入，按歌曲身份播放同名歌曲，空筛选不回退到原队列', async () => {
  let tree!: renderer.ReactTestRenderer;
  await act(async () => {
    tree = renderer.create(
      <NowPlaying
        data={tracks}
        api="netEase"
        index={0}
        songItem={tracks[0]}
        show
        isRound
        setDisplayNowPlaying={() => {}}
      />,
    );
  });
  const modal = tree.root.findByType(NowPlaying).instance as InstanceType<typeof NowPlaying>;
  await act(async () => modal.onChangeText('同名'));
  expect(modal.state.filterList).toEqual(tracks.slice(0, 2));
  modal.playFiltedMusic(tracks[1], 'netEase');
  expect(play).toHaveBeenLastCalledWith(expect.objectContaining({song: tracks[1], index: 1}));
  await act(async () => modal.onChangeText('没有结果'));
  expect(modal.state.filterList).toEqual([]);
  expect(tree.root.findByType(List).props.data).toEqual([{items: []}]);
  await act(async () => tree.unmount());
});

test('单曲歌单随机切换索引为零，空歌单不发送无效播放指令', () => {
  const modal = new ChangePlaylist({songItem: null});
  modal.setState = (update) => {
    modal.state = {
      ...modal.state,
      ...(typeof update === 'function' ? update(modal.state, modal.props) : update),
    };
  };
  modal.emit({api: 'netEase', data: [tracks[0]]});
  expect(play).toHaveBeenLastCalledWith(expect.objectContaining({song: tracks[0], index: 0}));
  const count = play.mock.calls.length;
  expect(() => modal.emit({api: 'netEase', data: []})).toThrow('歌单为空');
  expect(play).toHaveBeenCalledTimes(count);
});
test('收藏重开不沿用旧歌曲，失败保留弹层且不报告成功', async () => {
  let tree!: renderer.ReactTestRenderer;
  await act(async () => {
    tree = renderer.create(<Collect />);
  });
  const modal = tree.root.findByType(Collect).instance as InstanceType<typeof Collect>;
  await act(async () => collectTracks({api: 'netEase', song: tracks[0]}));
  expect(modal.state.songItem).toEqual(tracks[0]);
  await act(async () => modal.onClosed());
  await act(async () => collectTracks({api: 'netEase', data: [tracks[1]]}));
  expect(modal.state.songItem).toBeNull();
  expect(modal.state.data).toEqual([tracks[1]]);
  await act(async () => modal.onCollect({id: 10}));
  expect(collect).toHaveBeenCalledWith({pid: 10, tracks: [2]});
  expect(modal.state.mainModalShow).toBe(true);
  expect(toast).toHaveBeenCalledWith(expect.stringContaining('收藏失败'));
  await act(async () => tree.unmount());
});
function createCollector() {
  const modal = new Collect({});
  modal.setState = (update) => {
    modal.state = {
      ...modal.state,
      ...(typeof update === 'function' ? update(modal.state, modal.props) : update),
    };
  };
  return modal;
}
test('混合收藏保留逐曲来源、原始字段和未知文档字段', async () => {
  document = {
    opaque: '保留',
    playlists: [{title: '目标', tracks: [{api: 'local', id: 1, path: 'content://one'}]}],
  };
  const songs = [
    {api: 'netEase' as const, id: 1, name: '网易', opaque: 7},
    {api: 'qqMusic' as const, mid: 'qq1', name: 'QQ'},
  ];
  const modal = createCollector();
  modal.state = {...modal.state, api: 'local', data: songs, mainModalShow: true};
  await modal.onLocalCollect(0);
  expect(savePlaylist).toHaveBeenCalledWith({
    opaque: '保留',
    playlists: [{title: '目标', tracks: [...songs, document.playlists[0].tracks[0]]}],
  });
  expect(songs[0].api).toBe('netEase');
  expect(document.playlists[0].tracks).toHaveLength(1);
});
test('QQ 批量收藏逐首传递当前会话，部分失败保留弹层并报告完成数量', async () => {
  const modal = createCollector();
  const data = [{mid: 'one'}, {songmid: 'two'}];
  modal.state = {...modal.state, api: 'qqMusic', data, mainModalShow: true};
  await modal.onCollect({title: '喜欢'});
  expect(qqLike.mock.calls).toEqual([
    [{songmid: 'one', qq: 2, cookies: 'session=test'}],
    [{songmid: 'two', qq: 2, cookies: 'session=test'}],
  ]);
  expect(modal.state.mainModalShow).toBe(false);
  qqLike.mockResolvedValueOnce({code: 0}).mockRejectedValueOnce(new Error('请求失败'));
  modal.state = {...modal.state, api: 'qqMusic', data, mainModalShow: true};
  await modal.onCollect({title: '我喜欢'});
  expect(modal.state.mainModalShow).toBe(true);
  expect(toast).toHaveBeenLastCalledWith('收藏失败（已完成 1/2）：请求失败');
});
