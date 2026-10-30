import {DeviceEventEmitter, NativeModules} from 'react-native';
const callbacks = new Map();
let nextId = 0;
const native = NativeModules.RewindDevice;
DeviceEventEmitter.addListener('backgroundTimer.timeout', id => {
  const task = callbacks.get(id);
  if (!task) return;
  if (task.interval) native.setTimeout(id, task.timeout);
  else callbacks.delete(id);
  task.callback();
});
function schedule(callback, timeout, interval) {
  const id = ++nextId;
  callbacks.set(id, {callback, timeout, interval});
  native.setTimeout(id, timeout);
  return id;
}
export default {
  setTimeout: (callback, timeout) => schedule(callback, timeout, false),
  setInterval: (callback, timeout) => schedule(callback, timeout, true),
  clearTimeout: id => callbacks.delete(id),
  clearInterval: id => callbacks.delete(id),
};
