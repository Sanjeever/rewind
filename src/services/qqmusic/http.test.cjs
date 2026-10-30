const {test} = require('node:test');
const assert = require('node:assert/strict');
const {getMusicUrl, searchSongs} = require('./http.js');

function respond(t, data, status = 200) {
  return t.mock.method(global, 'fetch', async () => new Response(JSON.stringify(data), {status}));
}

test('QQ 音源使用服务返回的有效 CDN，即使只有一个地址也能生成完整 URL', async t => {
  const fetch = respond(t, {code: 0, req_0: {code: 0, data: {sip: ['https://audio.example/'], midurlinfo: [{result: 0, purl: 'song.m4a?vkey=test'}]}}});
  assert.equal(await getMusicUrl('mid'), 'https://audio.example/song.m4a?vkey=test');
  const url = new URL(fetch.mock.calls[0].arguments[0]);
  assert.deepEqual(JSON.parse(url.searchParams.get('data')).req_0.param.songmid, ['mid']);
});

test('QQ 授权拒绝、空授权与损坏响应均保留明确错误', async t => {
  const fetch = respond(t, {code: 0, req_0: {code: 0, data: {midurlinfo: [{result: 104003, purl: ''}]}}});
  await assert.rejects(getMusicUrl('mid'), /104003/);
  fetch.mock.mockImplementation(async () => new Response(JSON.stringify({code: 0, req_0: {code: 0, data: {midurlinfo: []}}})));
  await assert.rejects(getMusicUrl('mid'), /缺少授权结果/);
  fetch.mock.mockImplementation(async () => new Response(JSON.stringify({code: 0, req_0: {code: 0, data: {midurlinfo: [{result: 0, purl: ''}]}}})));
  await assert.rejects(getMusicUrl('mid'), /未返回播放授权/);
});

test('QQ HTTP 和网络错误不会被转换成 undefined 音源', async t => {
  const fetch = respond(t, {}, 503);
  await assert.rejects(getMusicUrl('mid'), /HTTP 503/);
  fetch.mock.mockImplementation(async () => { throw new Error('网络断开'); });
  await assert.rejects(getMusicUrl('mid'), /网络断开/);
});

test('QQ 请求超过十五秒终止网络并暴露超时', async t => {
  t.mock.timers.enable({apis: ['setTimeout']});
  t.mock.method(global, 'fetch', (_, {signal}) => new Promise((resolve, reject) => {
    signal.addEventListener('abort', () => reject(new Error('aborted')));
  }));
  const pending = getMusicUrl('mid');
  t.mock.timers.tick(15000);
  await assert.rejects(pending, /请求超时/);
});

test('QQ 搜索检查两层业务码，区分空结果和无效响应，并正确发送页码', async t => {
  const fetch = respond(t, {code: 0, data: {code: 0, data: {body: {song: {list: []}}}}});
  assert.deepEqual(await searchSongs('词', 2), []);
  const options = fetch.mock.calls[0].arguments[1];
  assert.equal(JSON.parse(options.body).data.param.page_num, 2);
  fetch.mock.mockImplementation(async () => new Response(JSON.stringify({code: 0, data: {code: 1000}})));
  await assert.rejects(searchSongs('词'), /1000/);
  fetch.mock.mockImplementation(async () => new Response(JSON.stringify({code: 0, data: {code: 0, data: {}}})));
  await assert.rejects(searchSongs('词'), /缺少歌曲列表/);
});
