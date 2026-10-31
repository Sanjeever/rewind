import {jest} from '@jest/globals';
import type * as Http from './http';
import type {responses} from './responses';

const request = jest.fn<typeof Http.request>();
const cryptoRequest = jest.fn<typeof Http.cryptoRequest<typeof responses.song_detail>>();
const eapiRequest = jest.fn<typeof Http.eapiRequest<typeof responses.musicUrl>>();
jest.unstable_mockModule('./http', () => ({request, cryptoRequest, eapiRequest}));
const {default: netease} = await import('./index');

beforeEach(() => {
  request.mockReset();
  cryptoRequest.mockReset();
  eapiRequest.mockReset();
});

test('两个音源入口共用取消状态，统一使用音源 v1 并按音质选择等级', async () => {
  await netease.musicUrl({id: 1});
  const first = eapiRequest.mock.calls[0];
  const firstSignal = first[3]!.signal;
  expect(first[2]).toEqual({ids: '[1]', level: 'exhigh', encodeType: 'aac'});
  expect(firstSignal.aborted).toBe(false);
  await netease.freeMusicUrl({ids: [2, 3]});
  const second = eapiRequest.mock.calls[1];
  expect(firstSignal.aborted).toBe(true);
  expect(second[2]).toEqual({ids: '[2,3]', level: 'exhigh', encodeType: 'aac'});
  expect(second[3]!.signal.aborted).toBe(false);
  await netease.musicUrl({id: 4, br: 128000});
  expect(second[3]!.signal.aborted).toBe(true);
  expect(eapiRequest.mock.calls[2][2].level).toBe('standard');
});

test('歌曲详情按千首分批，完成顺序不同仍保留输入顺序及原始字段', async () => {
  const tracks = Array.from({length: 1001}, (_, id) => ({id}));
  let completeFirst!: (response: {code: number; songs: {id: number; extra: boolean}[]}) => void;
  cryptoRequest.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        completeFirst = resolve;
      }),
  );
  cryptoRequest.mockResolvedValueOnce({code: 200, songs: [{id: 1000, extra: true}]});
  const result = netease.song_detail(tracks);
  expect(cryptoRequest).toHaveBeenCalledTimes(2);
  expect(JSON.parse(String(cryptoRequest.mock.calls[0][2].c))).toEqual(tracks.slice(0, 1000));
  expect(JSON.parse(String(cryptoRequest.mock.calls[1][2].c))).toEqual([{id: 1000}]);
  completeFirst({code: 200, songs: [{id: 0, extra: false}]});
  await expect(result).resolves.toEqual({
    songs: [
      {id: 0, extra: false},
      {id: 1000, extra: true},
    ],
  });
});

test.each([false, true])('歌单详情保留延迟补全和立即补全行为，loadAll=%s', async (loadAll) => {
  const trackIds = Array.from({length: 1001}, (_, id) => ({id}));
  eapiRequest.mockResolvedValueOnce({code: 200, playlist: {tracks: [{id: 0}], trackIds}});
  cryptoRequest.mockResolvedValueOnce({code: 200, songs: [{id: 1000, extra: true}]});
  const result = await netease.playlist_detail(42, loadAll);
  if (loadAll) {
    expect(result.playlist?.tracks).toEqual([{id: 0}, {id: 1000, extra: true}]);
    expect(result.moreFunc).toBeUndefined();
  } else {
    expect(cryptoRequest).not.toHaveBeenCalled();
    await expect(result.moreFunc!()).resolves.toEqual({songs: [{id: 1000, extra: true}]});
    expect(result.playlist?.tracks).toEqual([{id: 0}]);
  }
});
