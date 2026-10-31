import * as ReactNative from 'react-native';
const _ = ReactNative.Dimensions.get('screen');
export const DEVICE_WIDTH = _.width;
export const DEVICE_HEIGHT = _.height;
export const STATUS_BAR_HEIGHT = ReactNative.StatusBar.currentHeight!;
export const ITEM_HEIGHT = 70;
export const SPINKIT_SIZE = 60;
export const COLORS = {
  primary: '#fff',
  primaryAlpha70: 'rgba(255,255,255,0.7)',
  primaryAlpha50: 'rgba(255,255,255,0.5)',
  primaryAlpha20: 'rgba(255,255,255,0.2)',
  primaryAlpha10: 'rgba(255,255,255,0.1)',
  secondary: '#e0e0e0',
};
