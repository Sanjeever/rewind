import lottieReactNative from 'lottie-react-native';
import React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeSpringScrollview from './Scrolling.js';
import * as Index from './index';
import * as constants from '../theme/constants';
import _layout from '../theme/layout';
const style = {
  flex: 1,
  justifyContent: 'center',
};
class ParallaxList extends reactNativeSpringScrollview.RefreshHeader {
  render() {
    const status = this.state.status;
    if (status === 'allLoaded') {
      return null;
    }
    if (status === 'loading') {
      return (
        <ReactNative.View style={style}>
          <Index.Spinkit />
        </ReactNative.View>
      );
    }
    const props = this.props;
    const {offset, bottomOffset} = props;
    const progress = offset.interpolate({
      inputRange: [bottomOffset + 50, bottomOffset + 100],
      outputRange: [0, 1],
    });
    return (
      <ReactNative.View style={style}>
        <lottieReactNative
          source={_layout}
          progress={progress}
          style={{
            height: constants.SPINKIT_SIZE,
            width: constants.SPINKIT_SIZE,
            alignSelf: 'center',
          }}
        />
      </ReactNative.View>
    );
  }
}
export default ParallaxList;
ParallaxList.height = constants.SPINKIT_SIZE + 80;
