import Text from './../components/Text';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as LyricList from './LyricList.js';
import * as constants from '../theme/constants';
import locales from '../locales/index';
const lyric_1 = 'Nothing is true';
const trans = '万物皆虚';
class LyricLine extends React.PureComponent {
  dragged = false;
  state = {
    index: null,
  };
  scroll = (e, t) => {
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
  getTrans = (e) => {
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
  onVisibleItemsChange = (e) => {
    this.visibleIndex = ((e.firstIndex + e.lastIndex + 1) / 2) | 0;
  };
  getVelocity = (e) => {
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
  _renderItem = ({item, index}) => {
    const l = this.getTrans(item);
    const a = !this.props.showTrans && item.txt.match('翻译贡献者');
    return React.createElement(LyricLineScreen, {
      highlight: this.state.index === index,
      lyric: !a && this.renderTxt(item.txt),
      trans: l && this.renderTxt(l.txt),
      onPress: () => {
        return this.seekTo(item);
      },
      fontSize: this.props.fontSize,
    });
  };
  seekTo = (e) => {
    const t = e.total - 0.5;
    this.props.seekTo(t);
    this.dragged = false;
  };
  renderTxt = function (e) {
    return e
      .replace(/&apos;/gm, "'")
      .replace(/\/\//g, '')
      .replace(/&quot;/g, '"')
      .replace(/\[.+\]/gi, '');
  };
  componentDidMount() {
    this.scrollToCurrentLine();
  }
  componentDidUpdate(e) {
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
    const dataSource = new LyricList.DataSource(lyric, function (e, t) {
      return String(t);
    });
    return (
      <ReactNative.View style={[h.container, this.props.viewStyle]}>
        <ReactNative.View
          style={[ReactNative.StyleSheet.absoluteFill, h.overlay]}
          onTouchStart={this.props.onTap}
        />
        {lyric && lyric.length > 0 && dataSource ? (
          <LyricList.default
            style={{
              flex: 1,
              width: '80%',
              height: '100%',
            }}
            dataSource={dataSource}
            renderItem={this._renderItem}
            ref={(t) => {
              return (this._list = t);
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
class LyricLineScreen extends React.PureComponent {
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
var h = ReactNative.StyleSheet.create({
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
    top: ReactNative.StatusBar.currentHeight + 50,
    backgroundColor: 0,
  },
});
export default LyricLine;
