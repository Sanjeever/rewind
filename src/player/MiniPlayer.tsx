import * as React from 'react';
import * as ReactNative from 'react-native';
import FadingEdge from '../components/FadingEdge';
import * as constants from '../theme/constants';
import MiniPlayerContent from './MiniPlayerContent';
import PlayButton from './PlayButton';
import ControlIcon from './ControlIcon';
import buttons from './buttons';
import {motion, ReducedMotionContext} from '../theme/motion';
import type {TrackFields} from '../services/track';
import type {PlayMode, PlayState, PlayerState} from './types';
interface Props {
  playingIndex: number;
  tracks: readonly TrackFields[];
  changeSong(direction: 'pre' | 'next'): void;
  playerOpen(): void;
  playMode: PlayMode;
  playState: PlayState;
  togglePlay(): void;
  loadState: PlayerState['loadState'];
  hideTopBorder: boolean;
  isRound: boolean;
  unknown: boolean;
  currentMiniLyric?: string | false;
  onNowPlaying(): void;
  randomArray: readonly number[];
  currentTime: number;
  duration: number;
}
class MiniPlayer extends React.PureComponent<Props> {
  static contextType = ReducedMotionContext;
  context = false;
  progress = new ReactNative.Animated.Value(0);
  updateProgress = (animate: boolean) => {
    const {currentTime, duration} = this.props;
    const value = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;
    this.progress.stopAnimation();
    if (animate && !this.context)
      ReactNative.Animated.timing(this.progress, {
        toValue: value,
        duration: motion.state,
        useNativeDriver: true,
      }).start();
    else this.progress.setValue(value);
  };
  componentDidMount() {
    this.updateProgress(false);
  }
  componentDidUpdate(previous: Props) {
    if (
      previous.currentTime === this.props.currentTime &&
      previous.duration === this.props.duration
    )
      return;
    this.updateProgress(
      previous.tracks[previous.playingIndex] === this.props.tracks[this.props.playingIndex],
    );
  }
  componentWillUnmount() {
    this.progress.stopAnimation();
  }
  render() {
    const props = this.props;
    const {
      playingIndex,
      tracks,
      changeSong,
      playerOpen,
      playMode,
      playState,
      togglePlay,
      loadState,
      hideTopBorder,
      isRound,
      unknown,
      currentMiniLyric,
      onNowPlaying,
      randomArray,
    } = props;
    return (
      <ReactNative.View
        style={[
          {
            height: '100%',
            width: '100%',
            alignItems: 'center',
            flexDirection: 'row',
            paddingRight: 5,
          },
          hideTopBorder
            ? {
                elevation: 5,
              }
            : {
                borderTopColor: constants.COLORS.primaryAlpha10,
                borderTopWidth: ReactNative.StyleSheet.hairlineWidth,
              },
        ]}
      >
        <FadingEdge>
          <MiniPlayerContent
            coverStyle={{
              alignItems: 'center',
              justifyContent: 'center',
            }}
            index={playingIndex}
            data={tracks}
            next={function () {
              return changeSong('next');
            }}
            prev={function () {
              return changeSong('pre');
            }}
            playerOpen={playerOpen}
            playMode={playMode}
            isRound={isRound}
            unknown={unknown}
            togglePlay={togglePlay}
            currentMiniLyric={currentMiniLyric}
            randomArray={randomArray}
          />
        </FadingEdge>
        <ReactNative.View
          style={{
            width: 48,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PlayButton
            size={25}
            spinSize={30}
            playState={playState}
            loadState={loadState}
            onPress={togglePlay}
            onLongPress={onNowPlaying}
          />
        </ReactNative.View>
        <ControlIcon
          accessibilityLabel="播放队列"
          name={buttons.LIST.name}
          size={22}
          onPress={onNowPlaying}
        />
        <ReactNative.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            backgroundColor: 'rgba(255,255,255,0.08)',
          }}
        >
          <ReactNative.Animated.View
            style={{
              height: 2,
              backgroundColor: 'rgba(255,255,255,0.65)',
              transformOrigin: 'left',
              transform: [{scaleX: this.progress}],
            }}
          />
        </ReactNative.View>
      </ReactNative.View>
    );
  }
}
export default MiniPlayer;
