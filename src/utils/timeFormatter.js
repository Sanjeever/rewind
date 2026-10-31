const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var dayjs = _interopRequireDefault(require('dayjs')),
  languageModule = _interopRequireDefault(require('../native/language')),
  Runtime572 = require('dayjs/plugin/localizedFormat'),
  Runtime573 = require('dayjs/locale/en'),
  Runtime574 = require('dayjs/locale/zh-cn'),
  i = {
    zh_CN: Runtime574,
    zh_TW: Runtime574,
    zh_HK: Runtime574,
    en_US: Runtime573,
  };
dayjs.default.extend(Runtime572);
dayjs.default.locale(i[languageModule.default.language]);
var D = function (e) {
    var t = new Date(e);
    return {
      year: t.getFullYear(),
      month: t.getMonth() + 1,
      day: t.getDate(),
    };
  },
  g = {
    parseTime: function (e) {
      if (!e) return '0:00';
      var t = Math.floor(e / 60),
        a = Math.floor(e - 60 * t);
      return t + ':' + (a = a < 10 ? '0' + a : a);
    },
    isToday: function (e) {
      var t = D(e),
        a = t.month,
        r = t.day,
        n = D(Date.now()),
        u = n.month,
        l = n.day;
      return a == u && r == l;
    },
    useDate: D,
    diffInDays: function (e, t) {
      var a = Date.UTC(e.getFullYear(), e.getMonth(), e.getDate()),
        r = Date.UTC(t.getFullYear(), t.getMonth(), t.getDate());
      return Math.floor((r - a) / 864e5);
    },
    isSameDay: function (e, t) {
      return (0, dayjs.default)(e).isSame((0, dayjs.default)(t), 'day');
    },
    localeString: function (e) {
      var t = 'dddd, MMM D';
      (0, dayjs.default)(e).isSame(Date.now(), 'year') || (t += ', YYYY');
      return (0, dayjs.default)(e).format(t);
    },
  };
exports.default = g;
