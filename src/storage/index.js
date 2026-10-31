import {NativeModules} from 'react-native';
import {createAsyncStorage} from '@react-native-async-storage/async-storage';
import Storage from 'react-native-storage';
import {migrateStorage} from './migrate';
import playlistFiles from './playlistFiles';

const backend = createAsyncStorage('rewind');
export let storage;

export async function initializeStorage() {
  await migrateStorage({
    readLegacy: () => NativeModules.RewindStorage.readLegacy(),
    destination: backend,
    validatePlaylists: () => playlistFiles.validate(),
  });
  storage = new Storage({
    size: 2048,
    storageBackend: backend,
    defaultExpires: null,
    enableCache: false,
  });
  await storage._mapPromise;
  let megabytes = 200;
  try {
    megabytes = await storage.load({key: 'maxCacheSize'});
  } catch (error) {
    if (error.name !== 'NotFoundError') throw error;
  }
  await NativeModules.RNAudioPlayer.configureCacheSize(megabytes);
}
