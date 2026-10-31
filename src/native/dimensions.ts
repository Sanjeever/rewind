import {Dimensions, StatusBar} from 'react-native';
export default {
  get(
    name: 'REAL_WINDOW_HEIGHT' | 'REAL_WINDOW_WIDTH' | 'STATUS_BAR_HEIGHT' | 'SOFT_MENU_BAR_HEIGHT',
  ) {
    const screen = Dimensions.get('screen');
    const window = Dimensions.get('window');
    return {
      REAL_WINDOW_HEIGHT: screen.height,
      REAL_WINDOW_WIDTH: screen.width,
      STATUS_BAR_HEIGHT: StatusBar.currentHeight ?? 0,
      SOFT_MENU_BAR_HEIGHT: Math.max(
        0,
        screen.height - window.height - (StatusBar.currentHeight ?? 0),
      ),
    }[name];
  },
};
