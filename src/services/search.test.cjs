const {test} = require('node:test');
const assert = require('node:assert/strict');
const loadModule = require('../test/loadModule.cjs');
const {normalizeTrack} = require('./trackInfo.js');

function searchWith(services) {
  return loadModule('src/services/search.js', {
    './index': services,
    './providers': {__esModule: true, default: require('./providers.js').default},
    './trackInfo': {normalizeTrack},
  }).searchSongs;
}

test('搜索服务统一两种来源结构，并保留正确分页偏移', async () => {
  const calls = [];
  const search = searchWith({
    Netease: {cloud_search: async options => {
      calls.push(options);
      return {code: 200, result: {songs: [{id: 1, name: '歌曲'}], songCount: 31}};
    }},
    QQMusic: {searchSong: async (...args) => { calls.push(args); return [{mid: 'mid', name: '歌曲'}]; }},
  });
  const netease = await search({query: '关键词', api: 'netEase', offset: 30});
  assert.equal(netease.tracks[0].key, 'netEase:1');
  assert.equal(netease.hasMore, false);
  assert.equal(netease.offset, 31);
  const qq = await search({query: '关键词', api: 'qqMusic', offset: 30});
  assert.deepEqual(calls, [{keywords: '关键词', offset: 30, limit: 30}, ['关键词', 2]]);
  assert.equal(qq.tracks[0].key, 'qqMusic:mid');
  assert.equal(qq.hasMore, false);
});

test('真正空结果可结束加载，错误状态和畸形响应不会伪装成空列表', async () => {
  let response = {code: 200, result: {songCount: 0}};
  const search = searchWith({Netease: {cloud_search: async () => response}});
  assert.deepEqual(await search({query: '词', api: 'netEase'}), {tracks: [], offset: 0, hasMore: false});
  response = {code: -460};
  await assert.rejects(search({query: '词', api: 'netEase'}), /-460/);
  response = {code: 200, result: {}};
  await assert.rejects(search({query: '词', api: 'netEase'}), /缺少歌曲列表/);
});
