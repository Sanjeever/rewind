import assert from 'node:assert/strict';
import {migrateStorage, marker} from './migrate';
function database(initial = {}) {
  const values = {
    ...initial,
  };
  return {
    values,
    getItem: async (key) => values[key] ?? null,
    setItem: async (key, value) => {
      values[key] = value;
    },
    setMany: async (entries) => {
      Object.assign(values, entries);
    },
    getMany: async (keys) => Object.fromEntries(keys.map((key) => [key, values[key] ?? null])),
  };
}
test('保留业务包装、索引、账号、队列与未知键，重复启动不覆盖新数据', async () => {
  const legacy = {
    settings: JSON.stringify({
      rawData: {
        hideStatusBar: {
          on: false,
        },
      },
      expires: null,
    }),
    userInfo: JSON.stringify({
      rawData: {
        netEase: {
          id: 123,
        },
      },
      expires: null,
    }),
    lastPlayedTracks: JSON.stringify({
      rawData: {
        tracks: [
          {
            id: 9,
          },
        ],
        index: 0,
        api: 'netEase',
      },
    }),
    map: JSON.stringify({
      innerVersion: 11,
      index: 1,
      __keys__: {
        musicHistory: ['1'],
      },
    }),
    map_0: JSON.stringify({
      rawData: [
        {
          id: 9,
        },
      ],
    }),
    custom: 'unknown',
  };
  const destination = database();
  let reads = 0;
  const options = {
    readLegacy: async () => {
      reads++;
      return legacy;
    },
    destination,
    validatePlaylists: async () => {},
  };
  await migrateStorage(options);
  for (const key of Object.keys(legacy)) assert.equal(destination.values[key], legacy[key]);
  destination.values.settings = 'changed';
  await migrateStorage(options);
  assert.equal(reads, 1);
  assert.equal(destination.values.settings, 'changed');
});
test('写入或读回失败时不标记完成，重试恢复全部旧值', async () => {
  const destination = database();
  const getMany = destination.getMany;
  destination.getMany = async () => ({
    settings: null,
  });
  const options = {
    readLegacy: async () => ({
      settings: '{"rawData":42}',
    }),
    destination,
    validatePlaylists: async () => {},
  };
  await assert.rejects(migrateStorage(options), /读回失败/);
  assert.equal(destination.values[marker], undefined);
  destination.getMany = getMany;
  await migrateStorage(options);
  assert.equal(destination.values.settings, '{"rawData":42}');
  assert.ok(destination.values[marker]);
});
test('歌单损坏或旧数据库不可读时停止启动且保留旧数据', async () => {
  const destination = database();
  await assert.rejects(
    migrateStorage({
      readLegacy: async () => ({
        settings: 'old',
      }),
      destination,
      validatePlaylists: async () => {
        throw new Error('歌单损坏');
      },
    }),
    /歌单损坏/,
  );
  assert.deepEqual(destination.values, {});
  await assert.rejects(
    migrateStorage({
      readLegacy: async () => {
        throw new Error('数据库不可读');
      },
      destination,
      validatePlaylists: async () => {},
    }),
    /数据库不可读/,
  );
  assert.deepEqual(destination.values, {});
});
test('迁移完成后仍检查歌单，不用空列表覆盖后续损坏文件', async () => {
  const destination = database({
    [marker]: '{"version":1}',
    settings: '保留新设置',
  });
  await assert.rejects(
    migrateStorage({
      readLegacy: async () => {
        throw new Error('不应重读旧库');
      },
      destination,
      validatePlaylists: async () => {
        throw new Error('歌单损坏');
      },
    }),
    /歌单损坏/,
  );
  assert.equal(destination.values.settings, '保留新设置');
});
