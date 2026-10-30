const {test} = require('node:test');
const assert = require('node:assert/strict');
const loadModule = require('../test/loadModule.cjs');

test('QQ 音源明确拒绝后下载仍可使用原有备用来源', async () => {
  const opened = [];
  const notices = [];
  global.toast = value => notices.push(value);
  const {default: download} = loadModule('src/services/download.js', {
    'react-native': {Linking: {openURL: value => opened.push(value)}},
    'react-native-blob-util': {}, './providers': {__esModule: true, default: {qqMusic: 'qqMusic'}},
    '../locales/index': {}, '../utils/index': {}, '../native/audioTagger': {}, '../native/mediaStore': {},
    './index': {
      QQMusic: {getMusicUrl: async () => { throw new Error('授权 104003'); }},
      provider: {getUrlFromOther: async () => 'https://audio/fallback'},
    },
  });
  await download.download('歌曲', 'mid', 'qqMusic', {}, true);
  assert.deepEqual(opened, ['https://audio/fallback']);
  assert.equal(notices.some(value => typeof value === 'string' && value.includes('下载失败')), false);
});
