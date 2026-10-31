import * as ReactNative from 'react-native';
export default function (e: ReactNative.ColorValue, t: boolean) {
  return ReactNative.TouchableNativeFeedback.Ripple(e, t);
}
