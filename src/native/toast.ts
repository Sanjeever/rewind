import {ToastAndroid} from 'react-native';
export function toast(value: unknown, duration = ToastAndroid.SHORT) {
  if (value) ToastAndroid.show(String(value), duration);
}
export default ToastAndroid;
