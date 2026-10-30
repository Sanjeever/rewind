Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var ReactNative = require("react-native"),
  Runtime64 = babelHelpers.interopRequireDefault(require("@runtime/64")),
  names = babelHelpers.interopRequireDefault(require("../events/names")),
  a = ReactNative.NativeModules.RNAudioPlayer,
  s = {},
  d = null,
  f = function e(t, n) {
    var u = this;
    babelHelpers.classCallCheck(this, e);
    this.isLoaded = function () {
      return u._loaded;
    };
    this.play = function (e) {
      u._loaded ? a.play(function (t) {
        return e && e(t);
      }) : e && e(false);
      return u;
    };
    this.pause = function (e) {
      u._loaded && a.pause(function () {
        e && e();
      });
      return u;
    };
    this.release = function () {
      u._loaded && a.release();
      return u;
    };
    this.getDuration = function () {
      return u._duration;
    };
    this.getVolume = function () {
      return u._volume;
    };
    this.setVolume = function (e) {
      u._volume = e;
      a.setVolume(e, e);
      return u;
    };
    this.getCurrentTime = function (e) {
      u._loaded && a.getCurrentTime(e);
    };
    this.setCurrentTime = function (e) {
      var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
      u._loaded && a.setCurrentTime(e, t);
      return u;
    };
    var i = (0, Runtime64.default)(t);
    i ? (this._filename = i.uri, n = null) : this._filename = t;
    this._loaded = false;
    this._duration = -1;
    this._volume = 1;
    this._speed = 1;
    a.prepare(this._filename, function (e, t) {
      t && 'number' == typeof t.duration && (u._duration = t.duration);
      null === e && (u._loaded = true);
      n && n(e);
    });
  };
f.getSystemVolume = function (e) {
  a.getSystemVolume(function (t, n) {
    return e && e(t, n);
  });
};
f.setSystemVolume = function (e) {
  'number' == typeof e && a.setSystemVolume(e);
};
f.showSystemStreamVolumeUI = function () {
  a.showSystemStreamVolumeUI();
};
f.setNowPlaying = function (e) {
  a.setNowPlaying(e);
};
f.enableControl = function (e, t) {
  a.enableControl(e, t);
};
f.on = function (e, t) {
  d || (d = ReactNative.DeviceEventEmitter.addListener(names.default.NATIVE_NOTIFICATION_ACTION_EVENT, function (e) {
    var t;
    t = e.name;
    s[t] && s[t]();
  }));
  s[e] = t;
};
f.updatePlayback = function (e) {
  a.updatePlayback(e);
};
f.openEqualizer = a.openEqualizer;
var m = f;
exports.default = m;
