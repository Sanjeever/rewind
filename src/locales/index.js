import languageModule from '../native/language';
import en_USModule from './en_US';
import zh_CNModule from './zh_CN';
import zh_HKModule from './zh_HK';
import zh_TWModule from './zh_TW';
const p =
  {
    zh_CN: zh_CNModule,
    zh_TW: zh_TWModule,
    zh_HK: zh_HKModule,
    en_US: en_USModule,
  }[languageModule.language] || zh_CNModule;
export default p;
