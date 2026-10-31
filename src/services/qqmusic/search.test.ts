import {jest} from '@jest/globals';
const call = jest.fn<(...args: unknown[]) => Promise<unknown>>();
jest.unstable_mockModule('./http', () => ({call}));
const {searchSongPage} = await import('./search');

test('搜索使用服务游标，十首结果仍能继续分页，保留歌曲媒体与未知字段', async () => {
  const song = {mid: 'track', name: '歌曲', file: {media_mid: 'media'}, unknownField: true};
  call.mockResolvedValue({
    code: 0,
    req_0: {
      code: 0,
      data: {
        body: {item_song: {items: Array.from({length: 10}, () => song)}},
        meta: {sid: 'search-session', nextpage: 2, nextpage_start: {song: 10}, ret: 0},
      },
    },
  });
  const first = await searchSongPage('关键词');
  expect(first.cursor).toEqual({searchId: 'search-session', page: 2, start: {song: 10}});
  expect(first.songs[0]).toEqual(song);
  await searchSongPage('关键词', first.cursor);
  expect(call.mock.calls[1][2]).toMatchObject({
    searchid: 'search-session',
    page_id: 2,
    page_start: {song: 10},
  });
});

test('业务拒绝与筛选拒绝不能显示为空结果，真实空结果结束分页', async () => {
  call.mockResolvedValue({code: 0, req_0: {code: 2001}});
  await expect(searchSongPage('词')).rejects.toThrow('2001');
  call.mockResolvedValue({
    code: 0,
    req_0: {
      code: 0,
      data: {body: {}, meta: {sid: 'id', nextpage: -1, nextpage_start: {}, ret: 0, is_filter: -2}},
    },
  });
  await expect(searchSongPage('词')).rejects.toThrow('拒绝');
  call.mockResolvedValue({
    code: 0,
    req_0: {code: 0, data: {body: {}, meta: {sid: 'id', nextpage: -1, nextpage_start: {}, ret: 0}}},
  });
  await expect(searchSongPage('词')).resolves.toEqual({songs: [], cursor: undefined});
});
