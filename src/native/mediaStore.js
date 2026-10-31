import {NativeModules, PermissionsAndroid, Platform} from 'react-native';
import {extractBasicInfo} from '../services/trackInfo';

const native = NativeModules.RNMediaStore;

async function writePermission() {
  if (Platform.Version > 28) return;
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
  getArtWork: (id) => native.getArtWork(id),
  async publish(path, name, mime, subdirectory) {
    await writePermission();
    return native.publish(path, name, mime, subdirectory);
  },
  async deleteAudio(id) {
    await writePermission();
    return native.deleteAudio(String(id));
  },
  async attachLocalPath(tracks) {
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
