import {DeviceEventEmitter, Image, NativeModules} from 'react-native';
import names from '../events/names';

export interface PlayerError {
  type: number;
  message: string | null;
}
export interface NowPlaying {
  title?: string | null;
  artist?: string | null;
  album?: string | null;
  artwork?: string | null;
  duration?: number;
  elapsedTime?: number;
}
export interface NativeAudioPlayer {
  prepare(
    source: string,
    callback: (error: PlayerError | null, info: {duration: number} | null) => void,
  ): void;
  play(callback: (completed: boolean) => void): void;
  pause(callback: () => void): void;
  release(): void;
  getCurrentTime(callback: (seconds: number, playing: boolean) => void): void;
  setCurrentTime(seconds: number, play: boolean): void;
  setVolume(left: number, right: number): void;
  getSystemVolume(callback: (error: null, info: {volume: number}) => void): void;
  setSystemVolume(value: number): void;
  showSystemStreamVolumeUI(): void;
  setNowPlaying(info: NowPlaying): void;
  updatePlayback(info: NowPlaying): void;
  enableControl(name: string, enabled: boolean): void;
  setHandleAudioFocus(enabled: boolean): void;
  configureCacheSize(megabytes: number): Promise<null>;
  getCacheSize(): Promise<number>;
  clearCache(): Promise<null>;
  openEqualizer(): Promise<null>;
}

export const native = NativeModules.RNAudioPlayer as NativeAudioPlayer;
const actions = new Map<string, () => void>();
DeviceEventEmitter.addListener(names.NATIVE_NOTIFICATION_ACTION_EVENT, (event: {name: string}) =>
  actions.get(event.name)?.(),
);

export default class AudioPlayer {
  loaded: boolean;
  duration: number;
  volume: number;
  constructor(source: string | number, callback?: (error: PlayerError | null) => void) {
    this.loaded = false;
    this.duration = -1;
    this.volume = 1;
    const uri = typeof source === 'number' ? Image.resolveAssetSource(source)!.uri : source;
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
  play(callback?: (completed: boolean) => void) {
    if (this.loaded) native.play(callback || (() => {}));
    else callback?.(false);
    return this;
  }
  pause(callback?: () => void) {
    if (this.loaded) native.pause(callback || (() => {}));
    return this;
  }
  release() {
    native.release();
    this.loaded = false;
    return this;
  }
  setVolume(value: number) {
    this.volume = value;
    native.setVolume(value, value);
    return this;
  }
  getCurrentTime(callback: (seconds: number, playing: boolean) => void) {
    if (this.loaded) native.getCurrentTime(callback);
  }
  setCurrentTime(seconds: number, play = true) {
    if (this.loaded) native.setCurrentTime(seconds, play);
    return this;
  }
  static getSystemVolume(callback: (error: null, info: {volume: number}) => void) {
    native.getSystemVolume(callback);
  }
  static setSystemVolume(value: number) {
    native.setSystemVolume(value);
  }
  static showSystemStreamVolumeUI() {
    native.showSystemStreamVolumeUI();
  }
  static setNowPlaying(info: NowPlaying) {
    native.setNowPlaying(info);
  }
  static enableControl(name: string, enabled: boolean) {
    native.enableControl(name, enabled);
  }
  static setHandleAudioFocus(enabled: boolean) {
    native.setHandleAudioFocus(enabled);
  }
  static on(name: string, callback: () => void) {
    actions.set(name, callback);
    return () => {
      if (actions.get(name) === callback) actions.delete(name);
    };
  }
  static updatePlayback(info: NowPlaying) {
    native.updatePlayback(info);
  }
  static openEqualizer() {
    return native.openEqualizer();
  }
}
