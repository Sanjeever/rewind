Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var ReactNative = require("react-native"),
  a = 'android.permission.WRITE_EXTERNAL_STORAGE',
  o = 'android.permission.READ_EXTERNAL_STORAGE',
  u = {
    checkPermission: function () {
      var e, r;
      return regeneratorRuntime.async(function (n) {
        for (;;) switch (n.prev = n.next) {
          case 0:
            n.next = 2;
            return regeneratorRuntime.awrap(ReactNative.PermissionsAndroid.check(a));
          case 2:
            e = n.sent;
            n.next = 5;
            return regeneratorRuntime.awrap(ReactNative.PermissionsAndroid.check(o));
          case 5:
            if (r = n.sent, true === e) {
              n.next = 9;
              break;
            }
            n.next = 9;
            return regeneratorRuntime.awrap(ReactNative.PermissionsAndroid.request(a));
          case 9:
            if (true === r) {
              n.next = 12;
              break;
            }
            n.next = 12;
            return regeneratorRuntime.awrap(ReactNative.PermissionsAndroid.request(o));
          case 12:
            return n.abrupt("return", true);
          case 13:
          case "end":
            return n.stop();
        }
      }, null, this);
    }
  };
exports.default = u;
