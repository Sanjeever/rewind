const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var icons = _interopRequireDefault(require('../../theme/icons')),
  endpoints = require('../../services/endpoints'),
  o = 'http://q1.qlogo.cn/g?b=qq&nk=%qq&s=640&timestamp=' + Date.now(),
  r = {
    persons: [
      {
        name: '鲸落',
      },
      {
        name: '一头麋鹿',
      },
      {
        name: 'Kuss',
      },
    ],
    sites: [
      {
        name: '倒带首页',
        url: endpoints.HOST_PAGE,
        icon: icons.default.WEB,
      },
      {
        name: '电报群组',
        url: 'https://t.me/Rewind_Group',
        icon: icons.default.CHAT_OUTLINE,
      },
      {
        name: '电报频道',
        url: 'https://t.me/Rewind_News',
        icon: icons.default.BELL_OUTLINE,
      },
    ],
    qqs: ['1737787988', '1287976625', '2360314753'],
    qqAvatarUrl: o,
  };
exports.default = r;
