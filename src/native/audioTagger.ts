import {NativeModules} from 'react-native';
export interface AudioMetadata {
  title?: string;
  artist?: string;
  album?: string;
  image?: string | null;
}
export default NativeModules.RNAudioTagger as {
  commit(path: string, metadata: AudioMetadata): Promise<{code: 200}>;
};
