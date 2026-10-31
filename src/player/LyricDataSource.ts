interface Changes<T> {
  onPush: [T];
  onUnshift: [T];
  onSplice: [number, number, ...T[]];
  onSet: [number, T];
  onSetDirty: [];
}
type Listener<T> = {[K in keyof Changes<T>]?: (...args: Changes<T>[K]) => void};
export default class LyricDataSource<T> {
  data: T[];
  keyExtractor: (item: T, index: number) => string;
  constructor(
    data: T[] = [],
    keyExtractor = (item: T, index: number) => JSON.stringify(item) + '_' + index,
  ) {
    this.data = data;
    this.keyExtractor = keyExtractor;
  }
  listeners = new Set<Listener<T>>();
  notify<K extends keyof Changes<T>>(method: K, ...args: Changes<T>[K]) {
    for (const listener of this.listeners) {
      const handler = listener[method] as ((...args: Changes<T>[K]) => void) | undefined;
      handler?.(...args);
    }
  }
  push(item: T) {
    this.data.push(item);
    this.notify('onPush', item);
  }
  unshift(item: T) {
    this.data.unshift(item);
    this.notify('onUnshift', item);
  }
  splice(index: number, count: number, ...items: T[]) {
    this.data.splice(index, count, ...items);
    this.notify('onSplice', index, count, ...items);
  }
  size() {
    return this.data.length;
  }
  set(index: number, item: T) {
    this.data[index] = item;
    this.notify('onSet', index, item);
  }
  setDirty() {
    this.notify('onSetDirty');
  }
  get(index: number) {
    return this.data[index];
  }
  getKey(item: T, index: number) {
    return this.keyExtractor(item, index);
  }
  _addListener(listener: Listener<T>) {
    this.listeners.add(listener);
  }
  _removeListener(listener: Listener<T>) {
    this.listeners.delete(listener);
  }
}
