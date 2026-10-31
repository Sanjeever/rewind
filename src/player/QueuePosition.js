import Text from './../components/Text.js';
import * as React from 'react';
import * as ReactNative from 'react-native';
class QueuePosition extends React.PureComponent {
  render() {
    const props = this.props;
    const {extraBottomValue, animtedOpacity, currentIndex, tracksLength} = props;
    return (
      <ReactNative.Animated.View
        accessible={false}
        style={[
          {
            position: 'absolute',
            padding: 10,
            alignSelf: 'center',
            bottom: 5 + extraBottomValue,
            opacity: animtedOpacity,
          },
        ]}
      >
        <Text
          style={[
            {
              fontSize: 11,
              textAlign: 'center',
              opacity: 0.5,
            },
          ]}
        >
          {currentIndex}
          {' / '}
          {tracksLength}
        </Text>
      </ReactNative.Animated.View>
    );
  }
}
export default QueuePosition;
