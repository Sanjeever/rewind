import {PermissionsAndroid, Platform} from 'react-native';
export default {
  async checkPermission() {
    const audio = Platform.Version >= 33 ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    if (!await PermissionsAndroid.check(audio)) await PermissionsAndroid.request(audio);
    if (Platform.Version >= 33 && !await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)) {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    }
    return true;
  },
};
