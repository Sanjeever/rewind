import * as React from 'react';
import * as ReactNative from 'react-native';
import FadingEdge from '../components/FadingEdge';
import styles from './styles';
import LyricLine from './LyricLine';
class LyricsView extends React.PureComponent {
  render() {
    const props = this.props;
    const {
      showTool,
      animatedOpacity,
      hidePlayingTime,
      lyric,
      hasTrans,
      currentTime,
      onTap,
      playSound,
      seekTo,
      lrcText,
      showTrans,
      changeShowTrans,
      changeFontSize,
      lyricFontSize,
      getLyricIndex,
      playState,
    } = props;
    return (
      <ReactNative.Animated.View
        style={[
          styles.lyric,
          showTool === false && styles.toolHide,
          {
            opacity: animatedOpacity,
          },
          hidePlayingTime === false && styles.softPadding,
          {
            paddingTop: 70,
          },
        ]}
      >
        <FadingEdge bottom={128} top={128}>
          <LyricLine
            playState={playState}
            lyric={lyric}
            hasTrans={hasTrans}
            currentTime={currentTime}
            onTap={onTap}
            seekTo={function (e) {
              playSound();
              seekTo(e);
            }}
            lrcText={lrcText}
            showTool={showTool}
            showTrans={showTrans}
            changeShowTrans={changeShowTrans}
            changeFontSize={function (e) {
              return changeFontSize(e);
            }}
            fontSize={lyricFontSize}
            getIndex={getLyricIndex}
          />
        </FadingEdge>
      </ReactNative.Animated.View>
    );
  }
}
export default LyricsView;
