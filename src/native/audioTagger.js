import {NativeModules as _reactNative} from 'react-native';
const RNAudioTagger = _reactNative.RNAudioTagger;
const a = {
  commit: function (e, t) {
    return RNAudioTagger.commit(e, t);
  },
};
export default a;
