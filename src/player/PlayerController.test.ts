import {jest} from '@jest/globals';
import assert from 'node:assert/strict';
import zhCN from '../locales/zh_CN';
import type {Settings} from '../settings/defaults';
import type {TrackFields} from '../services/track';
import type {Provider} from '../services/providers';
import type {PlayerError} from '../native/audioPlayer';
import type PlayerController from './PlayerController';
import type {PlayerProps} from './types';
const asDefault = <T>(value: T) => ({
  __esModule: true,
  default: value,
});
async function controller() {
  jest.resetModules();
  const calls: {
    prepared: string[];
    play: number;
    pause: number;
    release: number;
    seeks: {
      seconds: number;
      playing: boolean;
    }[];
    savedTimes: number[];
    clearedTimers: number[];
    toasts: unknown[];
    history: TrackFields[];
  } = {
    prepared: [],
    play: 0,
    pause: 0,
    release: 0,
    seeks: [],
    savedTimes: [],
    clearedTimers: [],
    toasts: [],
    history: [],
  };
  const requests: ((url: string) => void)[] = [];
  let timerId = 0;
  const scheduled = new Map<number, () => void>();
  const readiness = new WeakMap<object, (error: PlayerError | null) => void>();
  class Audio {
    constructor(source: string, callback: (error: PlayerError | null) => void) {
      calls.prepared.push(source);
      readiness.set(this, callback);
    }
    play() {
      calls.play++;
    }
    pause() {
      calls.pause++;
    }
    release() {
      calls.release++;
    }
    getCurrentTime(callback: (seconds: number) => void) {
      callback(12);
    }
    getDuration() {
      return 180;
    }
    setCurrentTime(seconds: number, playing: boolean) {
      calls.seeks.push({
        seconds,
        playing,
      });
    }
    static setNowPlaying() {}
    static updatePlayback() {}
  }
  const dependencies = {
    '../native/toast': {
      toast: (message: unknown) => calls.toasts.push(message),
    },
    'react-native': {
      Animated: {
        Value: class {},
      },
      LayoutAnimation: {
        create() {},
        Types: {},
        Properties: {},
      },
      AppState: undefined,
      BackHandler: undefined,
      DeviceEventEmitter: undefined,
      PanResponder: undefined,
    },
    '../theme/constants': {
      DEVICE_WIDTH: undefined,
      DEVICE_HEIGHT: undefined,
    },
    '../events/names': asDefault({}),
    '../storage/keys': asDefault({}),
    '../locales': asDefault(zhCN),
    '../services': {
      Netease: undefined,
    },
    '../events': {
      emitter: undefined,
    },
    '../utils/parseArtist': asDefault((value: unknown) => value),
    '../utils/universalNavigator': asDefault({}),
    '../utils/stopTimer': asDefault({}),
    '../native/audioPlayer': asDefault(Audio),
    '../native/timer': asDefault({
      setTimeout(callback: () => void) {
        scheduled.set(++timerId, callback);
        return timerId;
      },
      clearTimeout(id: number) {
        calls.clearedTimers.push(id);
        scheduled.delete(id);
      },
    }),
    '../native/mediaStore': asDefault({}),
    '../native/shutdown': asDefault({}),
    '../native/wakeLock': asDefault({
      deactivate() {},
    }),
    '../storage': {
      storage: undefined,
    },
    '../storage/files': {
      isUsableFile: async () => true,
    },
    '../storage/lastSong': asDefault({
      save: async () => {},
    }),
    '../storage/lastTime': asDefault({
      get: async () => 1.83,
      save: async (seconds: number) => {
        calls.savedTimes.push(seconds);
      },
    }),
    '../storage/lastQueue': asDefault({
      save: async () => {},
    }),
    '../storage/history': {
      musicHistory: (song: TrackFields) => calls.history.push(song),
    },
    './cache': asDefault(<T>(request: T) => request),
    './lyricPreferences': asDefault({}),
    './playMode': asDefault({}),
    './lyrics': asDefault({}),
    './trackUrl': asDefault({
      getUrl: () => new Promise<string>((resolve) => requests.push(resolve)),
    }),
    './notification': asDefault({}),
    './gestures': asDefault({}),
    './commands': {
      subscribePlaybackCommands: undefined,
      subscribePlaybackEvent: undefined,
    },
  };
  for (const [name, value] of Object.entries(dependencies))
    jest.unstable_mockModule(name, () => ({
      default: value,
      ...value,
    }));
  let Controller!: typeof PlayerController;
  let settings!: Settings;
  await jest.isolateModulesAsync(async () => {
    Controller = (await import('./PlayerController')).default;
    const {defaultSettings} = await import('../settings/defaults');
    settings = Object.fromEntries(
      Object.entries(defaultSettings).map(([key, value]) => [key, value.on]),
    ) as Settings;
  });
  const props: PlayerProps = {
    tracks: [],
    songItem: null,
    api: null,
    settings,
    playingIndex: null,
    songItemInfo: {
      song: null,
      singer: null,
    },
    lyric: null,
    hasTrans: false,
    setDisplayNowPlaying() {},
    setPlayerData() {},
    setLyric() {},
  };
  const player = new Controller(props);
  player.setState = (update, callback) => {
    player.state = {
      ...player.state,
      ...(typeof update === 'function' ? update(player.state, player.props) : update),
    };
    callback?.();
  };
  props.setPlayerData = (update, callback) => {
    const changes = typeof update === 'function' ? update(player.props) : update;
    Object.assign(player, {
      props: {
        ...player.props,
        ...changes,
      },
    });
    callback?.(player.props);
  };
  player.getLyric = async () => {};
  player.loadLikelist = async () => {};
  return {
    player,
    calls,
    requests,
    scheduled,
    getReady() {
      assert.ok(player.audio);
      const callback = readiness.get(player.audio);
      assert.ok(callback);
      return callback;
    },
  };
}
const tick = () => new Promise((resolve) => setImmediate(resolve));
test('恢复队列不清零已保存进度，之后选择新歌曲才重置进度', async () => {
  const {player, calls, requests, getReady} = await controller();
  player.props.settings.autoLoadLastPlayedTracks = true;
  const song = {
    id: 1,
    name: '歌曲',
  };
  player.handlePlayCommand({
    song,
    data: [song],
    index: 0,
    api: 'netEase',
    restore: true,
  });
  requests[0]('https://audio/one');
  await tick();
  getReady()(null);
  await tick();
  assert.deepEqual(calls.seeks, [
    {
      seconds: 1.83,
      playing: false,
    },
  ]);
  assert.deepEqual(calls.savedTimes, []);
  play(player, 2);
  requests[1]('https://audio/two');
  await tick();
  getReady()(null);
  await tick();
  assert.deepEqual(calls.savedTimes, [0]);
});
function play(player: PlayerController, id: number, api: Provider = 'netEase') {
  const song = {
    id,
    name: '歌曲',
  };
  player.handlePlayCommand({
    song,
    data: [song],
    index: 0,
    api,
  });
}
test('快速切歌时跨来源相同 ID 与同曲重选都丢弃旧音源响应', async () => {
  const {player, calls, requests} = await controller();
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
  const {player, calls, requests, getReady} = await controller();
  play(player, 1);
  requests[0]('https://audio/first');
  await tick();
  const oldReady = getReady();
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
  const {player, calls, requests, scheduled, getReady} = await controller();
  play(player, 1);
  requests[0]('https://audio/current');
  await tick();
  getReady()(null);
  assert.equal(calls.play, 1);
  assert.equal(player.state.playState, 'paused');
  assert.equal(player.state.loaded, true);
  player.handlePlaybackState({
    playing: true,
  });
  assert.equal(player.state.playState, 'playing');
  assert.equal(player.state.currentTime, 12);
  assert.equal(scheduled.size, 1);
  player.handlePlaybackState({
    playing: true,
  });
  player.pauseSound();
  assert.equal(player.state.playState, 'playing');
  player.handlePlaybackState({
    playing: false,
  });
  assert.equal(player.state.playState, 'paused');
  assert.equal(calls.play, 1);
  assert.equal(calls.pause, 1);
  assert.equal(scheduled.size, 0);
});
test('后台停止界面进度轮询，回到前台恢复，暂停后不再轮询', async () => {
  const {player, requests, scheduled} = await controller();
  play(player, 1);
  requests[0]('https://audio/current');
  await tick();
  player.handlePlaybackState({
    playing: true,
  });
  assert.equal(scheduled.size, 1);
  player.handleAppStateChange('background');
  assert.equal(scheduled.size, 0);
  player.handleAppStateChange('active');
  assert.equal(scheduled.size, 1);
  player.handlePlaybackState({
    playing: false,
  });
  assert.equal(scheduled.size, 0);
});
test('批量插入走统一队列规则，不启动或暂停当前歌曲', async () => {
  const {player, calls, requests} = await controller();
  play(player, 1);
  requests[0]('https://audio/current');
  await tick();
  player.insertIntoQueue({
    data: [
      {
        id: 2,
      },
      {
        id: 2,
      },
      {
        id: 1,
      },
    ],
    type: 'array',
    api: 'netEase',
  });
  assert.deepEqual(
    player.props.tracks.map((song) => song.id),
    [1, 2],
  );
  assert.equal(player.props.playingIndex, 0);
  assert.equal(calls.prepared.length, 1);
  assert.equal(calls.pause, 0);
});
test('卸载取消计时与订阅，迟到的音源不会恢复播放', async () => {
  const {player, calls, requests, scheduled} = await controller();
  play(player, 1);
  const removed: string[] = [];
  player.unsubscribeCommands = () => removed.push('commands');
  player.subscriptions = [
    {
      remove: () => removed.push('events'),
    },
  ];
  player.playbackStateSubscription = {
    remove: () => removed.push('state'),
  };
  player.backSubscription = {
    remove: () => removed.push('back'),
  };
  player.appStateSubscription = {
    remove: () => removed.push('app'),
  };
  player.notificationCleanup = () => removed.push('notification');
  player.componentWillUnmount();
  requests[0]('https://audio/late');
  await tick();
  assert.deepEqual(removed, ['commands', 'events', 'state', 'back', 'app', 'notification']);
  assert.deepEqual(calls.prepared, []);
  assert.equal(scheduled.size, 0);
});
