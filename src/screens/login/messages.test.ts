import {neteaseMessage, qqMessage} from './messages';
test('登录消息保留账号字段和当前 Cookie，拒绝不完整网页消息', () => {
  const netease = {profile: {userId: 1, nickname: '用户', opaque: '保留'}, token: 'test-token'};
  expect(neteaseMessage.parse(netease)).toEqual(netease);
  const qq = {nickname: '用户', avatarUrl: 'https://avatar', cookies: 'test=value'};
  expect(qqMessage.parse(qq)).toEqual(qq);
  expect(neteaseMessage.safeParse({profile: null}).success).toBe(false);
  expect(qqMessage.safeParse({avatarUrl: 'https://avatar'}).success).toBe(false);
});
