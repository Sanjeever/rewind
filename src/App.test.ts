import {jest} from '@jest/globals';
import assert from 'node:assert/strict';
import type {QueueSnapshot} from './player/types';
test('连续队列更新基于最新状态计算，提交回调取得最终队列', async () => {
  jest.resetModules();
  const dependencies = Object.fromEntries(
    [
      'react-native',
      'react-native-popup-menu',
      './storage',
      './modals',
      './events/names',
      './events',
      './storage/keys',
      './player',
      './bootstrap/errors',
      './native/navigationBar',
      './native/orientation',
      './native/permissions',
      './storage/lastQueue',
      './services/update',
      './navigation',
    ].map((name) => [name, {}]),
  );
  Object.assign(dependencies['react-native'], {
    StatusBar: undefined,
    View: undefined,
  });
  Object.assign(dependencies['react-native-popup-menu'], {
    MenuProvider: undefined,
  });
  Object.assign(dependencies['./storage'], {
    storage: undefined,
  });
  Object.assign(dependencies['./events'], {
    emitter: undefined,
  });
  dependencies['./settings/defaults'] = {
    defaultSettings: {},
  };
  dependencies['./utils'] = {
    extractKeyValue: () => ({}),
  };
  dependencies['./native/toast'] = {toast: undefined};
  for (const [name, value] of Object.entries(dependencies))
    jest.unstable_mockModule(name, () => ({
      default: value,
      ...value,
    }));
  let App!: typeof import('./App').default;
  await jest.isolateModulesAsync(async () => {
    App = (await import('./App')).default;
  });
  const app = new App({});
  type State = typeof app.state;
  const pending: {update(state: State): Partial<State> | null; callback?: () => void}[] = [];
  const observed: QueueSnapshot[] = [];
  app.setState = (update, callback) =>
    pending.push({
      update: (state) => (typeof update === 'function' ? update(state, app.props) : update),
      callback,
    });
  app.setPlayerData(
    (queue) => ({
      tracks: [
        ...queue.tracks,
        {
          id: 1,
        },
      ],
    }),
    (queue) => observed.push(queue),
  );
  app.setPlayerData(
    (queue) => ({
      tracks: [
        ...queue.tracks,
        {
          id: 2,
        },
      ],
    }),
    (queue) => observed.push(queue),
  );
  for (const {update} of pending)
    app.state = {
      ...app.state,
      ...update(app.state),
    };
  for (const {callback} of pending) callback?.();
  assert.deepEqual(app.state.playerInfo.tracks, [
    {
      id: 1,
    },
    {
      id: 2,
    },
  ]);
  assert.equal(observed[0], app.state.playerInfo);
  assert.equal(observed[1], app.state.playerInfo);
});
