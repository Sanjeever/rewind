import {NativeModules} from 'react-native';
const {RewindDevice} = NativeModules;
export default {language: RewindDevice.language, setLanguageCode: code => RewindDevice.setLanguageCode(code)};
