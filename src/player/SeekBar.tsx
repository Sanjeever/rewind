import * as React from 'react';
import reactNativeSlider from '../components/Slider';
import styles from './styles';
interface Props {
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
class SeekBar extends React.PureComponent<Props> {
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
      onSlidingStart: slidingStart,
      onValueChange: onSliderValueChange,
      onSlidingComplete: slidingEnd,
    });
  }
}
export default SeekBar;
