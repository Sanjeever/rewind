import 'react';
import * as ReactNative from 'react-native';
import * as utils from '../utils/index';
interface Props extends ReactNative.TouchableNativeFeedbackProps {
  size?: number;
  touchableBackground?: ReactNative.ColorValue;
  onPress?: () => void;
}
const UComponent = function ({
  style,
  size = 40,
  children,
  touchableBackground = 'rgba(255,255,255,0.3)',
  onPress,
  ...rest
}: Props) {
  return (
    <ReactNative.View
      style={[
        {
          height: size,
          width: size,
          borderRadius: size / 2,
          backgroundColor: 'rgba(0,0,0,0)',
          alignItems: 'center',
          justifyContent: 'center',
        },
        ReactNative.StyleSheet.flatten(style),
      ]}
    >
      <ReactNative.TouchableNativeFeedback
        background={utils.getRipple(touchableBackground, true)}
        onPress={function () {
          return onPress?.();
        }}
        {...rest}
      >
        {children}
      </ReactNative.TouchableNativeFeedback>
    </ReactNative.View>
  );
};
export default UComponent;
