import LottieReactNative from 'lottie-react-native';
import {Animated} from 'react-native';
import 'react';
import * as reactNativeSpringScrollview from './Scrolling';
import * as components from './index';
import * as constants from '../theme/constants';
import layout from '../theme/layout';
const AnimatedLottie = Animated.createAnimatedComponent(LottieReactNative);
class PlaylistTabs extends reactNativeSpringScrollview.RefreshHeader {
  render() {
    if (this.state.status === 'refreshing') {
      return <components.Spinkit />;
    }
    const progress = this.props.offset.interpolate({
      inputRange: [-120, -60],
      outputRange: [1, 0],
    });
    return (
      <AnimatedLottie
        source={layout}
        progress={progress}
        style={{
          height: constants.SPINKIT_SIZE,
          width: constants.SPINKIT_SIZE,
          alignSelf: 'center',
        }}
      />
    );
  }
}
export default PlaylistTabs;
