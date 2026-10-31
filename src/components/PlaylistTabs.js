import LottieReactNative from 'lottie-react-native';
import 'react';
import * as reactNativeSpringScrollview from './Scrolling.js';
import * as components from './index';
import * as constants from '../theme/constants';
import layout from '../theme/layout';
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
      <LottieReactNative
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
