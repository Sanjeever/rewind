import {NativeModules, PermissionsAndroid, Platform} from 'react-native';
import {extractBasicInfo} from '../services/trackInfo';
import type {TrackFields, TrackId} from '../services/track';

export interface MediaTrack {
  id: string;
  title: string;
  singer: string;
  album: string;
  albumId: string;
  duration: number;
  path: string;
}

const native = NativeModules.RNMediaStore as {
  getPlayList(): Promise<{numbers: number; data: MediaTrack[]}>;
  getArtWork(id: TrackId): Promise<string>;
  publish(path: string, name: string, mime: string, subdirectory: string): Promise<string>;
  deleteAudio(id: string): Promise<boolean>;
};

async function writePermission() {
  if (Number(Platform.Version) > 28) return;
  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
  if (
    !(await PermissionsAndroid.check(permission)) &&
    (await PermissionsAndroid.request(permission)) !== PermissionsAndroid.RESULTS.GRANTED
  ) {
    throw new Error('需要媒体文件保存权限');
  }
}

export default {
  getPlayList: () => native.getPlayList(),
  getArtWork: (id: TrackId) => native.getArtWork(id),
  async publish(path: string, name: string, mime: string, subdirectory: string) {
    await writePermission();
    return native.publish(path, name, mime, subdirectory);
  },
  async deleteAudio(id: TrackId) {
    await writePermission();
    return native.deleteAudio(String(id));
  },
  async attachLocalPath<T extends TrackFields>(tracks: T[]) {
    const {data} = await native.getPlayList();
    const locals = data.filter((track) => track.duration / 1000 > 60);
    for (const track of tracks) {
      const info = extractBasicInfo(track);
      if (!Array.isArray(info.singer) || !info.singer.length) continue;
      for (const local of locals) {
        if (
          (info.song === local.title && info.singer[0].name === local.singer) ||
          info.singer[0].name + ' - ' + info.song === local.title
        )
          track.localPath = local.path;
      }
    }
    return tracks;
  },
};
