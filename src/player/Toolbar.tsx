import Text from './../components/Text';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeAnimatable from 'react-native-animatable';
import styles from './styles';
import type {LyricRow} from '../utils/parseLyric';
interface Props {
  currentTime: number;
  getLyricIndex(lines: readonly LyricRow[], seconds: number): number | null;
  lyric: readonly LyricRow[];
  showTrans: boolean;
  animatedOpacity: ReactNative.Animated.Value;
  SOFT_MENU_HEIGHT: number;
  width: number;
  isRound: boolean;
}
const o = (txt: string) =>
  txt
    .replace(/&apos;/gm, "'")
    .replace(/\/\//g, '')
    .replace(/&quot;/g, '"')
    .replace(/\[.+\]/gi, '');
class Toolbar extends React.PureComponent<Props> {
  miniLyricIndex?: number | null;
  miniLyric!: boolean;
  render() {
    const props = this.props;
    const {
      currentTime,
      getLyricIndex,
      lyric,
      showTrans,
      animatedOpacity,
      SOFT_MENU_HEIGHT,
      width,
      isRound,
    } = props;
    const m = getLyricIndex(lyric, currentTime + 0.3);
    if (this.miniLyricIndex != null && m != null && m > this.miniLyricIndex) {
      this.miniLyric = false;
    } else {
      this.miniLyric = true;
    }
    this.miniLyricIndex = m;
    if (!m) {
      return null;
    }
    const b = o(lyric[m].txt);
    const trans = lyric[m].trans;
    const g = showTrans && trans ? o(trans.txt) : null;
    return (
      <ReactNative.Animated.View
        style={[
          styles.progressBar,
          {
            height: null,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            opacity: animatedOpacity,
            top: width,
            paddingHorizontal: 30,
          },
          !isRound && {
            top: null,
            bottom: 35 + SOFT_MENU_HEIGHT,
          },
        ]}
      >
        {b && this.miniLyric === true ? (
          <ReactNative.View
            style={{
              opacity: 0.8,
            }}
          >
            {g && showTrans ? (
              <reactNativeAnimatable.Text
                style={[
                  styles.text,
                  {
                    textAlign: 'center',
                    fontSize: 15,
                  },
                ]}
                useNativeDriver={true}
                animation={'fadeIn'}
              >
                {g}
                {'\n'}
                <Text
                  style={{
                    fontSize: 13,
                  }}
                >
                  {b}
                </Text>
              </reactNativeAnimatable.Text>
            ) : (
              <reactNativeAnimatable.Text
                useNativeDriver={true}
                style={[
                  styles.text,
                  {
                    textAlign: 'center',
                    fontSize: 14,
                  },
                  !showTrans &&
                    !g && {
                      fontSize: 15,
                    },
                ]}
                animation={'fadeIn'}
              >
                {b}
              </reactNativeAnimatable.Text>
            )}
          </ReactNative.View>
        ) : null}
      </ReactNative.Animated.View>
    );
  }
}
export default Toolbar;
