import icons from '../../theme/icons';
import * as endpoints from '../../services/endpoints';
const qqAvatarUrl = `http://q1.qlogo.cn/g?b=qq&nk=%qq&s=640&timestamp=${Date.now()}`;
const r = {
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
      name: '回听首页',
      url: endpoints.HOST_PAGE,
      icon: icons.WEB,
    },
    {
      name: '倒带反馈群',
      url: 'https://t.me/Rewind_Group',
      icon: icons.CHAT_OUTLINE,
    },
    {
      name: '倒带公告牌',
      url: 'https://t.me/Rewind_News',
      icon: icons.BELL_OUTLINE,
    },
  ],
  qqs: ['1737787988', '1287976625', '2360314753'],
  qqAvatarUrl,
};
export default r;
