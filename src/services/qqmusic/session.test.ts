import {jest} from '@jest/globals';
import type {Cookie} from '../../native/cookies';
const get = jest.fn<(url: string) => Promise<Record<string, Cookie>>>();
const account = jest.fn<() => Promise<{qqMusic?: {cookies?: string}} | null>>();
jest.unstable_mockModule('../../native/cookies', () => ({default: {get}}));
jest.unstable_mockModule('../../storage/users', () => ({default: {getUserInfo: account}}));
const {getSession, parseSession} = await import('./session');

test('音乐会话使用平台标识与密钥，并计算当前账号的令牌', () => {
  const session = parseSession('uin=o00123; qqmusic_uin=456; qm_keyst=secret=value');
  expect(session.musicId).toBe('456');
  expect(session.musicKey).toBe('secret=value');
  expect(session.token).not.toBe(5381);
  expect(session.loginType).toBe(2);
  expect(parseSession('uin=o000123; qqmusic_key=W_Xtest').loginType).toBe(1);
  expect(parseSession('uin=o000123').musicId).toBe('0');
});

test('原生当前会话优先于旧账号 Cookie，升级后的旧存储仍能读取', async () => {
  account.mockResolvedValue({qqMusic: {cookies: 'qqmusic_uin=1; qm_keyst=old'}});
  get.mockResolvedValue({});
  expect((await getSession()).musicKey).toBe('old');
  get.mockResolvedValue({
    qqmusic_uin: {name: 'qqmusic_uin', value: '2'},
    qm_keyst: {name: 'qm_keyst', value: 'new'},
  });
  expect((await getSession()).musicId).toBe('2');
  expect((await getSession()).musicKey).toBe('new');
});
