import {DeviceEventEmitter} from 'react-native';
import {device as native} from './info';
const callbacks = new Map<number, {callback(): void; timeout: number; interval: boolean}>();
let nextId = 0;
DeviceEventEmitter.addListener('backgroundTimer.timeout', (id: number) => {
  const task = callbacks.get(id);
  if (!task) return;
  if (task.interval) native.setTimeout(id, task.timeout);
  else callbacks.delete(id);
  task.callback();
});
function schedule(callback: () => void, timeout: number, interval: boolean) {
  const id = ++nextId;
  callbacks.set(id, {callback, timeout, interval});
  native.setTimeout(id, timeout);
  return id;
}
export default {
  setTimeout: (callback: () => void, timeout: number) => schedule(callback, timeout, false),
  setInterval: (callback: () => void, timeout: number) => schedule(callback, timeout, true),
  clearTimeout: (id: number) => {
    callbacks.delete(id);
    native.clearTimeout(id);
  },
  clearInterval: (id: number) => {
    callbacks.delete(id);
    native.clearTimeout(id);
  },
};
