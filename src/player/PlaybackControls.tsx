import * as React from 'react';
import * as ReactNative from 'react-native';
import buttons from './buttons';
import styles from './styles';
import ControlIcon from './ControlIcon';
import PlayButton from './PlayButton';
import AnimatedPlayButton from './AnimatedPlayButton';
import SeekBar from './SeekBar';
import Text from '../components/Text';
import timeFormatter from '../utils/timeFormatter';
import type {SeekBarProps} from './SeekBar';
import type {PlayMode, PlayState, PlayerState} from './types';
interface Props extends Pick<
  SeekBarProps,
  'duration' | 'currentTime' | 'slidingStart' | 'slidingEnd' | 'onSliderValueChange'
> {
  animatedOpacity: ReactNative.Animated.Value;
  playMode: PlayMode;
  onChangePlayStatus(): void;
  showLyric: boolean;
  changeSong(direction: 'pre' | 'next'): void;
  togglePlay(): void;
  onNowPlaying(): void;
  color?: ReactNative.ColorValue;
  playState: PlayState;
  loadState: PlayerState['loadState'];
}
class PlaybackControls extends React.PureComponent<Props> {
  render() {
    const props = this.props;
    const {
      animatedOpacity,
      playMode,
      onChangePlayStatus,
      showLyric,
      changeSong,
      togglePlay,
      onNowPlaying,
      color,
      playState,
      loadState,
    } = props;
    return (
      <ReactNative.Animated.View
        style={[
          styles.footer,
          {
            opacity: animatedOpacity,
          },
          showLyric && {
            paddingBottom: 0,
          },
        ]}
      >
        <ReactNative.View style={{paddingHorizontal: 24}}>
          <SeekBar
            inline
            showLyric={false}
            isRound={false}
            width={0}
            loaded={loadState === 'ready'}
            duration={props.duration}
            currentTime={props.currentTime}
            slidingStart={props.slidingStart}
            slidingEnd={props.slidingEnd}
            onSliderValueChange={props.onSliderValueChange}
          />
          <ReactNative.View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: -6,
              marginBottom: 12,
            }}
          >
            <Text style={{fontSize: 12, opacity: 0.8}}>
              {timeFormatter.parseTime(props.currentTime)}
            </Text>
            <Text style={{fontSize: 12, opacity: 0.8}}>
              {timeFormatter.parseTime(props.duration)}
            </Text>
          </ReactNative.View>
        </ReactNative.View>
        <ReactNative.View style={styles.toolBar}>
          <AnimatedPlayButton
            playMode={playMode}
            onPress={onChangePlayStatus}
            color={color}
            size={25}
            style={{
              padding: 5,
            }}
          />
          <ControlIcon
            accessibilityLabel="上一首"
            name={buttons.PREV.name}
            onPress={function () {
              return changeSong('pre');
            }}
            color={color}
            style={{
              padding: 5,
            }}
          />
          <PlayButton
            playState={playState}
            onPress={togglePlay}
            color={color}
            loadState={loadState}
          />
          <ControlIcon
            accessibilityLabel="下一首"
            name={buttons.NEXT.name}
            onPress={function () {
              return changeSong('next');
            }}
            color={color}
            style={{
              padding: 5,
            }}
          />
          <ControlIcon
            accessibilityLabel="播放队列"
            onPress={onNowPlaying}
            name={buttons.LIST.name}
            color={color}
            style={{
              padding: 5,
            }}
            size={25}
          />
        </ReactNative.View>
      </ReactNative.Animated.View>
    );
  }
}
export default PlaybackControls;
