import {toast} from '../native/toast';
import * as ReactNative from 'react-native';
import locales from '../locales/index';
import * as endpoints from './endpoints';
import * as z from 'zod/mini';
const update = z.looseObject({
  versionCode: z.number(),
  changelog: z.optional(z.string()),
  url: z.optional(z.string()),
  apks: z.optional(z.unknown()),
});
const c = () =>
  fetch(endpoints.UPDATE_CHANGELOG)
    .then((e) => e.json().then((value: unknown) => update.parse(value)))
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
              onPress: () => ReactNative.Linking.openURL(response.url!),
            },
          ],
        );
      } else {
        toast(locales.UPDATE_NOT_READY);
      }
    } catch (error) {
      toast(`检查更新失败：${error instanceof Error ? error.message : String(error)}`);
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
