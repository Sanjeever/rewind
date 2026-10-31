const assert = require('node:assert/strict');
const {normalizeTrack, extractFullInfo, getTrackKey} = require('./trackInfo.js');

test('网易云、QQ 与本地歌曲使用一致的展示结构，保留原始数据供旧接口与存储使用', () => {
  const sources = [
    {
      api: 'netEase',
      id: 1,
      name: '歌曲',
      ar: [{name: '歌手'}],
      al: {name: '专辑', picUrl: 'https://cover'},
      dt: 3000,
    },
    {
      api: 'qqMusic',
      mid: 'qq1',
      name: '歌曲',
      singer: [{name: '歌手'}],
      album: {name: '专辑', mid: 'album1'},
      interval: 3,
    },
    {
      api: 'local',
      id: 1,
      title: '歌曲',
      singer: '歌手',
      album: '专辑',
      albumId: 0,
      path: 'content://media/1',
      duration: 3000,
    },
  ];
  for (const source of sources) {
    const track = normalizeTrack(source);
    assert.equal(track.title, '歌曲');
    assert.deepEqual(track.artists, ['歌手']);
    assert.equal(track.album, '专辑');
    assert.equal(track.duration, 3000);
    assert.equal(track.source, source);
    assert.equal(extractFullInfo(source).api, source.api);
  }
});

test('同名歌曲、跨来源相同 ID、本地不同路径不会共享队列身份', () => {
  const keys = [
    getTrackKey({id: 1, name: '同名'}, 'netEase'),
    getTrackKey({id: 2, name: '同名'}, 'netEase'),
    getTrackKey({id: 1, name: '同名'}, 'qqMusic'),
    getTrackKey({id: 1, path: 'content://media/1'}, 'local'),
    getTrackKey({id: 1, path: 'content://media/2'}, 'local'),
  ];
  assert.equal(new Set(keys).size, keys.length);
  assert.equal(getTrackKey({mid: 'mid', songmid: 'mid'}, 'qqMusic'), 'qqMusic:mid');
});

test('本地零专辑 ID 仍识别为本地来源，QQ 缺专辑时不会生成 undefined 封面地址', () => {
  assert.equal(extractFullInfo({albumId: 0}).api, 'local');
  const image = normalizeTrack({songmid: 'mid', singer: [{name: '歌手'}]}, 'qqMusic').artwork;
  assert.equal(image.includes('undefined'), false);
});
