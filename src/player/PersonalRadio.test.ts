import {jest} from '@jest/globals';
import type {QueueSelection} from './types';
import type {responses} from '../services/netease/responses';
import type * as z from 'zod/mini';
const load = jest.fn<() => Promise<z.output<typeof responses.personal_fm>>>();
const navigate = jest.fn();
const toast = jest.fn();
jest.unstable_mockModule('../services', () => ({Netease: {personal_fm: load}}));
jest.unstable_mockModule('../utils/universalNavigator', () => ({default: {navigate}}));
jest.unstable_mockModule('../native/toast', () => ({toast}));
jest.unstable_mockModule('../locales', () => ({default: {NETEASE_NOT_LOGIN: '未登录'}}));
const {default: Radio} = await import('./PersonalRadio');

function createRadio() {
  const song = {id: 1, name: '原歌曲'};
  const queue = {tracks: [song], songItem: song, playingIndex: 0, api: 'qqMusic' as const};
  let request = 1;
  let isRadio = false;
  const play = jest.fn<(command: QueueSelection) => void>(() => {
    request++;
    isRadio = true;
  });
  const clearQueue = jest.fn();
  const radio = new Radio({
    getQueue: () => queue,
    getRequest: () => request,
    isPlayingRadio: () => isRadio,
    play,
    clearQueue,
  });
  return {
    radio,
    queue,
    play,
    clearQueue,
    invalidate: () => {
      request++;
    },
  };
}
beforeEach(() => {
  load.mockReset();
  navigate.mockClear();
  toast.mockClear();
});

test('进入私人电台后退出，恢复原队列的来源、歌曲和位置，不改写原始歌曲', async () => {
  load.mockResolvedValue({code: 200, data: [{id: 2, name: '电台歌曲'}]});
  const {radio, queue, play} = createRadio();
  radio.toggle();
  await Promise.resolve();
  expect(play).toHaveBeenNthCalledWith(1, {
    song: {id: 2, name: '电台歌曲', isFM: true},
    data: [{id: 2, name: '电台歌曲', isFM: true}],
    index: 0,
    api: 'netEase',
  });
  radio.toggle();
  expect(play).toHaveBeenLastCalledWith({
    song: queue.songItem,
    data: queue.tracks,
    index: 0,
    api: 'qqMusic',
  });
  expect(queue.tracks).toEqual([{id: 1, name: '原歌曲'}]);
});

test('切歌或卸载使在途电台响应失效，不恢复旧歌曲', async () => {
  let complete!: (value: z.output<typeof responses.personal_fm>) => void;
  load.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        complete = resolve;
      }),
  );
  const {radio, play, invalidate} = createRadio();
  const pending = radio.load();
  invalidate();
  complete({code: 200, data: [{id: 2}]});
  await pending;
  expect(play).not.toHaveBeenCalled();
});

test('未登录进入登录页，服务失败保留错误，不发送空播放指令', async () => {
  load.mockResolvedValueOnce({code: 405});
  const {radio, play, clearQueue} = createRadio();
  await radio.load();
  expect(navigate).toHaveBeenCalledWith('NeteaseLogin');
  load.mockResolvedValueOnce({code: 200, data: []});
  await radio.load();
  expect(toast).toHaveBeenLastCalledWith('私人电台加载失败：私人电台未返回歌曲');
  expect(play).not.toHaveBeenCalled();
  radio.stop();
  expect(clearQueue).toHaveBeenCalledTimes(1);
});
