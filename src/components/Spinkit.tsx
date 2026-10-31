import lottieReactNative from 'lottie-react-native';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as constants from '../theme/constants';
import loading from '../../assets/animations/loading';
class Spinkit extends React.PureComponent<{
  size?: number;
  style?: ReactNative.StyleProp<ReactNative.ViewStyle>;
}> {
  render() {
    const {size = constants.SPINKIT_SIZE, style} = this.props;
    return (
      <ReactNative.View
        style={[
          {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          },
          style,
        ]}
      >
        {React.createElement(lottieReactNative, {
          loop: true,
          autoPlay: true,
          source: loading,
          style: {
            height: size,
            width: size,
            alignItems: 'center',
          },
          duration: 2000,
        })}
      </ReactNative.View>
    );
  }
}
export default Spinkit;
