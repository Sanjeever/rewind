import {fileURLToPath} from 'node:url';
import {dirname} from 'node:path';
import {getDefaultConfig, mergeConfig} from '@react-native/metro-config';

export default mergeConfig(getDefaultConfig(dirname(fileURLToPath(import.meta.url))), {
  resolver: {
    blockList: [/[/\\]\.cache[/\\].*/],
  },
});
