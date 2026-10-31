import {jest} from '@jest/globals';
import type {Cookie} from '../../native/cookies';
const get = jest.fn<() => Promise<Record<string, Cookie>>>();
const weapi = jest.fn<(...args: unknown[]) => Promise<{params: string; encSecKey: string}>>();
const eapi = jest.fn<(...args: unknown[]) => Promise<string>>();
jest.unstable_mockModule('../../native/cookies', () => ({default: {get}}));
jest.unstable_mockModule('../../native/crypto', () => ({default: {weapi, eapi}}));
const {http, request, cryptoRequest, eapiRequest} = await import('./http');
const {responses} = await import('./responses');
const received: {url?: string; cookie: unknown}[] = [];
beforeEach(() => {
  received.length = 0;
  get.mockResolvedValue({});
  weapi.mockResolvedValue({params: 'encrypted', encSecKey: 'key'});
  eapi.mockResolvedValue('encrypted-eapi');
  http.defaults.adapter = async (config) => {
    received.push({url: config.url, cookie: config.headers.get('Cookie')});
    return {data: {code: 200}, status: 200, statusText: 'OK', headers: {}, config};
  };
});

test('游客请求不再注入伪造匿名 Cookie', async () => {
  await request(responses.login_out, '/api/test');
  expect(received[0].cookie).toBe('');
});

test('登录会话与 CSRF 进入加密请求，音源使用同一账号的 EAPI 会话', async () => {
  get.mockResolvedValue({
    MUSIC_U: {name: 'MUSIC_U', value: 'account-token'},
    __csrf: {name: '__csrf', value: 'csrf-token'},
  });
  await cryptoRequest(responses.login_out, '/weapi/test', {id: 1});
  expect(weapi).toHaveBeenLastCalledWith({id: 1, csrf_token: 'csrf-token'});
  await eapiRequest(responses.musicUrl, '/api/song/enhance/player/url/v1', {ids: '[1]'});
  expect(received[1].url).toBe('https://interface3.music.163.com/eapi/song/enhance/player/url/v1');
  expect(received[1].cookie).toContain('MUSIC_U=account-token');
  const data = eapi.mock.calls[0][1];
  expect(data).toMatchObject({ids: '[1]', e_r: false});
  expect(
    typeof data === 'object' && data && 'header' in data && JSON.parse(String(data.header)),
  ).toMatchObject({MUSIC_U: 'account-token', __csrf: 'csrf-token'});
});
