const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _asyncRuntime = require("@babel/runtime/helpers/regeneratorRuntime")();
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.request = exports.http = exports.getCsrfToken = exports.cryptoRequest = void 0;
var a,
  cookies = _interopRequireDefault(require("../../native/cookies")),
  axios = _interopRequireDefault(require("axios")),
  utils = require("../../utils/index"),
  crypto = _interopRequireDefault(require("../../native/crypto")),
  anonymousCookie = _interopRequireDefault(require("./anonymousCookie")),
  p = 'https://music.163.com',
  d = {
    Connection: 'keep-alive',
    'Content-Type': 'application/x-www-form-urlencoded',
    Referer: p,
    Host: 'music.163.com',
    Origin: p,
    'User-Agent': (a = ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:80.0) Gecko/20100101 Firefox/80.0', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.30 Safari/537.36', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Safari/605.1.15', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.30 Safari/537.36', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/13.10586'], a[utils.random.getInt(0, a.length)]),
    Cookie: anonymousCookie.default
  },
  f = axios.default.create({
    baseURL: p,
    headers: d,
    withCredentials: true
  });
exports.http = f;
exports.request = function (e) {
  var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : '',
    n = arguments.length > 2 ? arguments[2] : void 0,
    r = t.replace('?', ''),
    o = '' !== t ? e + "?" + r : "" + e;
  return f.get(o, {
    signal: null === n || void 0 === n ? void 0 : n.signal
  }).then(function (e) {
    return e.data;
  }).catch(function (e) {
    log('requestError', e);
  });
};
exports.cryptoRequest = function e(t, n, r) {
  var o,
    a,
    i,
    l,
    u = arguments;
  return _asyncRuntime.async(function (s) {
    for (;;) switch (s.prev = s.next) {
      case 0:
        o = u.length > 3 && void 0 !== u[3] ? u[3] : 0;
        s.next = 3;
        return _asyncRuntime.awrap(crypto.default.weapi(n));
      case 3:
        a = s.sent;
        i = "params=" + encodeURIComponent(a.params) + "&encSecKey=" + encodeURIComponent(a.encSecKey);
        s.next = 7;
        return _asyncRuntime.awrap(f.post(t, i, {
          signal: null === r || void 0 === r ? void 0 : r.signal
        }).catch(function (e) {
          log('requestError', e);
        }));
      case 7:
        if (!('' == (l = s.sent).data && o < 10)) {
          s.next = 11;
          break;
        }
        log('RETRY', o);
        return s.abrupt("return", e(t, n, o + 1));
      case 11:
        return s.abrupt("return", l.data);
      case 12:
      case "end":
        return s.stop();
    }
  }, null, this);
};
exports.getCsrfToken = function () {
  return cookies.default.get(p).then(function (e) {
    var t;
    return null === (t = e.__csrf) || void 0 === t ? void 0 : t.value;
  });
};
