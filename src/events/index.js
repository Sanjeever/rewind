const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _objectSpread = require("@babel/runtime/helpers/objectSpread2");
const _objectWithoutProperties = require("@babel/runtime/helpers/objectWithoutProperties");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toPlayer = exports.toLongPressModal = exports.toInsertToList = exports.toDetailModal = exports.emitter = void 0;
var Emitter = _interopRequireDefault(require("./Emitter")),
  providers = _interopRequireDefault(require("../services/providers")),
  names = _interopRequireDefault(require("./names")),
  n = (0, Emitter.default)(),
  p = _objectSpread({}, n, {
    addListener: function (e, t) {
      p.on(e, t);
      return {
        remove: function () {
          p.off(e, t);
        }
      };
    }
  });
exports.emitter = p;
exports.toDetailModal = function (e) {
  var t = e.item,
    a = e.index,
    i = e.api,
    o = void 0 === i ? providers.default.netEase : i,
    r = _objectWithoutProperties(e, ["item", "index", "api"]);
  p.emit(names.default.DetailModal, _objectSpread({
    song: t,
    index: a,
    api: o
  }, r));
};
exports.toPlayer = function (e) {
  var t = e.item,
    a = e.data,
    i = e.index,
    o = e.api,
    r = void 0 === o ? providers.default.netEase : o,
    n = _objectWithoutProperties(e, ["item", "data", "index", "api"]);
  p.emit(names.default.Player, _objectSpread({
    song: t,
    data: a,
    index: i,
    api: r
  }, n));
};
exports.toInsertToList = function (e) {
  var t = e.data,
    a = e.api,
    i = void 0 === a ? providers.default.netEase : a,
    o = e.type,
    r = void 0 === o ? 'item' : o,
    n = _objectWithoutProperties(e, ["data", "api", "type"]);
  p.emit(names.default.InsertToList, _objectSpread({
    data: t,
    type: r,
    api: i
  }, n));
};
exports.toLongPressModal = function (e) {
  var t = e.item;
  p.emit(names.default.LongPressModal, {
    item: t
  });
};
