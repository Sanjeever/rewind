import 'react';
import * as ReactNative from 'react-native';
import * as constants from '../../theme/constants';
const OComponent = function ({
  imgUrl,
  style,
  nativeOffset,
}: {
  imgUrl?: string;
  style?: ReactNative.StyleProp<ReactNative.ImageStyle>;
  nativeOffset?: {y: ReactNative.Animated.Value};
}) {
  if (imgUrl) {
    return (
      <ReactNative.Animated.Image
        style={[
          {
            height: 150,
            width: 150,
            borderRadius: 75,
            borderWidth: 1,
            borderColor: '#fff',
            marginTop: 20,
          },
          nativeOffset && {
            transform: [
              {
                scale: nativeOffset.y.interpolate({
                  inputRange: [-constants.DEVICE_WIDTH, 0],
                  outputRange: [2, 1],
                  extrapolate: 'clamp',
                }),
              },
              {
                translateY: nativeOffset.y.interpolate({
                  inputRange: [-constants.DEVICE_WIDTH, 0, constants.DEVICE_WIDTH],
                  outputRange: [-constants.DEVICE_WIDTH / 5, 0, constants.DEVICE_WIDTH / 4],
                }),
              },
            ],
          },
          style,
        ]}
        source={{
          uri: imgUrl,
        }}
      />
    );
  }
  return null;
};
export default OComponent;
