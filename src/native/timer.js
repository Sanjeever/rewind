Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var ReactNative = require("react-native"),
  u = ReactNative.NativeModules.RNBackgroundTimer,
  s = new ReactNative.NativeEventEmitter(u),
  n = new (function () {
    function e() {
      var t = this;
      babelHelpers.classCallCheck(this, e);
      this.uniqueId = 0;
      this.callbacks = {};
      s.addListener('backgroundTimer.timeout', function (e) {
        if (t.callbacks[e]) {
          var a = t.callbacks[e].callback;
          t.callbacks[e].interval ? u.setTimeout(e, t.callbacks[e].timeout) : delete t.callbacks[e];
          a();
        }
      });
    }
    babelHelpers.createClass(e, [{
      key: "start",
      value: function (e) {
        return u.start(e);
      }
    }, {
      key: "stop",
      value: function () {
        return u.stop();
      }
    }, {
      key: "setTimeout",
      value: function (e, t) {
        var a = ++this.uniqueId;
        this.callbacks[a] = {
          callback: e,
          interval: false,
          timeout: t
        };
        u.setTimeout(a, t);
        return a;
      }
    }, {
      key: "clearTimeout",
      value: function (e) {
        this.callbacks[e] && delete this.callbacks[e];
      }
    }, {
      key: "setInterval",
      value: function (e, t) {
        var a = ++this.uniqueId;
        this.callbacks[a] = {
          callback: e,
          interval: true,
          timeout: t
        };
        u.setTimeout(a, t);
        return a;
      }
    }, {
      key: "clearInterval",
      value: function (e) {
        this.callbacks[e] && delete this.callbacks[e];
      }
    }]);
    return e;
  }())();
exports.default = n;
