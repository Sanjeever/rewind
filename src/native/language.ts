import {NativeModules} from 'react-native';
const RewindDevice = NativeModules.RewindDevice as {
  language: string;
  setLanguageCode(code: string): void;
};
export default {
  language: RewindDevice.language,
  setLanguageCode: (code: string) => RewindDevice.setLanguageCode(code),
};
