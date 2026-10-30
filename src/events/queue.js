Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var names = babelHelpers.interopRequireDefault(require("./names")),
  events = require("./index"),
  utils = require("../utils/index"),
  o = {
    playMV: function (e, t) {
      return regeneratorRuntime.async(function (a) {
        for (;;) switch (a.prev = a.next) {
          case 0:
            events.emitter.emit(names.default.AUDIO_NOISY);
            utils.universalNavigator.navigate('Video', {
              mvid: e,
              api: t
            });
          case 2:
          case "end":
            return a.stop();
        }
      }, null, this);
    }
  };
exports.default = o;
