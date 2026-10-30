import {NativeModules} from 'react-native';
export default {fire: () => NativeModules.RewindDevice.close()};
