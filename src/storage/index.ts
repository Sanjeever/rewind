import {NativeModules} from 'react-native';
import {createAsyncStorage} from '@react-native-async-storage/async-storage';
import Storage from 'react-native-storage';
import {migrateStorage} from './migrate';
import playlistFiles from './playlistFiles';
import {nativeStorage} from './paths';
import type {NativeAudioPlayer} from '../native/audioPlayer';

const backend = createAsyncStorage('rewind');
export let storage: Storage;

export async function initializeStorage() {
  await migrateStorage({
    readLegacy: () => nativeStorage.readLegacy(),
    destination: backend,
    validatePlaylists: () => playlistFiles.validate(),
  });
  const configured = new Storage({
    size: 2048,
    storageBackend: backend,
    defaultExpires: null,
    enableCache: false,
  }) as Storage & {_mapPromise: Promise<void>};
  storage = configured;
  await configured._mapPromise;
  let megabytes = 200;
  try {
    megabytes = await storage.load<number>({key: 'maxCacheSize'});
  } catch (error) {
    if (!(error instanceof Error && error.name === 'NotFoundError')) throw error;
  }
  await (NativeModules.RNAudioPlayer as NativeAudioPlayer).configureCacheSize(megabytes);
}
