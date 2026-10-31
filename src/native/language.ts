import {device} from './info';
export default {
  language: device.language,
  setLanguageCode: (code: string) => device.setLanguageCode(code),
};
