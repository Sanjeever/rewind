import {NativeModules} from 'react-native';
import BlobUtil from 'react-native-blob-util';

export const files_dir = NativeModules.RewindStorage.externalFilesDir + '/';
export const cache_dir = NativeModules.RewindStorage.externalCacheDir + '/';
export const playlist_dir = files_dir + 'playlist';
export const audio_cache = cache_dir + 'audio-cache';
export const picture_dir = BlobUtil.fs.dirs.PictureDir;
