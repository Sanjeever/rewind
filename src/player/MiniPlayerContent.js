import Pager from './../components/Pager.js';
import * as React from 'react';
import * as ReactNative from 'react-native';
import TouchableScale from '../components/TouchableScale';
import * as components from '../components/index';
import * as constants from '../theme/constants';
import icons from '../theme/icons';
import * as utils from '../utils/index';
import * as types from '../utils/types';
import * as trackInfo from '../services/trackInfo';
import * as playOrder from './playOrder';
import TrackTitle from './TrackTitle';
const m = 50;
const height = 60;
class MiniPlayerContent extends React.PureComponent {
  scrollState = 'idle';
  triggerImage = false;
  onTouchEnd = () => {
    if (this.scrollState === 'idle' && this.triggerImage === false) {
      this.props.playerOpen();
    }
  };
  onImage = () => {
    this.triggerImage = true;
    this.props.togglePlay();
    types.debounce(() => {
      this.triggerImage = false;
    }, 99)();
  };
  renderCovers = () => {
    return [0, 1, 2].map((e) => this.renderItem(e));
  };
  onPageScrollStateChanged = (e) => {
    this.scrollState = e;
  };
  onPageSelected = (e) => {
    const position = e.nativeEvent.position;
    if (position !== 1) {
      const r = this.props;
      const {prev, next} = r;
      if (position === 0) {
        prev();
      } else {
        next();
      }
      this.pager.setPageWithoutAnimation(1);
    }
  };
  renderItem = (e) => {
    const n_props = this.props;
    const {index, data, unknown, playMode, isRound, currentMiniLyric, randomArray} = n_props;
    const v = playOrder.getNextPlayIndexByPagerPos({
      pos: e,
      playMode,
      playingIndex: index,
      len: data.length,
      randomArray,
    });
    const P =
      unknown && e === 2
        ? {
            song: '？？？',
          }
        : trackInfo.extractFullInfo(data[v]);
    return (
      <ReactNative.View
        key={e}
        style={{
          height,
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 10,
        }}
      >
        <ReactNative.View
          style={[
            this.props.coverStyle,
            {
              height: m,
              width: m,
            },
          ]}
        >
          {unknown && e === 2 ? (
            <ReactNative.View
              style={{
                width: '95%',
                height: '95%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <components.Icon name={icons.CROSSHAIRS_QUESTION} color={'#fff'} />
            </ReactNative.View>
          ) : (
            <TouchableScale
              activeScale={0.95}
              onPress={this.onImage}
              style={{
                height: '100%',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ReactNative.Image
                ref={(instance) => (this.img = instance)}
                style={[
                  {
                    width: '90%',
                    height: '90%',
                    borderRadius: 5,
                  },
                  isRound && {
                    width: '95%',
                    height: '95%',
                    borderRadius: 25,
                  },
                ]}
                source={{
                  uri: P.img,
                }}
              />
            </TouchableScale>
          )}
        </ReactNative.View>
        <TrackTitle
          viewStyle={{
            marginLeft: 7,
            flex: 1,
          }}
          titleStyle={{
            fontSize: 14,
            fontWeight: 'bold',
          }}
          authorStyle={{
            fontSize: 12,
          }}
          dashline={false}
          title={P.song}
          subtitle={e === 1 && currentMiniLyric ? currentMiniLyric : utils.parseArtist(P.singer)}
          numberOfLines={1}
          alias={P.alias}
        />
      </ReactNative.View>
    );
  };
  render() {
    return (
      <Pager
        ref={(t) => {
          return (this.pager = t);
        }}
        onPageSelected={this.onPageSelected}
        initialPage={1}
        style={{
          flex: 1,
          width: constants.DEVICE_WIDTH - 50,
          height,
        }}
        onPageScrollStateChanged={this.onPageScrollStateChanged}
        onTouchEnd={this.onTouchEnd}
      >
        {this.renderCovers()}
      </Pager>
    );
  }
}
export default MiniPlayerContent;
