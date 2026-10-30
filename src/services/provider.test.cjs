const assert = require('node:assert/strict');

function provider(Netease, QQMusic) {
  jest.doMock('./netease', () => Netease);
  jest.doMock('./qqmusic', () => QQMusic);
  let resolver;
  jest.isolateModules(() => { resolver = require('./provider.js').default; });
  return resolver;
}

test('QQ 备用请求报错后仍尝试网易云同长度替代歌曲', async () => {
  const source = {id: 1, name: '歌曲', ar: [{name: '歌手'}], dt: 3000};
  const calls = [];
  const resolver = provider({
    search: async () => ({code: 200, result: {songs: [source, {...source, id: 2}]}}),
    freeMusicUrl: async ({id}) => { calls.push(id); return {code: 200, data: [{url: 'https://audio/2'}]}; },
  }, {searchSong: async () => { throw new Error('QQ 搜索失败'); }});
  assert.equal(await resolver.getUrlFromOther(source, 'netEase'), 'https://audio/2');
  assert.deepEqual(calls, [2]);
});

test('所有备用来源失败时保留 QQ 和网易云错误', async () => {
  const resolver = provider({search: async () => ({code: -460})}, {
    searchSong: async () => { throw new Error('QQ HTTP 503'); },
  });
  await assert.rejects(resolver.getUrlFromOther({id: 1, name: '歌曲'}, 'netEase'), /503.*-460/);
});
