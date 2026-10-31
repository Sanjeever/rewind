import {jest} from '@jest/globals';
jest.unstable_mockModule('../../utils/index', () => ({}));
jest.unstable_mockModule('./sign', () => ({}));
jest.unstable_mockModule('./session', () => ({getSession: jest.fn(), guid: 'test'}));
const {default: service} = await import('./index');
function respond(data: unknown, status = 200) {
  return jest
    .spyOn(globalThis, 'fetch')
    .mockImplementation(async () => new Response(JSON.stringify(data), {status}));
}

test('QQ 歌单网络、HTTP、业务失败均拒绝，成功保留原歌单结构', async () => {
  const request = respond({}, 503);
  await expect(service.disslist({id: 'test', qq: 0})).rejects.toThrow('503');
  request.mockResolvedValue(new Response(JSON.stringify({code: 2001})));
  await expect(service.disslist({id: 'test', qq: 0})).rejects.toThrow('2001');
  request.mockResolvedValue(new Response(JSON.stringify({code: 0})));
  await expect(service.disslist({id: 'test', qq: 0})).rejects.toThrow('缺少歌单');
  request.mockResolvedValue(new Response(JSON.stringify({code: 0, cdlist: [{songlist: []}]})));
  await expect(service.disslist({id: 'test', qq: 0})).resolves.toEqual([{songlist: []}]);
  request.mockRejectedValue(new Error('网络断开'));
  await expect(service.disslist({id: 'test', qq: 0})).rejects.toThrow('网络断开');
});

test('QQ 收藏依据业务码返回结果，不把响应文本或错误视作成功', async () => {
  const request = respond({code: 1000});
  await expect(service.subscribe_playlist({id: 'test', op: 'subscribe'})).rejects.toThrow('1000');
  request.mockResolvedValue(new Response(JSON.stringify({code: 0})));
  await expect(service.subscribe_playlist({id: 'test', op: 'unsubscribe'})).resolves.toEqual({
    code: 0,
  });
});

test('QQ 资料请求使用传入会话，未传会话时不添加固定 Cookie', async () => {
  const request = respond({code: 0, data: {creator: {}, mymusic: [], mydiss: {list: []}}});
  await service.profile('test', 'session=test');
  expect(request.mock.calls[0][1]?.headers).toMatchObject({Cookie: 'session=test'});
  await service.profile('test', undefined);
  expect(request.mock.calls[1][1]?.headers).not.toHaveProperty('Cookie');
});
test('QQ 添加到歌单传递当前会话，不依赖固定身份', async () => {
  const request = respond({code: 0});
  await service.addToDir({songmid: 'test', dirid: 1, qq: 2, cookies: 'session=test'});
  expect(request.mock.calls[0][1]?.headers).toMatchObject({Cookie: 'session=test'});
});
