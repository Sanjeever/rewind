import {jest} from '@jest/globals';
import assert from 'node:assert/strict';
const session = {
  cookies: 'qqmusic_uin=123; qm_keyst=test',
  musicId: '123',
  musicKey: 'test',
  token: 77,
  loginType: 2,
};
jest.unstable_mockModule('./session', () => ({
  getSession: async () => session,
  guid: 'session-guid',
}));
const {getMusicUrl} = await import('./http');
afterEach(() => jest.useRealTimers());
function respond(data: unknown, status = 200) {
  return jest.spyOn(global, 'fetch').mockImplementation(
    async (_, options) =>
      new Response(
        JSON.stringify(
          typeof options?.body === 'string' &&
            JSON.parse(options.body).req_0?.method === 'get_song_detail_yqq'
            ? {code: 0, req_0: {code: 0, data: {track_info: {file: {media_mid: 'media'}}}}}
            : data,
        ),
        {
          status,
        },
      ),
  );
}
test('QQ 音源使用服务返回的有效 CDN，即使只有一个地址也能生成完整 URL', async () => {
  const fetch = respond({
    code: 0,
    req_0: {
      code: 0,
      data: {
        sip: ['https://audio.example/'],
        midurlinfo: [
          {
            result: 0,
            purl: 'song.m4a?vkey=test',
          },
        ],
      },
    },
  });
  assert.equal(await getMusicUrl('mid'), 'https://audio.example/song.m4a?vkey=test');
  const options = fetch.mock.calls[1][1];
  assert.ok(typeof options?.body === 'string');
  const data = JSON.parse(options.body);
  assert.deepEqual(data.req_0.param.songmid, ['mid']);
  assert.deepEqual(data.req_0.param.filename, ['M500media.mp3']);
  assert.equal(data.comm.uin, '123');
  assert.equal(data.comm.authst, 'test');
  assert.equal(data.req_0.param.uin, '123');
});
test('QQ 授权拒绝、空授权与损坏响应均保留明确错误', async () => {
  const fetch = respond({
    code: 0,
    req_0: {
      code: 0,
      data: {
        midurlinfo: [
          {
            result: 104003,
            purl: '',
          },
        ],
      },
    },
  });
  await assert.rejects(getMusicUrl('mid'), /104003/);
  fetch.mockImplementation(
    async () =>
      new Response(
        JSON.stringify({
          code: 0,
          req_0: {
            code: 0,
            data: {
              midurlinfo: [],
            },
          },
        }),
      ),
  );
  await assert.rejects(getMusicUrl('mid', false, {file: {media_mid: 'media'}}), /缺少授权结果/);
  fetch.mockImplementation(
    async () =>
      new Response(
        JSON.stringify({
          code: 0,
          req_0: {
            code: 0,
            data: {
              midurlinfo: [
                {
                  result: 0,
                  purl: '',
                },
              ],
            },
          },
        }),
      ),
  );
  await assert.rejects(getMusicUrl('mid', false, {file: {media_mid: 'media'}}), /未返回播放授权/);
});
test('新版授权未附带 CDN 时向平台申请调度，保持同一账号会话', async () => {
  const fetch = jest
    .spyOn(global, 'fetch')
    .mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          code: 0,
          req_0: {code: 0, data: {sip: [], midurlinfo: [{result: 0, purl: 'song.mp3?vkey=test'}]}},
        }),
      ),
    )
    .mockResolvedValueOnce(
      new Response(
        JSON.stringify({code: 0, req_0: {code: 0, data: {sip: ['https://cdn.example/']}}}),
      ),
    );
  expect(await getMusicUrl('mid', false, {file: {media_mid: 'media'}})).toBe(
    'https://cdn.example/song.mp3?vkey=test',
  );
  const options = fetch.mock.calls[1][1];
  assert.ok(typeof options?.body === 'string');
  expect(JSON.parse(options.body)).toMatchObject({
    comm: {uin: '123'},
    req_0: {method: 'GetCdnDispatch'},
  });
});
test('QQ HTTP 和网络错误不会被转换成 undefined 音源', async () => {
  const fetch = respond({}, 503);
  await assert.rejects(getMusicUrl('mid'), /HTTP 503/);
  fetch.mockImplementation(async () => {
    throw new Error('网络断开');
  });
  await assert.rejects(getMusicUrl('mid'), /网络断开/);
});
test('QQ 请求超过十五秒终止网络并暴露超时', async () => {
  jest.useFakeTimers();
  jest.spyOn(global, 'fetch').mockImplementation((_, options) => {
    const signal = options?.signal;
    assert.ok(signal);
    return new Promise((_resolve, reject) => {
      signal.addEventListener('abort', () => reject(new Error('aborted')));
    });
  });
  const pending = getMusicUrl('mid', false, {file: {media_mid: 'media'}});
  const rejected = assert.rejects(pending, /请求超时/);
  await jest.advanceTimersByTimeAsync(15000);
  await rejected;
});
