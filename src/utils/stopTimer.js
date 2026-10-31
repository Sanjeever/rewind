const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var names = _interopRequireDefault(require('../events/names')),
  utils = require('./index'),
  types = require('./types'),
  events = require('../events/index'),
  l = {
    open: async function () {
      const minutes = await utils.dialogs.showTimePicker();
      if (types.isNumber(minutes)) events.emitter.emit(names.default.CloseTimerEvent, minutes);
    },
  };
exports.default = l;
