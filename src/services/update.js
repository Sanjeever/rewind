const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var ReactNative = require('react-native'),
  locales = _interopRequireDefault(require('../locales/index')),
  endpoints = require('./endpoints'),
  c = function () {
    return fetch(endpoints.UPDATE_CHANGELOG)
      .then(function (e) {
        return e.json();
      })
      .then(function (e) {
        return (0 | e.versionCode) > 98
          ? {
              log: e.changelog,
              url: e.url,
              apks: e.apks,
            }
          : {};
      });
  },
  l = {
    checkAndAlert: async function () {
      try {
        const response = await c();
        if (response.log)
          ReactNative.Alert.alert('新版本已上线', '\n' + response.log, [
            {
              text: '取消',
              style: 'cancel',
            },
            {
              text: '浏览器打开',
              onPress: () => ReactNative.Linking.openURL(response.url),
            },
          ]);
        else toast(locales.default.UPDATE_NOT_READY);
      } catch (error) {
        toast('检查更新失败：' + error.message);
      }
    },
    onlyCheck: async function () {
      const response = await c();
      if (response.log) toast(locales.default.UPDATE_READY);
    },
  };
exports.default = l;
