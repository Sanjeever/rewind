Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var ReactNative = require("react-native"),
  notification = babelHelpers.interopRequireDefault(require("../settings/notification")),
  keys = babelHelpers.interopRequireDefault(require("../storage/keys")),
  audioPlayer = babelHelpers.interopRequireDefault(require("../native/audioPlayer")),
  f = {
    init: function (e) {
      var n;
      return regeneratorRuntime.async(function (t) {
        for (;;) switch (t.prev = t.next) {
          case 0:
            t.next = 2;
            return regeneratorRuntime.awrap(storage.load({
              key: keys.default.musicNotification
            }).then(function (e) {
              if (e) return e;
              throw new Error('nmsl');
            }).catch(function () {
              return notification.default.configObject;
            }));
          case 2:
            n = t.sent;
            audioPlayer.default.enableControl('previousTrack', n.prev.on);
            audioPlayer.default.enableControl('playPause', n.play.on);
            audioPlayer.default.enableControl('nextTrack', n.next.on);
            audioPlayer.default.enableControl('stop', n.stop.on);
            n.prev.on && audioPlayer.default.on('previousTrack', function () {
              e.changeSong('pre');
            });
            n.play.on && (audioPlayer.default.on('play', function () {
              e.playSound();
            }), audioPlayer.default.on('pause', function () {
              e.pauseSound();
            }));
            n.next.on && audioPlayer.default.on('nextTrack', function () {
              e.changeSong('next');
            });
            n.stop.on && audioPlayer.default.on('stop', function () {
              e.exit();
            });
            ReactNative.Platform.Version >= 29 && audioPlayer.default.enableControl('seek', n.seekbar.on);
          case 12:
          case "end":
            return t.stop();
        }
      }, null, this);
    }
  };
exports.default = f;
