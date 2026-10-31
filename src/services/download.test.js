import {jest} from '@jest/globals';
import assert from 'node:assert/strict';
afterEach(() => {
  delete global.toast;
});
test('QQ 音源明确拒绝后下载仍可使用原有备用来源', async () => {
  jest.resetModules();
  const opened = [];
  const notices = [];
  global.toast = (value) => notices.push(value);
  const dependencies = {
    '../native/toast': {toast: (message) => notices.push(message)},
    'react-native': {
      Linking: {
        openURL: (value) => opened.push(value),
      },
    },
    'react-native-blob-util': {},
    './providers': {
      __esModule: true,
      default: {
        qqMusic: 'qqMusic',
      },
    },
    '../locales/index': {},
    '../utils/index': {},
    '../native/audioTagger': {},
    '../native/mediaStore': {},
    '../storage/paths': {
      cache_dir: '/cache/',
    },
    './index': {
      QQMusic: {
        getMusicUrl: async () => {
          throw new Error('授权 104003');
        },
      },
      provider: {
        getUrlFromOther: async () => 'https://audio/fallback',
      },
    },
  };
  for (const [name, value] of Object.entries(dependencies))
    jest.unstable_mockModule(name, () => ({
      default: value,
      ...value,
    }));
  let download;
  await jest.isolateModulesAsync(async () => {
    download = (await import('./download.js')).default;
  });
  await download.download('歌曲', 'mid', 'qqMusic', {}, true);
  assert.deepEqual(opened, ['https://audio/fallback']);
  assert.equal(
    notices.some((value) => typeof value === 'string' && value.includes('下载失败')),
    false,
  );
});
