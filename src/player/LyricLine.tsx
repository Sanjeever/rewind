import Text from './../components/Text';
import * as React from 'react';
import * as ReactNative from 'react-native';
import LyricDataSource from './LyricDataSource';
import VirtualLyricList from './VirtualLyricList';
import * as constants from '../theme/constants';
import locales from '../locales/index';
import type {LyricRow} from '../utils/parseLyric';
import type {PlayState} from './types';
export interface LyricLineProps {
  lyric: LyricRow[] | null;
  currentTime: number;
  getIndex(lines: readonly LyricRow[], seconds: number): number;
  showTrans: boolean;
  hasTrans: boolean;
  changeShowTrans(): void;
  changeFontSize(size: number): void;
  fontSize: number;
  seekTo(seconds: number): void;
  onTap(): void;
  viewStyle?: ReactNative.StyleProp<ReactNative.ViewStyle>;
  playState: PlayState;
  showTool: boolean;
  lrcText?: string | null;
}
const lyric_1 = 'Nothing is true';
const trans = '万物皆虚';
class LyricLine extends React.PureComponent<LyricLineProps, {index: number | null}> {
  _list: VirtualLyricList<LyricRow> | null = null;
  timer?: ReturnType<typeof setTimeout>;
  visibleIndex?: number;
  dragged = false;
  state: {index: number | null} = {
    index: null,
  };
  scroll = (e: LyricRow[], t: number) => {
    const n = this.props.getIndex(e, t);
    if (n !== this.state.index) {
      if (this._list && n && this.dragged === false) {
        const velocity = this.getVelocity(n);
        this._list.scrollToIndex({
          animated: true,
          index: n,
          velocity,
        });
      }
      this.setState({
        index: n,
      });
    }
  };
  scrollToCurrentLine = () => {
    const r_props = this.props;
    const {currentTime, lyric, getIndex} = r_props;
    if (lyric && !(lyric.length < 2)) {
      const i = getIndex(lyric, currentTime);
      if (this._list && i) {
        this._list.scrollToIndex({
          animated: false,
          index: i,
        });
      }
    }
  };
  getTrans = (e: LyricRow) => {
    if (this.props.showTrans === false) {
      return null;
    }
    return e.trans;
  };
  scrollDragBegin = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.dragged = true;
  };
  scrollEndDrag = () => {
    this.timer = setTimeout(() => {
      this.dragged = false;
    }, 2000);
  };
  onVisibleItemsChange = (e: {firstIndex: number; lastIndex: number}) => {
    this.visibleIndex = ((e.firstIndex + e.lastIndex + 1) / 2) | 0;
  };
  getVelocity = (e: number) => {
    if (!this.visibleIndex) {
      return 1000;
    }
    const t = this.visibleIndex < e - 4;
    const n = this.visibleIndex > e + 4;
    if (t || n) {
      return 100;
    }
    return 1000;
  };
  btns = () => {
    return (
      <ReactNative.View
        style={{
          height: 200,
          paddingTop: 100,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {this.props.hasTrans && (
          <ReactNative.TouchableOpacity onPress={this.props.changeShowTrans}>
            <Text style={h.text}>
              {this.props.showTrans ? locales.HIDE_TRANS : locales.SHOW_TRANS}
            </Text>
          </ReactNative.TouchableOpacity>
        )}
        <ReactNative.View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <ReactNative.TouchableOpacity
            onPress={() => {
              return this.props.changeFontSize(
                this.props.fontSize > 1 ? this.props.fontSize - 1 : 0,
              );
            }}
          >
            <Text
              style={[
                h.text,
                {
                  padding: 5,
                },
              ]}
            >
              {'-'}
            </Text>
          </ReactNative.TouchableOpacity>
          <ReactNative.View
            style={{
              padding: 20,
            }}
          >
            <Text style={h.text}>{this.props.fontSize - 15}</Text>
          </ReactNative.View>
          <ReactNative.TouchableOpacity
            onPress={() => {
              return this.props.changeFontSize(
                this.props.fontSize < 25 ? this.props.fontSize + 1 : 25,
              );
            }}
          >
            <Text
              style={[
                h.text,
                {
                  padding: 5,
                },
              ]}
            >
              {'+'}
            </Text>
          </ReactNative.TouchableOpacity>
        </ReactNative.View>
      </ReactNative.View>
    );
  };
  emptyComp = function () {
    return <ReactNative.View style={h.space} />;
  };
  _renderItem = ({item, index}: {item: LyricRow; index: number}) => {
    const l = this.getTrans(item);
    const a = !this.props.showTrans && item.txt.match('翻译贡献者');
    const seconds = item.total;
    return React.createElement(LyricLineScreen, {
      highlight: this.state.index === index,
      lyric: !a && this.renderTxt(item.txt),
      trans: l && this.renderTxt(l.txt),
      onPress: seconds == null ? undefined : () => this.seekTo(seconds),
      fontSize: this.props.fontSize,
    });
  };
  seekTo = (seconds: number) => {
    const t = seconds - 0.5;
    this.props.seekTo(t);
    this.dragged = false;
  };
  renderTxt = function (e: string) {
    return e
      .replace(/&apos;/gm, "'")
      .replace(/\/\//g, '')
      .replace(/&quot;/g, '"')
      .replace(/\[.+\]/gi, '');
  };
  componentDidMount() {
    this.scrollToCurrentLine();
  }
  componentDidUpdate(e: LyricLineProps) {
    const props = this.props;
    const {currentTime, lyric} = props;
    if (currentTime !== e.currentTime) {
      if (!(!lyric || lyric.length < 2)) {
        if (currentTime !== e.currentTime && lyric.length > 0) {
          this.scroll(lyric, currentTime);
        }
      }
    }
  }
  render() {
    const lyric = this.props.lyric;
    const dataSource =
      lyric &&
      new LyricDataSource(lyric, function (_e, t) {
        return String(t);
      });
    return (
      <ReactNative.View style={[h.container, this.props.viewStyle]}>
        <ReactNative.View
          style={[ReactNative.StyleSheet.absoluteFill, h.overlay]}
          onTouchStart={this.props.onTap}
        />
        {lyric && lyric.length > 0 && dataSource ? (
          <VirtualLyricList
            style={{
              flex: 1,
              width: '80%',
              height: '100%',
            }}
            dataSource={dataSource}
            renderItem={this._renderItem}
            ref={(t) => {
              this._list = t;
            }}
            showVerticalScrollBar={false}
            isScrollOverMode={false}
            ListHeaderComponent={this.btns}
            ListFooterComponent={this.emptyComp}
            onTouchStart={this.scrollDragBegin}
            onScrollEndDrag={this.scrollEndDrag}
            onVisibleItemsChange={this.onVisibleItemsChange}
          />
        ) : (
          <ReactNative.View
            style={h.empty}
            onTouchStart={() => {
              return this.props.onTap();
            }}
          >
            {React.createElement(LyricLineScreen, {
              fontSize: 16,
              lyric: lyric_1,
              trans,
              highlight: true,
            })}
          </ReactNative.View>
        )}
      </ReactNative.View>
    );
  }
}
interface LineProps {
  lyric?: string | false;
  trans?: string | null;
  highlight: boolean;
  onPress?: () => void;
  style?: ReactNative.StyleProp<ReactNative.ViewStyle>;
  fontSize: number;
}
class LyricLineScreen extends React.PureComponent<LineProps> {
  render() {
    const {lyric = '', trans = '', highlight, onPress, style, fontSize} = this.props;
    return (
      <ReactNative.TouchableOpacity onLongPress={onPress} activeOpacity={0.6}>
        <ReactNative.View style={[h.textCon, style]}>
          <Text
            style={[
              h.text,
              {
                opacity: highlight ? 1 : 0.6,
                fontSize,
              },
              trans && {
                fontSize: fontSize - 2,
              },
            ]}
          >
            {trans && (
              <Text
                style={[
                  h.text,
                  {
                    opacity: highlight ? 1 : 0.6,
                    fontSize,
                  },
                ]}
              >{`${trans}
`}</Text>
            )}
            {lyric}
          </Text>
        </ReactNative.View>
      </ReactNative.TouchableOpacity>
    );
  }
}
const h = ReactNative.StyleSheet.create({
  container: {
    height: '100%',
    width: constants.DEVICE_WIDTH,
    alignItems: 'center',
  },
  textCon: {
    width: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    padding: 10,
    paddingVertical: 20,
  },
  text: {
    fontSize: 15,
    opacity: 0.6,
    textAlign: 'center',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    width: constants.DEVICE_WIDTH,
  },
  space: {
    height: 180,
  },
  overlay: {
    top: constants.STATUS_BAR_HEIGHT + 50,
    backgroundColor: 'transparent',
  },
});
export default LyricLine;
