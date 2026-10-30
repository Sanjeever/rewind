const _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var icons = _interopRequireDefault(require("../../theme/icons")),
  endpoints = require("../../services/endpoints"),
  o = "http://q1.qlogo.cn/g?b=qq&nk=%qq&s=640&timestamp=" + Date.now(),
  r = {
    persons: [{
      name: '\u9cb8\u843d'
    }, {
      name: '\u4e00\u5934\u9e8b\u9e7f'
    }, {
      name: 'Kuss'
    }],
    sites: [{
      name: '\u5012\u5e26\u9996\u9875',
      url: endpoints.HOST_PAGE,
      icon: icons.default.WEB
    }, {
      name: '\u7535\u62a5\u7fa4\u7ec4',
      url: 'https://t.me/Rewind_Group',
      icon: icons.default.CHAT_OUTLINE
    }, {
      name: '\u7535\u62a5\u9891\u9053',
      url: 'https://t.me/Rewind_News',
      icon: icons.default.BELL_OUTLINE
    }],
    qqs: ['1737787988', '1287976625', '2360314753'],
    qqAvatarUrl: o
  };
exports.default = r;
