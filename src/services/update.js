Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var ReactNative = require("react-native"),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  endpoints = require("./endpoints"),
  c = function () {
    return fetch(endpoints.UPDATE_CHANGELOG).then(function (e) {
      return e.json();
    }).then(function (e) {
      return (0 | e.versionCode) > 98 ? {
        log: e.changelog,
        url: e.url,
        apks: e.apks
      } : {};
    });
  },
  l = {
    checkAndAlert: function () {
      var e, n, t;
      return regeneratorRuntime.async(function (r) {
        for (;;) switch (r.prev = r.next) {
          case 0:
            r.next = 2;
            return regeneratorRuntime.awrap(c());
          case 2:
            e = r.sent;
            n = e.log;
            t = e.url;
            n ? ReactNative.Alert.alert('\u65b0\u7248\u672c\u5df2\u4e0a\u7ebf', '\n' + n, [{
              text: '\u53d6\u6d88',
              onPress: function () {
                return null;
              },
              style: 'cancel'
            }, {
              text: '\u6d4f\u89c8\u5668\u6253\u5f00',
              onPress: function () {
                return ReactNative.Linking.openURL(t);
              }
            }]) : toast(locales.default.UPDATE_NOT_READY);
          case 5:
          case "end":
            return r.stop();
        }
      }, null, this);
    },
    onlyCheck: function () {
      return regeneratorRuntime.async(function (e) {
        for (;;) switch (e.prev = e.next) {
          case 0:
            e.next = 2;
            return regeneratorRuntime.awrap(c());
          case 2:
            e.sent.log && toast(locales.default.UPDATE_READY);
          case 5:
          case "end":
            return e.stop();
        }
      }, null, this);
    }
  };
exports.default = l;
