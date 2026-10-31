import assert from 'node:assert/strict';
import {mergeSettings} from './merge.cjs';
test('新增设置时保留旧开关、零值和未知字段，不修改原配置', () => {
  const stored = {
    volume: {
      on: false,
      subtitle: 0,
    },
    custom: {
      value: '保留',
    },
  };
  const defaults = {
    volume: {
      on: true,
      subtitle: 10,
      title: '音量',
    },
    added: {
      on: true,
    },
  };
  const merged = mergeSettings(stored, defaults);
  assert.deepEqual(merged, {
    volume: {
      on: false,
      subtitle: 0,
      title: '音量',
    },
    added: {
      on: true,
    },
    custom: {
      value: '保留',
    },
  });
  merged.volume.on = true;
  assert.equal(stored.volume.on, false);
  assert.equal(defaults.volume.subtitle, 10);
});
test('损坏设置明确失败，不把旧值当作默认设置', () => {
  for (const stored of [
    null,
    'broken',
    [],
    {
      volume: null,
    },
    {
      volume: true,
    },
  ]) {
    assert.throws(
      () =>
        mergeSettings(stored, {
          volume: {
            on: false,
          },
        }),
      /格式无效/,
    );
  }
});
