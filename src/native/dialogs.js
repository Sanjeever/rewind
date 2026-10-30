import {NativeModules} from 'react-native';
const native = NativeModules.RewindDialogs;

export default {
  actionPositive: 'positive',
  prompt: (title, message, options = {}) => native.prompt(title, message, options),
  showPicker: (title, message, options) => native.showPicker(title, message, options),
};
