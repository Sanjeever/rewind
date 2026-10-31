import {NativeModules} from 'react-native';
export const nativeStorage = NativeModules.RewindStorage as {
  externalFilesDir: string;
  externalCacheDir: string;
  readLegacy(): Promise<Record<string, string>>;
  commitPlaylist(): Promise<void>;
  replaceFile(from: string, target: string): Promise<void>;
};

export const files_dir = nativeStorage.externalFilesDir + '/';
export const cache_dir = nativeStorage.externalCacheDir + '/';
export const playlist_dir = files_dir + 'playlist';
export const audio_cache = cache_dir + 'audio-cache';
