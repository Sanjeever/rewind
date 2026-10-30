Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var axios = babelHelpers.interopRequireDefault(require("axios")),
  crypto = babelHelpers.interopRequireDefault(require("../native/crypto")),
  i = function (e) {
    var n = Math.round(Date.now() / 1e3);
    return {
      query: "Action=LexicalAnalysis&Language=zh-CN&Nonce=5373&Region=ap-guangzhou&SecretId=REMOVED_TENCENT_CREDENTIAL&Text=" + e + "&Timestamp=" + n + "&Token=&Version=2019-04-08",
      obj: {
        Action: 'LexicalAnalysis',
        Language: 'zh-CN',
        Nonce: '5373',
        Region: 'ap-guangzhou',
        SecretId: "REMOVED_TENCENT_CREDENTIAL",
        Text: e,
        Timestamp: n,
        Token: '',
        Version: '2019-04-08'
      }
    };
  },
  s = function (e) {
    return "GETnlp.tencentcloudapi.com/?" + e;
  },
  c = {
    nlp: function (e) {
      var n, t, r, a, c, l, p, f, g, d, b;
      return regeneratorRuntime.async(function (m) {
        for (;;) switch (m.prev = m.next) {
          case 0:
            n = i(e);
            t = n.query;
            r = n.obj;
            a = s(t);
            m.next = 4;
            return regeneratorRuntime.awrap(crypto.default.tencentSignature(a));
          case 4:
            c = m.sent;
            l = c.signature;
            p = "https://nlp.tencentcloudapi.com";
            f = babelHelpers.objectSpread({}, r, {
              Signature: l
            });
            m.next = 10;
            return regeneratorRuntime.awrap(axios.default.get(p, {
              params: f
            }));
          case 10:
            if (g = m.sent, !((null === (d = g.data.Response.PosTokens) || void 0 === d ? void 0 : d.length) > 0)) {
              m.next = 16;
              break;
            }
            if (!((b = d.map(function (e) {
              return e.Word;
            })).length > 0)) {
              m.next = 16;
              break;
            }
            return m.abrupt("return", b.filter(function (e) {
              return e.length > 1;
            }));
          case 16:
          case "end":
            return m.stop();
        }
      }, null, this);
    }
  };
exports.default = c;
