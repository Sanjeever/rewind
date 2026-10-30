export default class LyricDataSource {
  constructor(data = [], keyExtractor = (item, index) => JSON.stringify(item) + '_' + index) {
    this.data = data;
    this.keyExtractor = keyExtractor;
    this.listeners = new Set();
  }
  notify(method, ...args) { for (const listener of this.listeners) listener[method]?.(...args); }
  push(item) { this.data.push(item); this.notify('onPush', item); }
  unshift(item) { this.data.unshift(item); this.notify('onUnshift', item); }
  splice(index, count, ...items) { this.data.splice(index, count, ...items); this.notify('onSplice', index, count, ...items); }
  size() { return this.data.length; }
  set(index, item) { this.data[index] = item; this.notify('onSet', index, item); }
  setDirty() { this.notify('onSetDirty'); }
  get(index) { return this.data[index]; }
  getKey(item, index) { return this.keyExtractor(item, index); }
  _addListener(listener) { this.listeners.add(listener); }
  _removeListener(listener) { this.listeners.delete(listener); }
}
