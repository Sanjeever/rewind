Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFormattedItem = void 0;
var providers = babelHelpers.interopRequireDefault(require("../../services/providers")),
  utils = require("../../utils/index");
exports.getFormattedItem = function (e, t) {
  t || (t = e.content ? providers.default.netEase : providers.default.qqMusic);
  var a = {};
  switch (t) {
    case providers.default.netEase:
      a.content = e.content;
      a.userName = e.user.nickname;
      a.userAvatar = e.user.avatarUrl + '?param=100y100';
      a.time = utils.timeFormatter.localeString(e.time);
      a.beReplieds = e.beReplied;
      break;
    case providers.default.qqMusic:
      a.content = e.rootcommentcontent;
      a.userName = e.nick;
      a.userAvatar = e.avatarurl;
      a.time = utils.timeFormatter.localeString(1e3 * e.time);
  }
  return a;
};
