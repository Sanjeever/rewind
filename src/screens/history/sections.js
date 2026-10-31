const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.sectionTitleMap = exports.sectionStyle = exports.sections = exports.SECTION_HEIGHT = void 0;
var ReactNative = require('react-native'),
  providers = _interopRequireDefault(require('../../services/providers')),
  locales = _interopRequireDefault(require('../../locales/index')),
  s = Object.keys(providers.default);
exports.sections = s;
var o = {
  netEase: locales.default.NETEASE_MUSIC,
  qqMusic: locales.default.QQ_MUSIC,
  local: locales.default.LOCAL_MUSIC,
};
exports.sectionTitleMap = o;
exports.SECTION_HEIGHT = 50;
var u = ReactNative.StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
  },
  numbers: {
    width: 40,
    alignItems: 'center',
    textAlign: 'center',
  },
});
exports.sectionStyle = u;
