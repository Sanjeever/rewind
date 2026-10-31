import 'react';
import * as ReactNative from 'react-native';
import * as constants from '../theme/constants';
const UComponent = function (e: ReactNative.SwitchProps) {
  return (
    <ReactNative.Switch
      trackColor={{
        true: constants.COLORS.primaryAlpha50,
        false: constants.COLORS.primaryAlpha20,
      }}
      thumbColor={constants.COLORS.secondary}
      {...e}
    />
  );
};
export default UComponent;
