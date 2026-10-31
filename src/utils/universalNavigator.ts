import {createNavigationContainerRef} from '@react-navigation/native';
import type {AppRoutes, NavigateArgs} from '../navigation/types';
export const navigationRef = createNavigationContainerRef<AppRoutes>();
export default {
  navigate(...args: NavigateArgs) {
    if (navigationRef.isReady()) navigationRef.navigate(...args);
  },
};
