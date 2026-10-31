import BlobUtil from 'react-native-blob-util';
import {nativeStorage, playlist_dir} from './paths';
import type {PlaylistDocument} from './models';

const file = playlist_dir + '/playlist.json';
let writes = Promise.resolve();

async function write(contents: string) {
  if (!(await BlobUtil.fs.isDir(playlist_dir))) await BlobUtil.fs.mkdir(playlist_dir);
  await BlobUtil.fs.writeFile(file + '.writing', contents, 'utf8');
  await nativeStorage.commitPlaylist();
}

function parse(contents: string): PlaylistDocument {
  const data: unknown = JSON.parse(contents);
  if (!data || typeof data !== 'object' || !('playlists' in data) || !Array.isArray(data.playlists))
    throw new Error('本地歌单格式无效');
  return data as PlaylistDocument;
}

export default {
  async validate() {
    if (await BlobUtil.fs.exists(file)) parse(await BlobUtil.fs.readFile(file, 'utf8'));
  },
  async getPlaylist(): Promise<PlaylistDocument> {
    if (await BlobUtil.fs.exists(file)) return parse(await BlobUtil.fs.readFile(file, 'utf8'));
    if (!(await BlobUtil.fs.isDir(playlist_dir))) await BlobUtil.fs.mkdir(playlist_dir);
    const data = {playlists: []};
    await BlobUtil.fs.writeFile(file, JSON.stringify(data), 'utf8');
    return data;
  },
  async toPlaylist(data: PlaylistDocument) {
    const contents = JSON.stringify(data);
    parse(contents);
    writes = writes.then(
      () => write(contents),
      () => write(contents),
    );
    return writes;
  },
};
