const assert = require('node:assert/strict');

afterEach(() => { delete global.toast; });

test('QQ 音源明确拒绝后下载仍可使用原有备用来源', async () => {
  const opened = [];
  const notices = [];
  global.toast = value => notices.push(value);
  const dependencies = {
    'react-native': {Linking: {openURL: value => opened.push(value)}},
    'react-native-blob-util': {}, './providers': {__esModule: true, default: {qqMusic: 'qqMusic'}},
    '../locales/index': {}, '../utils/index': {}, '../native/audioTagger': {}, '../native/mediaStore': {},
    './index': {
      QQMusic: {getMusicUrl: async () => { throw new Error('授权 104003'); }},
      provider: {getUrlFromOther: async () => 'https://audio/fallback'},
    },
  };
  for (const [name, value] of Object.entries(dependencies)) jest.doMock(name, () => value);
  let download;
  jest.isolateModules(() => { download = require('./download.js').default; });
  await download.download('歌曲', 'mid', 'qqMusic', {}, true);
  assert.deepEqual(opened, ['https://audio/fallback']);
  assert.equal(notices.some(value => typeof value === 'string' && value.includes('下载失败')), false);
});
