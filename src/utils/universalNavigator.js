import {createNavigationContainerRef} from '@react-navigation/native';
export const navigationRef = createNavigationContainerRef();
export default {
  navigate(name, params) {
    if (navigationRef.isReady()) navigationRef.navigate(name, params);
  },
};
