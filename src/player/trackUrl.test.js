import {jest} from '@jest/globals';
import assert from 'node:assert/strict';
async function resolver(services) {
  jest.resetModules();
  jest.unstable_mockModule('../services', () => ({
    provider: undefined,
    QQMusic: undefined,
    Netease: undefined,
    default: services,
    ...services,
  }));
  let urls;
  await jest.isolateModulesAsync(async () => {
    urls = (await import('./trackUrl.js')).default;
  });
  return urls;
}
test('主音源报错时仍尝试既有备用来源，备用成功后返回地址', async () => {
  const urls = await resolver({
    QQMusic: {
      getMusicUrl: async () => {
        throw new Error('授权 104003');
      },
    },
    provider: {
      getUrlFromOther: async () => 'https://audio/fallback',
    },
  });
  assert.equal(
    await urls.getUrl('qqMusic', {
      song: {
        mid: 'mid',
      },
    }),
    'https://audio/fallback',
  );
});
test('主音源与备用均失败时保留真实业务错误，区分 -460 和歌曲级 -110', async () => {
  let response = {
    code: -460,
    message: '网络环境风险',
  };
  const urls = await resolver({
    Netease: {
      freeMusicUrl: async () => response,
    },
    provider: {
      getUrlFromOther: async () => {
        throw new Error('QQ 授权 104003');
      },
    },
  });
  await assert.rejects(
    urls.getUrl('netEase', {
      song: {
        id: 1,
      },
    }),
    /-460.*网络环境风险.*104003/,
  );
  response = {
    code: 200,
    data: [
      {
        code: -110,
        url: null,
      },
    ],
  };
  await assert.rejects(
    urls.getUrl('netEase', {
      song: {
        id: 1,
      },
    }),
    /-110.*104003/,
  );
});
test('空字符串和试听音源均不能作为完整歌曲成功返回', async () => {
  const urls = await resolver({
    Netease: {
      freeMusicUrl: async () => ({
        code: 200,
        data: [
          {
            url: 'https://trial',
            freeTrialInfo: {},
          },
        ],
      }),
    },
    QQMusic: {
      getMusicUrl: async () => '',
    },
    provider: {
      getUrlFromOther: async () => null,
    },
  });
  await assert.rejects(
    urls.getUrl('netEase', {
      song: {
        id: 1,
      },
    }),
    /仅提供试听/,
  );
  await assert.rejects(
    urls.getUrl('qqMusic', {
      song: {
        mid: 'mid',
      },
    }),
    /未返回播放地址/,
  );
});
