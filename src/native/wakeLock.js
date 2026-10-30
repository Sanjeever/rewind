import {NativeModules} from 'react-native';
export default {
  activate: () => NativeModules.RewindDevice.keepScreenOn(true),
  deactivate: () => NativeModules.RewindDevice.keepScreenOn(false),
};
