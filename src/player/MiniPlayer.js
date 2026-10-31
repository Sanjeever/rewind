import * as React from 'react';
import * as ReactNative from 'react-native';
import FadingEdge from '../components/FadingEdge';
import * as constants from '../theme/constants';
import MiniPlayerContent from './MiniPlayerContent';
import PlayButton from './PlayButton';
class MiniPlayer extends React.PureComponent {
  render() {
    const props = this.props;
    const {
      playingIndex,
      tracks,
      changeSong,
      playerOpen,
      playMode,
      onDetail,
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
        ref={(instance) => (this.imgCon = instance)}
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
        <FadingEdge left={20} right={100}>
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
            onPress={onDetail}
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
