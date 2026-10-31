import {responses} from './responses';
import {parseResponse} from '../schemas';

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
test('专辑搜索保留服务实际返回的空发行公司，不拒绝有效专辑结果', () => {
  const value = {
    code: 200,
    result: {albumCount: 1, albums: [{id: 1, name: 'Hello', company: null}]},
  };
  expect(responses.search.parse(value)).toEqual(value);
});
test('响应校验向界面给出简短错误，同时保留原始校验原因', () => {
  try {
    parseResponse(responses.search, {code: 200, result: {songs: 'broken'}});
    throw new Error('应当拒绝畸形歌曲列表');
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
    expect(error).toMatchObject({
      message: '服务响应格式无效',
      cause: expect.objectContaining({issues: expect.any(Array)}),
    });
  }
});
test('网易云 MV 搜索零结果允许原始 null 列表', () => {
  const value = {code: 200, result: {hlWords: null, mvCount: 0, mvs: null}};
  expect(responses.search.parse(value)).toEqual(value);
});
