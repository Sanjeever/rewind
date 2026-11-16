import * as React from 'react';
import reactNativeSlider from '../components/Slider';
import styles from './styles';
export interface SeekBarProps {
  inline?: boolean;
  showLyric: boolean;
  isRound: boolean;
  duration: number;
  currentTime: number;
  loaded: boolean;
  slidingStart(value: number): void;
  onSliderValueChange(value: number): void;
  slidingEnd(value: number): void;
  width: number;
  disabled?: boolean;
  SOFT_MENU_HEIGHT?: number;
}
class SeekBar extends React.PureComponent<SeekBarProps> {
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
      style: [
        {
          width,
          position: 'absolute',
          top: width,
          bottom: 0,
          height: 48,
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
        props.inline && {
          position: 'relative',
          top: undefined,
          bottom: undefined,
          width: '100%',
          height: 48,
          opacity: 1,
        },
      ],
      maximumTrackTintColor: props.inline ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0)',
      accessibilityLabel: '播放进度',
      minimumTrackTintColor: 'rgba(255,255,255,0.8)',
      thumbTintColor: 'rgba(255,255,255,0.8)',
      maximumValue: duration && duration > 0 ? duration : 0,
      value: loaded && currentTime && currentTime > 0 ? currentTime : 0,
      onSlidingStart: slidingStart,
      onValueChange: onSliderValueChange,
      onSlidingComplete: slidingEnd,
    });
  }
}
export default SeekBar;
