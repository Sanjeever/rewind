Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var reactNativeDialogs = babelHelpers.interopRequireDefault(require("react-native-dialogs"));
reactNativeDialogs.default.assignDefaults({
  positiveText: '\u786e\u8ba4'
});
var l = function (e, r, t) {
    var a,
      n,
      l,
      s,
      i,
      c,
      o,
      v = arguments;
    return regeneratorRuntime.async(function (b) {
      for (;;) switch (b.prev = b.next) {
        case 0:
          a = v.length > 3 && void 0 !== v[3] ? v[3] : function (e) {
            return -1 === e.value;
          };
          b.next = 3;
          return regeneratorRuntime.awrap(reactNativeDialogs.default.showPicker(r, null, {
            items: e
          }));
        case 3:
          if (n = b.sent, l = n.selectedItem) {
            b.next = 7;
            break;
          }
          return b.abrupt("return", void 0);
        case 7:
          if (!a(l)) {
            b.next = 16;
            break;
          }
          b.next = 10;
          return regeneratorRuntime.awrap(reactNativeDialogs.default.prompt(t, null, {
            keyboardType: 'decimal-pad'
          }));
        case 10:
          i = b.sent;
          c = i.action;
          o = i.text;
          c === reactNativeDialogs.default.actionPositive && (s = Number(o));
          b.next = 17;
          break;
        case 16:
          s = l.value;
        case 17:
          return b.abrupt("return", s);
        case 18:
        case "end":
          return b.stop();
      }
    }, null, this);
  },
  s = {
    showNumberPicker: l,
    showTimePicker: function () {
      var e;
      return regeneratorRuntime.async(function (r) {
        for (;;) switch (r.prev = r.next) {
          case 0:
            r.next = 2;
            return regeneratorRuntime.awrap(l([{
              label: '5 \u5206\u949f',
              value: 5
            }, {
              label: '10 \u5206\u949f',
              value: 10
            }, {
              label: '15 \u5206\u949f',
              value: 15
            }, {
              label: '30 \u5206\u949f',
              value: 30
            }, {
              label: '\u81ea\u5b9a\u4e49',
              value: -1
            }], '\u5728\u4ee5\u4e0b\u65f6\u95f4\u540e\u505c\u6b62', '\u8f93\u5165\u5728\u65f6\u95f4\u540e\u505c\u6b62(\u5206\u949f)'));
          case 2:
            e = r.sent;
            return r.abrupt("return", e);
          case 4:
          case "end":
            return r.stop();
        }
      }, null, this);
    },
    showCacheSizePicker: function () {
      var e;
      return regeneratorRuntime.async(function (r) {
        for (;;) switch (r.prev = r.next) {
          case 0:
            r.next = 2;
            return regeneratorRuntime.awrap(l([{
              label: '128 MB',
              value: 128
            }, {
              label: '256 MB',
              value: 256
            }, {
              label: '512 MB',
              value: 512
            }, {
              label: '1024 MB',
              value: 1024
            }, {
              label: '\u81ea\u5b9a\u4e49\u5927\u5c0f',
              value: -1
            }], '\u9009\u62e9\u7f13\u5b58\u4e0a\u9650', '\u8f93\u5165\u4f60\u60f3\u8981\u7684\u7f13\u5b58\u4e0a\u9650(MB)'));
          case 2:
            e = r.sent;
            return r.abrupt("return", e);
          case 4:
          case "end":
            return r.stop();
        }
      }, null, this);
    }
  };
exports.default = s;
