import Text from './../components/Text.js';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as utils from '../utils/index';
import styles from './styles';
class LyricTime extends React.PureComponent {
  render() {
    const props = this.props;
    const {color, duration, currentTime, showLyric} = props;
    return (
      <ReactNative.View
        style={[
          styles.progressBar,
          showLyric && styles.sliderHide,
          {
            marginTop: -5,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          },
          styles.timeSoftPadding,
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              opacity: 0.7,
              color,
            },
            showLyric && {
              fontSize: 12,
            },
          ]}
        >{`${utils.timeFormatter.parseTime(currentTime)}  \t/\t  ${utils.timeFormatter.parseTime(duration)}`}</Text>
      </ReactNative.View>
    );
  }
}
export default LyricTime;
