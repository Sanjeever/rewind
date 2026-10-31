import {Alert} from 'react-native';
import locales from '../locales';
import restart from '../native/restart';
declare const ErrorUtils: {
  getGlobalHandler(): (error: unknown, fatal?: boolean) => void;
  setGlobalHandler(handler: (error: unknown, fatal?: boolean) => void): void;
};

export default function installErrorHandler() {
  const previous = ErrorUtils.getGlobalHandler();
  ErrorUtils.setGlobalHandler((error, fatal) => {
    previous(error, fatal);
    if (fatal && !__DEV__)
      Alert.alert(locales.ERROR, String(error), [
        {text: locales.RESTART_APP, onPress: () => restart.restart()},
        {text: locales.CONFIRM},
      ]);
  });
}
