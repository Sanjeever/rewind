import BlobUtil from 'react-native-blob-util';
import {NativeModules} from 'react-native';
import {audio_cache, files_dir} from './paths';

const fs = BlobUtil.fs;
export const isUsableFile = (path) => fs.exists(path);

export function bytesToSize(bytes) {
  if (bytes === 0) return '0 B';
  const unit = Math.floor(Math.log(bytes) / Math.log(1024));
  return (
    (bytes / Math.pow(1024, unit)).toFixed(1) +
    ' ' +
    ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'][unit]
  );
}

export async function getCurrentCache(path = audio_cache) {
  if (path === audio_cache) return NativeModules.RNAudioPlayer.getCacheSize();
  if (!(await fs.exists(path))) return 0;
  let total = 0;
  for (const entry of await fs.lstat(path)) {
    total += entry.type === 'file' ? Number(entry.size) : await getCurrentCache(entry.path);
  }
  return total;
}

export const clearCache = () => NativeModules.RNAudioPlayer.clearCache();

export async function moveToFiles({
  from,
  dest,
  fileName = String(Date.now()),
  clearOriginal = false,
}) {
  const source = from.replace(/^file:\/\//, '');
  const extension = source.match(/\.[^/.]+$/)?.[0] || '';
  const directory = files_dir + dest;
  const target = directory + '/' + fileName.replace(/[\\/:*?"<>|]/g, '_') + extension;
  if (!(await fs.isDir(directory))) await fs.mkdir(directory);
  await fs.cp(source, target + '.writing');
  await NativeModules.RewindStorage.replaceFile(target + '.writing', target);
  if (clearOriginal) await fs.unlink(source);
  return target;
}

export async function getBackgroundCache() {
  const directory = files_dir + 'background';
  if (!(await fs.exists(directory))) return null;
  const entries = (await fs.lstat(directory)).filter(
    (entry) => entry.type === 'file' && !entry.path.endsWith('.writing'),
  );
  entries.sort((a, b) => Number(b.lastModified) - Number(a.lastModified));
  return entries.length ? 'file://' + entries[0].path : null;
}

export async function removeBackground() {
  const directory = files_dir + 'background';
  if (await fs.exists(directory)) await fs.unlink(directory);
}
