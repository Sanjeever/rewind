import * as React from 'react';
import * as ReactNative from 'react-native';
import FadingEdge from '../components/FadingEdge';
import * as constants from '../theme/constants';
import MiniPlayerContent from './MiniPlayerContent';
import PlayButton from './PlayButton';
import type {TrackFields} from '../services/track';
import type {PlayMode, PlayState} from './types';
interface Props {
  playingIndex: number;
  tracks: readonly TrackFields[];
  changeSong(direction: 'pre' | 'next'): void;
  playerOpen(): void;
  playMode: PlayMode;
  playState: PlayState;
  togglePlay(): void;
  loaded: boolean;
  hideTopBorder: boolean;
  isRound: boolean;
  unknown: boolean;
  currentMiniLyric?: string | false;
  onNowPlaying(): void;
  randomArray: readonly number[];
}
class MiniPlayer extends React.PureComponent<Props> {
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
      loaded,
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
            width: 60,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PlayButton
            size={25}
            spinSize={30}
            playState={playState}
            loaded={loaded}
            onPress={togglePlay}
            onLongPress={onNowPlaying}
          />
        </ReactNative.View>
      </ReactNative.View>
    );
  }
}
export default MiniPlayer;
