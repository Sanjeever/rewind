import {NativeModules} from 'react-native';
const native = NativeModules.RewindSegmentation as {segment(texts: string[]): Promise<string[]>};

export default {
  nlp(texts: string[]) {
    return native.segment(texts);
  },
};
