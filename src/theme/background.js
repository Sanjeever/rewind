const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
const _appStorage = require("./../storage/index.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initBackgroundState = exports.getBackground = void 0;
var keys = _interopRequireDefault(require("../storage/keys")),
  files = require("../storage/files"),
  o = {},
  i = false;
exports.getBackground = function () {
  return i ? o : s();
};
var s = async function () {
  try {
    const background = await _appStorage.storage.load({
      key: keys.default.background
    });
    o = typeof background.path === 'string' ? {
      url: background.path,
      opacity: background.opacity,
      blur: background.blur,
      error: false
    } : await p();
    return o;
  } catch (error) {
    if (error.name !== 'NotFoundError') throw error;
    o = {
      error: true
    };
    return o;
  } finally {
    i = true;
  }
};
exports.initBackgroundState = s;
var p = function () {
  return (0, files.getBackgroundCache)().then(function (e) {
    return e ? {
      url: e,
      opacity: .7
    } : {
      error: true
    };
  });
};
