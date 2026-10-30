const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "DataSource", {
  enumerable: true,
  get: function () {
    return LyricDataSource.default;
  }
});
exports.default = void 0;
var LyricDataSource = _interopRequireDefault(require("./LyricDataSource.js")),
  f = _interopRequireDefault(require("./VirtualLyricList.js")).default;
exports.default = f;
