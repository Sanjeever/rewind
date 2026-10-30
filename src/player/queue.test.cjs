const {test} = require('node:test');
const assert = require('node:assert/strict');
const {selectQueue, insertNext, removeFromQueue} = require('./queue.js');
const {createPlayOrder, reconcilePlayOrder, getNextPlayIndex, getRandomIndex, getNextPlayIndexByPagerPos} = require('./playOrder.js');
const {getTrackKey} = require('../services/trackFields.js');

function queue(tracks, index = 0, api = 'netEase') {
  return {tracks, songItem: tracks[index], playingIndex: index, api};
}

test('搜索插播按来源和 ID 去重，保留同名歌曲且不修改原始歌曲', () => {
  const first = Object.freeze({id: 1, name: '同名'});
  const second = Object.freeze({id: 2, name: '同名'});
  const current = queue(Object.freeze([first, second]));
  const source = Object.freeze({id: 1, name: '同名'});
  const selected = selectQueue(current, {song: source, data: [source], index: 0, api: 'qqMusic', type: 'insert'}, 'list');
  assert.deepEqual(selected.tracks.map(track => getTrackKey(track)), ['qqMusic:1', 'netEase:1', 'netEase:2']);
  assert.equal(selected.api, 'qqMusic');
  assert.equal(current.tracks.length, 2);
  assert.equal(source.api, undefined);
  const repeated = selectQueue(selected, {song: source, data: [source], index: 0, api: 'qqMusic', type: 'insert'}, 'list');
  assert.equal(repeated.tracks.length, 3);
});

test('切换歌单从首曲开始，随机模式保留选择位置，恢复队列保留混合来源', () => {
  const tracks = [{id: 1}, {mid: 'qq2', api: 'qqMusic'}];
  const command = {song: tracks[1], data: tracks, index: 1, api: 'netEase', type: 'ChangePlaylist'};
  assert.equal(selectQueue(queue([]), command, 'list').playingIndex, 0);
  assert.equal(selectQueue(queue([]), command, 'random').api, 'qqMusic');
  const restored = selectQueue(queue([]), {...command, type: undefined}, 'list');
  assert.equal(restored.playingIndex, 1);
  assert.equal(restored.tracks[1].api, 'qqMusic');
});

test('下一首插入移动已有歌曲、保持当前歌曲并消除批量重复', () => {
  const tracks = [{id: 1}, {id: 2}, {id: 3}];
  const next = insertNext(queue(tracks, 1), [tracks[0], tracks[1], tracks[0], {id: 4}], 'netEase');
  assert.deepEqual(next.tracks.map(song => song.id), [2, 1, 4, 3]);
  assert.equal(next.playingIndex, 0);
  assert.equal(next.songItem, tracks[1]);
  assert.deepEqual(tracks.map(song => song.id), [1, 2, 3]);
});

test('删除同名歌曲时保留其他 ID，删除当前位置之前的歌曲后重算索引', () => {
  const tracks = [{id: 1, name: '同名'}, {id: 2, name: '同名'}, {id: 3}];
  const result = removeFromQueue(queue(tracks, 2), tracks[0]);
  assert.deepEqual(result.tracks.map(song => song.id), [2, 3]);
  assert.equal(result.playingIndex, 1);
});

test('广播节目使用 mainTrackId 播放，同时保留节目 ID 和输入数据', () => {
  const song = Object.freeze({id: 7, mainTrackId: 11});
  const selected = selectQueue(queue([]), {song, data: [song], index: 0, api: 'netEase'}, 'list');
  assert.deepEqual(selected.songItem, {id: 11, mainTrackId: 11, rid: 7, api: 'netEase'});
  assert.equal(selected.tracks[0], selected.songItem);
  assert.equal(song.id, 7);
  const restored = selectQueue(selected, {song: selected.songItem, data: selected.tracks, index: 0, api: 'netEase'}, 'list');
  assert.equal(restored.songItem.rid, 7);
});

test('随机队列插入已有歌曲后仍在下一首播放，删除后保持剩余顺序且不产生越界索引', () => {
  const inserted = reconcilePlayOrder(['a', 'b', 'c'], ['a', 'c', 'b', 'd'], [2, 0, 1], 'a', ['c', 'd']);
  assert.deepEqual(inserted, [0, 1, 3, 2]);
  const removed = reconcilePlayOrder(['a', 'c', 'b', 'd'], ['a', 'b', 'd'], inserted, 'a');
  assert.deepEqual(removed, [0, 2, 1]);
});

test('列表和随机顺序在首尾正确循环，空队列无可播放索引', () => {
  const tracks = [1, 2, 3];
  assert.equal(getNextPlayIndex({type: 'next', tracks, playingIndex: 2}), 0);
  assert.equal(getNextPlayIndex({type: 'pre', tracks, playingIndex: 0}), 2);
  assert.equal(getNextPlayIndex({type: 'next', tracks: [], playingIndex: 0}), -1);
  const randomArray = [2, 0, 1];
  assert.equal(getRandomIndex({type: 'next', randomArray, playingIndex: 1}), 2);
  assert.equal(getRandomIndex({type: 'pre', randomArray, playingIndex: 2}), 1);
  assert.equal(getNextPlayIndexByPagerPos({pos: 2, playMode: 'random', randomArray, playingIndex: 1, len: 3}), 2);
  assert.deepEqual(createPlayOrder(5, () => 0).toSorted(), [0, 1, 2, 3, 4]);
  assert.deepEqual(createPlayOrder(0), []);
});
