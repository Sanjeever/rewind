import {NativeModules} from 'react-native';

export const files_dir = NativeModules.RewindStorage.externalFilesDir + '/';
export const cache_dir = NativeModules.RewindStorage.externalCacheDir + '/';
export const playlist_dir = files_dir + 'playlist';
export const audio_cache = cache_dir + 'audio-cache';
