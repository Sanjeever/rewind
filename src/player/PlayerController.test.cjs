const assert = require('node:assert/strict');
const asDefault = value => ({__esModule: true, default: value});

afterEach(() => { delete global.toast; });

function controller() {
  const calls = {prepared: [], play: 0, pause: 0, release: 0, clearedTimers: [], toasts: [], history: []};
  const requests = [];
  let timerId = 0;
  const scheduled = new Map();
  class Audio {
    constructor(source, callback) { calls.prepared.push(source); this.ready = callback; }
    play() { calls.play++; }
    pause() { calls.pause++; }
    release() { calls.release++; }
    getCurrentTime(callback) { callback(12); }
    getDuration() { return 180; }
    static setNowPlaying() {}
    static updatePlayback() {}
  }
  const dependencies = {
    'react-native': {
      Animated: {Value: class {}},
      LayoutAnimation: {create() {}, Types: {}, Properties: {}},
    },
    '../theme/constants': {}, '../events/names': asDefault({}), '../storage/keys': asDefault({}),
    '../locales': asDefault({}), '../services': {}, '../events': {},
    '../utils/parseArtist': asDefault(value => value), '../utils/universalNavigator': asDefault({}), '../utils/stopTimer': asDefault({}),
    '../native/audioPlayer': asDefault(Audio),
    '../native/timer': asDefault({
      setTimeout(callback) { scheduled.set(++timerId, callback); return timerId; },
      clearTimeout(id) { calls.clearedTimers.push(id); scheduled.delete(id); },
    }),
    '../native/mediaStore': asDefault({}), '../native/shutdown': asDefault({}), '../native/wakeLock': asDefault({deactivate() {}}),
    '../storage': {}, '../storage/files': {isUsableFile: async () => true},
    '../storage/lastSong': asDefault({save: async () => {}}), '../storage/lastTime': asDefault({}),
    '../storage/lastQueue': asDefault({save: async () => {}}),
    '../storage/history': {musicHistory: song => calls.history.push(song)},
    './cache': asDefault(request => request), './lyricPreferences': asDefault({}),
    './playMode': asDefault({}), './lyrics': asDefault({}),
    './trackUrl': asDefault({getUrl: () => new Promise(resolve => requests.push(resolve))}),
    './notification': asDefault({}), './gestures': asDefault({}),
    './commands': {},
  };
  for (const [name, value] of Object.entries(dependencies)) jest.doMock(name, () => value);
  let Controller;
  jest.isolateModules(() => { Controller = require('./PlayerController.js').default; });
  const player = new Controller({tracks: [], songItem: null, api: null, settings: {}, setLyric() {}});
  player.setState = (update, callback) => {
    player.state = {...player.state, ...(typeof update === 'function' ? update(player.state) : update)};
    callback?.();
  };
  player.props.setPlayerData = (update, callback) => {
    const changes = typeof update === 'function' ? update(player.props) : update;
    player.props = {...player.props, ...changes};
    callback?.(player.props);
  };
  player.getLyric = () => {};
  player.loadLikelist = () => {};
  global.toast = message => calls.toasts.push(message);
  return {player, calls, requests, scheduled};
}

const tick = () => new Promise(resolve => setImmediate(resolve));
function play(player, id, api = 'netEase') {
  const song = {id, name: '歌曲'};
  player.handlePlayCommand({song, data: [song], index: 0, api});
}

test('快速切歌时跨来源相同 ID 与同曲重选都丢弃旧音源响应', async () => {
  const {player, calls, requests} = controller();
  play(player, 1);
  play(player, 1, 'qqMusic');
  play(player, 1, 'qqMusic');
  requests[2]('https://audio/current');
  await tick();
  requests[0]('https://audio/old-netease');
  requests[1]('https://audio/old-qq');
  await tick();
  assert.deepEqual(calls.prepared, ['https://audio/current']);
  assert.equal(player.props.api, 'qqMusic');
});

test('清空队列后迟到的音源不会开始播放，已准备音频被释放', async () => {
  const {player, calls, requests} = controller();
  play(player, 1);
  requests[0]('https://audio/first');
  await tick();
  const oldReady = player.audio.ready;
  play(player, 2);
  player.clearPlayingList();
  requests[1]('https://audio/second');
  oldReady(null);
  await tick();
  assert.deepEqual(calls.prepared, ['https://audio/first']);
  assert.equal(calls.release, 1);
  assert.equal(calls.play, 0);
  assert.deepEqual(player.props.tracks, []);
});

test('播放与暂停命令等待原生通知，状态通知不会再次发送播放指令', async () => {
  const {player, calls, requests, scheduled} = controller();
  play(player, 1);
  requests[0]('https://audio/current');
  await tick();
  player.audio.ready(null);
  assert.equal(calls.play, 1);
  assert.equal(player.state.playState, 'paused');
  assert.equal(player.state.loaded, true);
  player.handlePlaybackState({playing: true});
  assert.equal(player.state.playState, 'playing');
  assert.equal(player.state.currentTime, 12);
  assert.equal(scheduled.size, 1);
  player.handlePlaybackState({playing: true});
  player.pauseSound();
  assert.equal(player.state.playState, 'playing');
  player.handlePlaybackState({playing: false});
  assert.equal(player.state.playState, 'paused');
  assert.equal(calls.play, 1);
  assert.equal(calls.pause, 1);
  assert.equal(scheduled.size, 0);
});

test('后台停止界面进度轮询，回到前台恢复，暂停后不再轮询', async () => {
  const {player, requests, scheduled} = controller();
  play(player, 1);
  requests[0]('https://audio/current');
  await tick();
  player.handlePlaybackState({playing: true});
  assert.equal(scheduled.size, 1);
  player.handleAppStateChange('background');
  assert.equal(scheduled.size, 0);
  player.handleAppStateChange('active');
  assert.equal(scheduled.size, 1);
  player.handlePlaybackState({playing: false});
  assert.equal(scheduled.size, 0);
});

test('批量插入走统一队列规则，不启动或暂停当前歌曲', async () => {
  const {player, calls, requests} = controller();
  play(player, 1);
  requests[0]('https://audio/current');
  await tick();
  player.insertIntoQueue({data: [{id: 2}, {id: 2}, {id: 1}], type: 'array', api: 'netEase'});
  assert.deepEqual(player.props.tracks.map(song => song.id), [1, 2]);
  assert.equal(player.props.playingIndex, 0);
  assert.equal(calls.prepared.length, 1);
  assert.equal(calls.pause, 0);
});

test('卸载取消计时与订阅，迟到的音源不会恢复播放', async () => {
  const {player, calls, requests, scheduled} = controller();
  play(player, 1);
  const removed = [];
  player.unsubscribeCommands = () => removed.push('commands');
  player.subscriptions = [{remove: () => removed.push('events')}];
  player.playbackStateSubscription = {remove: () => removed.push('state')};
  player.backSubscription = {remove: () => removed.push('back')};
  player.appStateSubscription = {remove: () => removed.push('app')};
  player.notificationCleanup = () => removed.push('notification');
  player.componentWillUnmount();
  requests[0]('https://audio/late');
  await tick();
  assert.deepEqual(removed, ['commands', 'events', 'state', 'back', 'app', 'notification']);
  assert.deepEqual(calls.prepared, []);
  assert.equal(scheduled.size, 0);
});
