import {Linking} from 'react-native';
export default {playVideo: (url: string) => Linking.openURL(url)};
