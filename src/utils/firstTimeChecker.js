const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
const _appStorage = require('./../storage/index.js');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = exports.check = void 0;
var keys = _interopRequireDefault(require('../storage/keys')),
  u = async function () {
    try {
      return await _appStorage.storage.load({
        key: keys.default.firstTime,
      });
    } catch (error) {
      if (error.name !== 'NotFoundError') throw error;
      await s();
      return true;
    }
  };
exports.check = u;
var s = function () {
    return _appStorage.storage.save({
      key: keys.default.firstTime,
      data: false,
    });
  },
  i = {
    check: u,
  };
exports.default = i;
