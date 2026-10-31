import * as React from 'react';
import * as ReactNative from 'react-native';
import buttons from './buttons';
import styles from './styles';
import ControlIcon from './ControlIcon';
import PlayButton from './PlayButton';
import AnimatedPlayButton from './AnimatedPlayButton';
import type {PlayMode, PlayState} from './types';
interface Props {
  animatedOpacity: ReactNative.Animated.Value;
  playMode: PlayMode;
  onChangePlayStatus(): void;
  showLyric: boolean;
  changeSong(direction: 'pre' | 'next'): void;
  togglePlay(): void;
  onNowPlaying(): void;
  color?: ReactNative.ColorValue;
  playState: PlayState;
  loaded: boolean;
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
      loaded,
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
            name={buttons.PREV.name}
            onPress={function () {
              return changeSong('pre');
            }}
            color={color}
            style={{
              padding: 5,
            }}
          />
          <PlayButton playState={playState} onPress={togglePlay} color={color} loaded={loaded} />
          <ControlIcon
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
