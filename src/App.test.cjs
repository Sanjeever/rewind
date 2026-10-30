const assert = require('node:assert/strict');

test('连续队列更新基于最新状态计算，提交回调取得最终队列', () => {
  const dependencies = Object.fromEntries([
    './bootstrap/globals', 'react-native', 'react-native-popup-menu', './storage', './modals',
    './events/names', './events', './storage/keys', './player', './bootstrap/errors',
    './native/navigationBar', './native/orientation', './native/permissions', './storage/lastQueue',
    './services/update', './navigation',
  ].map(name => [name, {}]));
  dependencies['./settings/defaults'] = {defaultSettings: {}};
  dependencies['./utils'] = {extractKeyValue: () => ({})};
  for (const [name, value] of Object.entries(dependencies)) jest.doMock(name, () => value);
  let App;
  jest.isolateModules(() => { App = require('./App.js').default; });
  const app = new App({});
  const pending = [];
  const observed = [];
  app.setState = (update, callback) => pending.push({update, callback});
  app.setPlayerData(queue => ({tracks: [...queue.tracks, {id: 1}]}), queue => observed.push(queue));
  app.setPlayerData(queue => ({tracks: [...queue.tracks, {id: 2}]}), queue => observed.push(queue));
  for (const {update} of pending) app.state = {...app.state, ...update(app.state)};
  for (const {callback} of pending) callback();
  assert.deepEqual(app.state.playerInfo.tracks, [{id: 1}, {id: 2}]);
  assert.equal(observed[0], app.state.playerInfo);
  assert.equal(observed[1], app.state.playerInfo);
});
