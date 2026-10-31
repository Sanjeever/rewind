import {jest} from '@jest/globals';
const call = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const decode = jest.fn<(values: string[]) => Promise<string[]>>();
jest.unstable_mockModule('./http', () => ({call}));
jest.unstable_mockModule('../../native/crypto', () => ({default: {decodeBase64: decode}}));
const {getLyric} = await import('./lyrics');

test('请求普通逐行歌词并交由原生 UTF-8 解码，翻译缺失也能展示原文', async () => {
  call.mockResolvedValue({
    code: 0,
    req_0: {code: 0, data: {songID: 1, lyric: 'encoded', crypt: 0, qrc: 0}},
  });
  decode.mockResolvedValue(['[00:01.00]你好🌙', '']);
  const result = await getLyric('mid');
  expect(call.mock.calls[0][2]).toMatchObject({songMid: 'mid', crypt: 0, qrc: 0, trans: 1});
  expect(decode).toHaveBeenCalledWith(['encoded', '']);
  expect(result.lyric[0]).toMatchObject({txt: '你好🌙', total: 1});
  expect(result.trans).toEqual([]);
});

test('保留服务拒绝并拒绝错误的加密格式，不把密文当成歌词', async () => {
  call.mockResolvedValue({code: 0, req_0: {code: 2001}});
  await expect(getLyric(1)).rejects.toThrow('2001');
  call.mockResolvedValue({
    code: 0,
    req_0: {code: 0, data: {songID: 1, lyric: 'cipher', crypt: 1, qrc: 1}},
  });
  await expect(getLyric(1)).rejects.toThrow('逐行歌词格式');
});
