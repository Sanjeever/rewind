Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var names = babelHelpers.interopRequireDefault(require("../events/names")),
  utils = require("./index"),
  types = require("./types"),
  events = require("../events/index"),
  l = {
    open: function () {
      var e;
      return regeneratorRuntime.async(function (t) {
        for (;;) switch (t.prev = t.next) {
          case 0:
            t.next = 2;
            return regeneratorRuntime.awrap(utils.dialogs.showTimePicker());
          case 2:
            e = t.sent;
            (0, types.isNumber)(e) && events.emitter.emit(names.default.CloseTimerEvent, e);
          case 4:
          case "end":
            return t.stop();
        }
      }, null, this);
    }
  };
exports.default = l;
