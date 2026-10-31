export function mergeSettings<T extends Record<string, object>>(
  stored: unknown,
  defaults: T,
): T & Record<string, unknown> {
  if (!stored || typeof stored !== 'object' || Array.isArray(stored))
    throw new Error('设置数据格式无效');
  const values = stored as Record<string, unknown>;
  const merged: Record<string, unknown> = {...values};
  for (const [key, value] of Object.entries(defaults)) {
    const saved = values[key];
    if (saved !== undefined && (!saved || typeof saved !== 'object' || Array.isArray(saved)))
      throw new Error(`设置字段格式无效：${key}`);
    merged[key] = {...value, ...saved};
  }
  return merged as T & Record<string, unknown>;
}
