import Pager from './../components/Pager.js';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as components from '../components/index';
import * as constants from '../theme/constants';
import names from '../events/names';
import * as events from '../events/index';
import * as utils from '../utils/index';
import * as trackInfo from '../services/trackInfo';
import * as playOrder from './playOrder';
import TrackTitle from './TrackTitle';
class Cover extends React.Component {
  _onPanResponderRelease = (e, t) => {
    const r_props = this.props;
    const {onTap, playerClose, showToolBtn, onDetail, onNowPlaying, reverseGestureHands} = r_props;
    if (!(t.y0 < 50)) {
      const {dy, dx} = t;
      const c = showToolBtn;
      const f = playerClose;
      const h = reverseGestureHands ? onDetail : onNowPlaying;
      const g = reverseGestureHands ? onNowPlaying : onDetail;
      if (Math.abs(dy) > Math.abs(dx)) {
        if (dy < -10) {
          c();
        } else if (dy > 10) {
          f();
        } else {
          onTap();
        }
      } else if (dx > 20) {
        g();
      } else if (dx < -20) {
        h();
      } else {
        onTap();
      }
    }
  };
  _panResponder = ReactNative.PanResponder.create({
    onStartShouldSetPanResponder: function () {
      return true;
    },
    onStartShouldSetPanResponderCapture: function () {
      return true;
    },
    onMoveShouldSetPanResponder: function () {
      return true;
    },
    onMoveShouldSetPanResponderCapture: function () {
      return true;
    },
    onPanResponderRelease: this._onPanResponderRelease,
  });
  renderCoverImage = () => {
    const r_props = this.props;
    const {isRound, url, showElevation, showTool} = r_props;
    const d = 0.65 * constants.DEVICE_WIDTH;
    if (isRound === false) {
      return (
        <React.Fragment>
          <ReactNative.Image
            source={{
              uri: url,
            }}
            style={m.img}
          />
          {showTool && (
            <React.Fragment>
              <components.GradientMask
                from={'top'}
                style={{
                  height: 80,
                  top: 0,
                }}
              />
              <components.GradientMask
                from={'bottom'}
                style={{
                  height: 50,
                  top: constants.DEVICE_WIDTH - 50,
                }}
              />
            </React.Fragment>
          )}
        </React.Fragment>
      );
    }
    return (
      <ReactNative.View
        style={[
          m.coverCon,
          {
            flex: 1,
            backgroundColor: 0,
          },
        ]}
      >
        <ReactNative.View
          style={[
            {
              width: d,
              height: d,
              borderRadius: d / 2,
            },
            showElevation === true && {
              elevation: 5,
            },
          ]}
        >
          <ReactNative.Image
            source={{
              uri: url,
            }}
            style={{
              width: d,
              height: d,
              borderRadius: d / 2,
            }}
          />
        </ReactNative.View>
      </ReactNative.View>
    );
  };
  onPageSelected = (e) => {
    const position = e.nativeEvent.position;
    if (position !== 1) {
      const n = this.props;
      const {onPrev, onNext} = n;
      if (position === 0) {
        onPrev();
      } else {
        onNext();
      }
      this.pager.setPageWithoutAnimation(1);
    }
  };
  renderItem = (e) => {
    const r_props = this.props;
    const {index, data, unknown, playMode, playState, randomArray} = r_props;
    const g = playOrder.getNextPlayIndexByPagerPos({
      pos: e,
      playMode,
      playingIndex: index,
      randomArray,
      len: data.length,
    });
    const y =
      unknown && e === 2
        ? {
            song: '? ? ?',
          }
        : trackInfo.extractFullInfo(data[g]);
    return (
      <ReactNative.View
        style={{
          flex: 1,
        }}
        key={e}
      >
        <TrackTitle
          onPress={this.props.onPlay}
          viewStyle={[
            m.songTitleCon,
            {
              paddingHorizontal: 70,
            },
          ]}
          title={y.song}
          subtitle={y.singer && utils.parseArtist(y.singer)}
          authorStyle={{
            fontSize: 14,
            textAlign: 'center',
          }}
          titleStyle={[
            {
              fontSize: 18,
              textAlign: 'center',
            },
            playState === 'paused' && {
              opacity: 0.7,
            },
          ]}
          numberOfLines={2}
        />
      </ReactNative.View>
    );
  };
  savePic = function (img, song) {
    events.emitter.emit(names.SavePicModal, {
      img,
      song,
    });
  };
  shouldComponentUpdate(e) {
    const props = this.props;
    const {song, showTool, url, playState} = props;
    return song !== e.song || showTool !== e.showTool || url !== e.url || playState !== e.playState;
  }
  render() {
    const e = this;
    const props = this.props;
    const {url, containerStyle} = props;
    return (
      <ReactNative.View style={[m.container, containerStyle]}>
        <ReactNative.View
          onLongPress={this.props.onTap}
          style={m.coverCon}
          {...this._panResponder.panHandlers}
        >
          {url !== '' ? this.renderCoverImage() : null}
        </ReactNative.View>
        <Pager
          ref={function (t) {
            return (e.pager = t);
          }}
          onPageSelected={this.onPageSelected}
          initialPage={1}
          style={{
            height: constants.DEVICE_HEIGHT - constants.DEVICE_WIDTH - 150,
            width: constants.DEVICE_WIDTH,
            flex: 1,
          }}
        >
          {this.renderItem(0)}
          {this.renderItem(1)}
          {this.renderItem(2)}
        </Pager>
      </ReactNative.View>
    );
  }
}
var m = ReactNative.StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
  songTitleCon: {
    paddingTop: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverCon: {
    width: constants.DEVICE_WIDTH,
    height: constants.DEVICE_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  img: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});
export default Cover;
