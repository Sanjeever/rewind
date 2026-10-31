import providers from '../../services/providers';
import * as utils from '../../utils/index';
export const getFormattedItem = function (e, t) {
  if (!t) {
    t = e.content ? providers.netEase : providers.qqMusic;
  }
  const a = {};
  switch (t) {
    case providers.netEase:
      a.content = e.content;
      a.userName = e.user.nickname;
      a.userAvatar = `${e.user.avatarUrl}?param=100y100`;
      a.time = utils.timeFormatter.localeString(e.time);
      a.beReplieds = e.beReplied;
      break;
    case providers.qqMusic:
      a.content = e.rootcommentcontent;
      a.userName = e.nick;
      a.userAvatar = e.avatarurl;
      a.time = utils.timeFormatter.localeString(1000 * e.time);
  }
  return a;
};
