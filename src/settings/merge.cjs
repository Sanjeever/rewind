function mergeSettings(stored, defaults) {
  if (!stored || typeof stored !== 'object' || Array.isArray(stored)) throw new Error('设置数据格式无效');
  const merged = {...stored};
  for (const [key, value] of Object.entries(defaults)) {
    const saved = stored[key];
    if (saved !== undefined && (!saved || typeof saved !== 'object' || Array.isArray(saved))) throw new Error(`设置字段格式无效：${key}`);
    merged[key] = {...value, ...saved};
  }
  return merged;
}

module.exports = {mergeSettings};
