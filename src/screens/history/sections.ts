import * as ReactNative from 'react-native';
import providers from '../../services/providers';
import locales from '../../locales/index';
export const sections = Object.keys(providers);
export const sectionTitleMap = {
  netEase: locales.NETEASE_MUSIC,
  qqMusic: locales.QQ_MUSIC,
  local: locales.LOCAL_MUSIC,
};
export const SECTION_HEIGHT = 50;
export const sectionStyle = ReactNative.StyleSheet.create({
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
