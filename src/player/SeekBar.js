import * as React from 'react';
import reactNativeSlider from '@react-native-community/slider';
import styles from './styles';
class SeekBar extends React.PureComponent {
  render() {
    const props = this.props;
    const {
      showLyric,
      isRound,
      duration,
      currentTime,
      loaded,
      slidingStart,
      onSliderValueChange,
      slidingEnd,
      width,
      disabled,
    } = props;
    return React.createElement(reactNativeSlider, {
      disabled,
      animateTransitions: false,
      style: [
        {
          width,
          position: 'absolute',
          top: width,
          bottom: 0,
          height: 40,
          opacity: 1,
        },
        showLyric && {
          width,
          position: 'absolute',
          bottom: 0,
          top: width,
          opacity: 1,
        },
        showLyric && styles.sliderHide,
        isRound && !showLyric && styles.roundStyle,
      ],
      maximumTrackTintColor: 'rgba(0,0,0,0)',
      minimumTrackTintColor: 'rgba(255,255,255,0.8)',
      thumbTintColor: 'rgba(255,255,255,0.8)',
      maximumValue: duration && duration > 0 ? duration : 0,
      value: loaded && currentTime && currentTime > 0 ? currentTime : 0,
      trackStyle: [
        {
          top: 0,
          height: 2,
          borderRadius: 1,
        },
        (isRound === true || showLyric === true) && {
          top: null,
          bottom: 0,
        },
      ],
      thumbStyle: [
        {
          height: 2,
          width: 2,
          backgroundColor: 0,
        },
      ],
      onSlidingStart: slidingStart,
      onValueChange: onSliderValueChange,
      onSlidingComplete: slidingEnd,
      thumbTouchSize: {
        height: 40,
        width: 2 * width,
      },
    });
  }
}
export default SeekBar;
