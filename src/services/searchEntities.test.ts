import {jest} from '@jest/globals';
const netease = jest.fn<() => Promise<unknown>>();
const qq = jest.fn<() => Promise<unknown>>();
const playlists = jest.fn<() => Promise<unknown>>();
jest.unstable_mockModule('./index', () => ({
  Netease: {search: netease},
  QQMusic: {search: qq, search_playlist: playlists},
}));
const {searchEntities} = await import('./searchEntities');

test('各类搜索保留首屏偏移和来源页码，真正空结果结束分页', async () => {
  netease.mockResolvedValue({code: 200, result: {playlistCount: 0}});
  await expect(searchEntities({query: '词', api: 'netEase', kind: 'playlists'})).resolves.toEqual({
    items: [],
    offset: 0,
    hasMore: false,
  });
  expect(netease).toHaveBeenLastCalledWith({keywords: '词', type: 1000, offset: 0});
  qq.mockResolvedValue({mv: {list: [], total: 0}});
  await searchEntities({query: '词', api: 'qqMusic', kind: 'mvs', offset: 30});
  expect(qq).toHaveBeenLastCalledWith({keywords: '词', type: 'mv', page: 2});
  playlists.mockResolvedValue({list: []});
  await searchEntities({query: '词', api: 'qqMusic', kind: 'playlists', offset: 30});
  expect(playlists).toHaveBeenLastCalledWith({keywords: '词', page: 1, limit: 30});
});

test('搜索拒绝和损坏响应不伪装为空结果', async () => {
  netease.mockResolvedValue({code: -460});
  await expect(searchEntities({query: '词', api: 'netEase', kind: 'albums'})).rejects.toThrow(
    '-460',
  );
  netease.mockResolvedValue({code: 200, result: {}});
  await expect(searchEntities({query: '词', api: 'netEase', kind: 'albums'})).rejects.toThrow(
    '缺少结果列表',
  );
  qq.mockRejectedValue(new Error('业务码 2001'));
  await expect(searchEntities({query: '词', api: 'qqMusic', kind: 'singers'})).rejects.toThrow(
    '2001',
  );
});
