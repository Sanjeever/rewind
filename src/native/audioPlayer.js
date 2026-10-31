import {DeviceEventEmitter, Image, NativeModules} from 'react-native';
import names from '../events/names';

const native = NativeModules.RNAudioPlayer;
const actions = new Map();
DeviceEventEmitter.addListener(names.NATIVE_NOTIFICATION_ACTION_EVENT, (event) =>
  actions.get(event.name)?.(),
);

export default class AudioPlayer {
  constructor(source, callback) {
    this.loaded = false;
    this.duration = -1;
    this.volume = 1;
    const uri = typeof source === 'number' ? Image.resolveAssetSource(source).uri : source;
    native.prepare(uri, (error, info) => {
      if (info) this.duration = info.duration;
      this.loaded = error === null;
      callback?.(error);
    });
  }
  isLoaded() {
    return this.loaded;
  }
  getDuration() {
    return this.duration;
  }
  getVolume() {
    return this.volume;
  }
  play(callback) {
    if (this.loaded) native.play(callback || (() => {}));
    else callback?.(false);
    return this;
  }
  pause(callback) {
    if (this.loaded) native.pause(callback || (() => {}));
    return this;
  }
  release() {
    native.release();
    this.loaded = false;
    return this;
  }
  setVolume(value) {
    this.volume = value;
    native.setVolume(value, value);
    return this;
  }
  getCurrentTime(callback) {
    if (this.loaded) native.getCurrentTime(callback);
  }
  setCurrentTime(seconds, play = true) {
    if (this.loaded) native.setCurrentTime(seconds, play);
    return this;
  }
  static getSystemVolume(callback) {
    native.getSystemVolume(callback);
  }
  static setSystemVolume(value) {
    native.setSystemVolume(value);
  }
  static showSystemStreamVolumeUI() {
    native.showSystemStreamVolumeUI();
  }
  static setNowPlaying(info) {
    native.setNowPlaying(info);
  }
  static enableControl(name, enabled) {
    native.enableControl(name, enabled);
  }
  static setHandleAudioFocus(enabled) {
    native.setHandleAudioFocus(enabled);
  }
  static on(name, callback) {
    actions.set(name, callback);
    return () => {
      if (actions.get(name) === callback) actions.delete(name);
    };
  }
  static updatePlayback(info) {
    native.updatePlayback(info);
  }
  static openEqualizer() {
    return native.openEqualizer();
  }
}
