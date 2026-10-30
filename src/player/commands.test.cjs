const {test} = require('node:test');
const assert = require('node:assert/strict');
const {playTracks, insertTracks, clearQueue, subscribePlaybackCommands} = require('./commands.js');

test('播放、插入和清空经过同一命令订阅，解除订阅后不再处理', () => {
  const received = [];
  const dispose = subscribePlaybackCommands({
    play: command => received.push(['play', command]),
    insert: command => received.push(['insert', command]),
    remove: command => received.push(['remove', command]),
  });
  const song = {id: 1};
  playTracks({song, tracks: [song], index: 0, api: 'netEase'});
  insertTracks({tracks: [song], api: 'qqMusic'});
  clearQueue();
  assert.deepEqual(received, [
    ['play', {song, data: [song], index: 0, api: 'netEase'}],
    ['insert', {data: [song], type: 'array', api: 'qqMusic'}],
    ['play', {type: 'clearPlayingList'}],
  ]);
  dispose();
  clearQueue();
  assert.equal(received.length, 3);
});
