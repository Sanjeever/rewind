import * as ReactNative from 'react-native';
import logger from '../services/logger';
import toastModule from '../native/toast';
global.toast = function (e, a = ReactNative.ToastAndroid.SHORT) {
  if (e) {
    toastModule.show(String(e), a);
  }
};
global.log = logger;
