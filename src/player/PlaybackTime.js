import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeAnimatable from 'react-native-animatable';
import * as utils from '../utils/index';
class PlaybackTime extends React.PureComponent {
  render() {
    const props = this.props;
    const {width, animatedOpacity, color, duration, currentTime} = props;
    const u = `${utils.timeFormatter.parseTime(currentTime)} / ${utils.timeFormatter.parseTime(duration)}`;
    return (
      <reactNativeAnimatable.View
        pointerEvents={'none'}
        ref={(instance) => (this.slidingTimeText = instance)}
        animation={'fadeIn'}
        useNativeDriver={true}
        style={[
          {
            width,
            position: 'absolute',
            top: width,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
            opacity: 0.5,
          },
        ]}
      >
        <ReactNative.Animated.Text
          style={[
            {
              color,
              opacity: animatedOpacity,
            },
          ]}
        >
          {u}
        </ReactNative.Animated.Text>
      </reactNativeAnimatable.View>
    );
  }
}
export default PlaybackTime;
