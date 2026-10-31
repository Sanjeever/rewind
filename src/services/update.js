import * as ReactNative from 'react-native';
import locales from '../locales/index';
import * as endpoints from './endpoints';
const c = () =>
  fetch(endpoints.UPDATE_CHANGELOG)
    .then((e) => e.json())
    .then((e) => {
      if ((0 | e.versionCode) > 98) {
        return {
          log: e.changelog,
          url: e.url,
          apks: e.apks,
        };
      }
      return {};
    });
const l = {
  checkAndAlert: async function () {
    try {
      const response = await c();
      if (response.log) {
        ReactNative.Alert.alert(
          '新版本已上线',
          `
${response.log}`,
          [
            {
              text: '取消',
              style: 'cancel',
            },
            {
              text: '浏览器打开',
              onPress: () => ReactNative.Linking.openURL(response.url),
            },
          ],
        );
      } else {
        toast(locales.UPDATE_NOT_READY);
      }
    } catch (error) {
      toast(`检查更新失败：${error.message}`);
    }
  },
  onlyCheck: async function () {
    const response = await c();
    if (response.log) {
      toast(locales.UPDATE_READY);
    }
  },
};
export default l;
