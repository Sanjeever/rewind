export const marker = '__rewind_storage_migration_v1';

export interface MigrationBackend {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  setMany(entries: Record<string, string>): Promise<void>;
  getMany(keys: string[]): Promise<Record<string, string | null>>;
}

interface MigrationOptions {
  readLegacy(): Promise<Record<string, string>>;
  destination: MigrationBackend;
  validatePlaylists(): Promise<void>;
}

export async function migrateStorage({
  readLegacy,
  destination,
  validatePlaylists,
}: MigrationOptions) {
  await validatePlaylists();
  if (await destination.getItem(marker)) return;
  const entries = await readLegacy();
  if (Object.keys(entries).length) {
    await destination.setMany(entries);
    const saved = await destination.getMany(Object.keys(entries));
    for (const [key, value] of Object.entries(entries)) {
      if (saved[key] !== value) throw new Error(`旧数据迁移读回失败：${key}`);
    }
  }
  await destination.setItem(
    marker,
    JSON.stringify({version: 1, count: Object.keys(entries).length}),
  );
  if (!(await destination.getItem(marker))) throw new Error('旧数据迁移状态写入失败');
}
