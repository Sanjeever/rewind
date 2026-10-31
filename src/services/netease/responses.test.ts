import {responses} from './responses';

test('外部响应校验保留业务错误、未知字段与原始歌曲字段', () => {
  expect(responses.freeMusicUrl.parse({code: -460, message: '拒绝'})).toEqual({
    code: -460,
    message: '拒绝',
  });
  const response = {
    code: 200,
    result: {songs: [{id: 1, name: '歌曲', opaque: {value: 0}}], songCount: 1},
    extra: false,
  };
  expect(responses.search.parse(response)).toEqual(response);
  expect(responses.freeMusicUrl.parse({code: 200, data: [{code: -110, url: null}]})).toEqual({
    code: 200,
    data: [{code: -110, url: null}],
  });
});

test('畸形响应在网络边界失败，不以类型断言传入业务', () => {
  expect(() => responses.search.parse({result: {songs: []}})).toThrow();
  expect(() => responses.search.parse({code: 200, result: {songs: 'broken'}})).toThrow();
  expect(() => responses.freeMusicUrl.parse({code: 200, data: [{url: 42}]})).toThrow();
});
