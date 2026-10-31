import {jest} from '@jest/globals';
import assert from 'node:assert/strict';
async function searchWith(services) {
  jest.resetModules();
  jest.unstable_mockModule('./index', () => ({
    QQMusic: undefined,
    Netease: undefined,
    default: services,
    ...services,
  }));
  let searchSongs;
  await jest.isolateModulesAsync(async () => {
    searchSongs = (await import('./search.js')).searchSongs;
  });
  return searchSongs;
}
test('搜索服务统一两种来源结构，并保留正确分页偏移', async () => {
  const calls = [];
  const search = await searchWith({
    Netease: {
      cloud_search: async (options) => {
        calls.push(options);
        return {
          code: 200,
          result: {
            songs: [
              {
                id: 1,
                name: '歌曲',
              },
            ],
            songCount: 31,
          },
        };
      },
    },
    QQMusic: {
      searchSong: async (...args) => {
        calls.push(args);
        return [
          {
            mid: 'mid',
            name: '歌曲',
          },
        ];
      },
    },
  });
  const netease = await search({
    query: '关键词',
    api: 'netEase',
    offset: 30,
  });
  assert.equal(netease.tracks[0].key, 'netEase:1');
  assert.equal(netease.hasMore, false);
  assert.equal(netease.offset, 31);
  const qq = await search({
    query: '关键词',
    api: 'qqMusic',
    offset: 30,
  });
  assert.deepEqual(calls, [
    {
      keywords: '关键词',
      offset: 30,
      limit: 30,
    },
    ['关键词', 2],
  ]);
  assert.equal(qq.tracks[0].key, 'qqMusic:mid');
  assert.equal(qq.hasMore, false);
});
test('真正空结果可结束加载，错误状态和畸形响应不会伪装成空列表', async () => {
  let response = {
    code: 200,
    result: {
      songCount: 0,
    },
  };
  const search = await searchWith({
    Netease: {
      cloud_search: async () => response,
    },
  });
  assert.deepEqual(
    await search({
      query: '词',
      api: 'netEase',
    }),
    {
      tracks: [],
      offset: 0,
      hasMore: false,
    },
  );
  response = {
    code: -460,
  };
  await assert.rejects(
    search({
      query: '词',
      api: 'netEase',
    }),
    /-460/,
  );
  response = {
    code: 200,
    result: {},
  };
  await assert.rejects(
    search({
      query: '词',
      api: 'netEase',
    }),
    /缺少歌曲列表/,
  );
});
