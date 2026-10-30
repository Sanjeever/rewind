const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var locales = _interopRequireDefault(require("../locales/index")),
  f = {
    configObject: {
      prev: {
        title: locales.default.ACTION_PREVIOUS,
        on: true
      },
      play: {
        title: locales.default.ACTION_PLAY_PAUSE,
        on: true
      },
      next: {
        title: locales.default.ACTION_NEXT,
        on: true
      },
      stop: {
        title: locales.default.ACTION_STOP,
        on: true
      },
      seekbar: {
        title: locales.default.ACTION_SEEKBAR,
        on: true
      }
    },
    configKeys: ['prev', 'play', 'next', 'stop', 'seekbar']
  };
exports.default = f;
