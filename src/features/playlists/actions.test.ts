import {jest} from '@jest/globals';
import type {PlaylistActionContext} from './actions';
import type Netease from '../../services/netease/index';
import type {PlayTracks} from '../../player/commands';

const heartMode = jest.fn<typeof Netease.heart_mode>();
const playTracks = jest.fn<(selection: PlayTracks) => void>();
const toast = jest.fn();
jest.unstable_mockModule('../../services/index', () => ({Netease: {heart_mode: heartMode}}));
jest.unstable_mockModule('../../player/commands', () => ({playTracks, insertTracks: jest.fn()}));
jest.unstable_mockModule('../../native/toast', () => ({toast}));
jest.unstable_mockModule('../../modals/commands', () => ({
  showTrackDetails: jest.fn(),
  savePicture: jest.fn(),
}));
jest.unstable_mockModule('../../player/videoActions', () => ({default: {}}));
jest.unstable_mockModule('../../storage/users', () => ({default: {}}));
jest.unstable_mockModule('../../utils/index', () => ({random: {getInt: () => 0}}));
jest.unstable_mockModule('../../locales/index', () => ({
  default: {NETEASE_NOT_LOGIN: '未登入网易云！', ERROR: '出错了'},
}));
const {default: actions} = await import('./actions');

const page: PlaylistActionContext = {
  state: {
    heartMode: true,
    playlistId: 42,
    api: 'netEase',
    playlist: [{id: 1}],
    oriList: [{id: 1}],
    searching: false,
    showRestore: false,
  },
  collectPlaylistOrder() {},
};
beforeEach(() => {
  heartMode.mockReset();
  playTracks.mockClear();
  toast.mockClear();
});

test('心动响应保留歌曲字段并提交整份播放队列', async () => {
  const songs = [
    {id: 2, name: '推荐一', fee: 0},
    {id: 3, name: '推荐二', mv: 123},
  ];
  heartMode.mockResolvedValue({
    code: 200,
    data: songs.map((songInfo) => ({id: songInfo.id, songInfo})),
  });
  await actions.onHeartMode(page);
  expect(heartMode).toHaveBeenCalledWith({songId: 1, playlistId: 42});
  expect(playTracks).toHaveBeenCalledWith({
    song: songs[0],
    tracks: songs,
    index: 0,
    api: 'netEase',
  });
  expect(toast).not.toHaveBeenCalled();
});

test.each([
  [{code: 301}, '未登入网易云！'],
  [{code: 500, message: '服务暂不可用'}, '服务暂不可用'],
  [{code: 403, msg: '暂无权限'}, '暂无权限'],
  [{code: 200, data: []}, '心动模式暂无可播放歌曲'],
  [{code: 200}, '心动模式暂无可播放歌曲'],
])('心动请求未取得歌曲时提示原因并保留原队列 %j', async (response, message) => {
  heartMode.mockResolvedValue(response);
  await actions.onHeartMode(page);
  expect(toast).toHaveBeenCalledWith(message);
  expect(playTracks).not.toHaveBeenCalled();
});

test('心动请求异常转为页面错误反馈', async () => {
  heartMode.mockRejectedValue(new Error('服务响应格式无效'));
  await actions.onHeartMode(page);
  expect(toast).toHaveBeenCalledWith('服务响应格式无效');
  expect(playTracks).not.toHaveBeenCalled();
});

test('离开歌单后的心动结果和失败不再提交队列或提示', async () => {
  heartMode.mockResolvedValue({code: 200, data: [{id: 2, songInfo: {id: 2}}]});
  await actions.onHeartMode(page, () => false);
  heartMode.mockRejectedValue(new Error('已离开'));
  await actions.onHeartMode(page, () => false);
  expect(playTracks).not.toHaveBeenCalled();
  expect(toast).not.toHaveBeenCalled();
});
