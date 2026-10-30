Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var moment = babelHelpers.interopRequireDefault(require("moment")),
  language = babelHelpers.interopRequireDefault(require("../native/language")),
  _ = require("@runtime/572"),
  _2 = require("@runtime/573"),
  _3 = require("@runtime/574"),
  i = {
    zh_CN: _3,
    zh_TW: _3,
    zh_HK: _3,
    en_US: _2
  };
moment.default.extend(_);
moment.default.locale(i[language.default.language]);
var D = function (e) {
    var t = new Date(e);
    return {
      year: t.getFullYear(),
      month: t.getMonth() + 1,
      day: t.getDate()
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
      return (0, moment.default)(e).isSame((0, moment.default)(t), 'day');
    },
    localeString: function (e) {
      var t = 'dddd, MMM D';
      (0, moment.default)(e).isSame(Date.now(), 'year') || (t += ', YYYY');
      return (0, moment.default)(e).format(t);
    }
  };
exports.default = g;
