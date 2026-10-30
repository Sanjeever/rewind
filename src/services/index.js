const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Netease", {
  enumerable: true,
  get: function () {
    return netease.default;
  }
});
Object.defineProperty(exports, "provider", {
  enumerable: true,
  get: function () {
    return provider.default;
  }
});
Object.defineProperty(exports, "QQMusic", {
  enumerable: true,
  get: function () {
    return qqmusic.default;
  }
});
var netease = _interopRequireDefault(require("./netease/index")),
  provider = _interopRequireDefault(require("./provider")),
  qqmusic = _interopRequireDefault(require("./qqmusic/index"));
