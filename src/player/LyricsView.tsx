import * as React from 'react';
import * as ReactNative from 'react-native';
import styles from './styles';
import LyricLine from './LyricLine';
import {Menu, MenuTrigger, MenuOptions, MenuOption} from 'react-native-popup-menu';
import Text from '../components/Text';
import type {LyricLineProps} from './LyricLine';
type Props = Omit<LyricLineProps, 'fontSize' | 'getIndex'> & {
  animatedOpacity: ReactNative.Animated.Value | ReactNative.Animated.AnimatedInterpolation<number>;
  hidePlayingTime: boolean;
  playSound(): void;
  changeFontSize(size: number): void;
  lyricFontSize: number;
  getLyricIndex: LyricLineProps['getIndex'];
};
class LyricsView extends React.PureComponent<Props> {
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
        <ReactNative.View style={{width: '100%', alignItems: 'flex-end', paddingHorizontal: 24}}>
          <Menu>
            <MenuTrigger
              accessibilityLabel="歌词设置"
              accessibilityRole="button"
              customStyles={{triggerWrapper: {minHeight: 48, justifyContent: 'center'}}}
            >
              <Text style={{fontSize: 13}}>歌词设置</Text>
            </MenuTrigger>
            <MenuOptions
              customStyles={{
                optionsContainer: {backgroundColor: '#242424', borderRadius: 12},
                optionWrapper: {minHeight: 48, justifyContent: 'center', paddingHorizontal: 16},
              }}
            >
              {hasTrans && (
                <MenuOption onSelect={changeShowTrans}>
                  <Text>{showTrans ? '隐藏翻译' : '显示翻译'}</Text>
                </MenuOption>
              )}
              <MenuOption
                disabled={lyricFontSize <= 1}
                onSelect={() => changeFontSize(lyricFontSize - 1)}
              >
                <Text>缩小字号</Text>
              </MenuOption>
              <MenuOption
                disabled={lyricFontSize >= 25}
                onSelect={() => changeFontSize(lyricFontSize + 1)}
              >
                <Text>放大字号</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </ReactNative.View>
        <ReactNative.View style={{flex: 1}}>
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
        </ReactNative.View>
      </ReactNative.Animated.View>
    );
  }
}
export default LyricsView;
