import {NativeModules} from 'react-native';
export default {restart: () => NativeModules.RewindDevice.restart()};
