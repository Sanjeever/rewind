import {NativeModules} from 'react-native';
export default {
  lockToPortrait: () => NativeModules.RewindDevice.setOrientation(false),
  lockToLandscape: () => NativeModules.RewindDevice.setOrientation(true),
};
