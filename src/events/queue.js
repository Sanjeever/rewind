const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var names = _interopRequireDefault(require('./names')),
  events = require('./index'),
  utils = require('../utils/index'),
  o = {
    playMV: function (id, api) {
      events.emitter.emit(names.default.AUDIO_NOISY);
      utils.universalNavigator.navigate('Video', {
        mvid: id,
        api,
      });
    },
  };
exports.default = o;
