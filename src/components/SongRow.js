import Text from './Text.js';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeAnimatable from 'react-native-animatable';
import TouchableScale from './TouchableScale';
import * as components from './index';
import * as constants from '../theme/constants';
import icons from '../theme/icons';
import * as events from '../events/index';
import * as utils from '../utils/index';
class SongRow extends React.PureComponent {
  handleOnPress = () => {
    requestAnimationFrame(() => {
      this.props.onPress?.();
    });
  };
  onLongPress = () => {
    const songItem = this.props.songItem;
    if (songItem) {
      events.toLongPressModal({
        item: songItem,
      });
    }
  };
  state = {
    singer: null,
    song: '',
    album: '',
  };
  render() {
    const {
      img,
      index,
      song,
      album,
      singer,
      detail,
      onMV,
      showMV,
      textStyle,
      playing,
      addToQueue,
      containerStyle,
      deleteBtn,
      isExist,
      alias,
      isChecked,
      disabled,
      showRank = false,
      lastRank,
    } = this.props;
    const singers = singer && utils.parseArtist(singer);
    return (
      <ReactNative.TouchableNativeFeedback
        disabled={disabled}
        onPress={this.handleOnPress}
        onLongPress={this.onLongPress}
      >
        <ReactNative.View style={[T.container, containerStyle]}>
          {isChecked === true && (
            <reactNativeAnimatable.View
              useNativeDriver={true}
              animation={'fadeIn'}
              style={{
                width: 5,
                height: '100%',
                backgroundColor: constants.COLORS.secondary,
                borderRadius: 1,
              }}
            />
          )}
          {b({
            img,
            addToQueue,
          })}
          {p({
            index,
            img,
            addToQueue,
            playing,
            showRank,
            lastRank,
          })}
          {I({
            textStyle,
            song,
            playing,
            alias,
            isExist,
            singers,
            album,
          })}
          {showMV && onMV ? <E onPress={onMV} /> : null}
          {detail
            ? React.createElement(h, {
                onPress: detail,
                style: T.next,
              })
            : null}
          {deleteBtn
            ? React.createElement(h, {
                name: icons.WINDOW_CLOSE,
                size: 20,
                onPress: deleteBtn,
                style: T.delete,
              })
            : null}
        </ReactNative.View>
      </ReactNative.TouchableNativeFeedback>
    );
  }
}
var E = function ({onPress}) {
  return (
    <ReactNative.TouchableOpacity
      onPress={onPress}
      style={{
        height: '100%',
        paddingLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <components.Icon name={icons.PLAY} size={12} style={T.mv} />
    </ReactNative.TouchableOpacity>
  );
};
var h = function ({style, onPress, name, size}) {
  return (
    <TouchableScale onPress={onPress} activeScale={0.7}>
      <ReactNative.View style={style}>
        <components.Icon name={name || icons.DOTS_VERTICAL} size={size || 20} />
      </ReactNative.View>
    </TouchableScale>
  );
};
const y = ({showRank, lastRank, index}) => {
  if (showRank) {
    let l = '';
    let s = '';
    if (lastRank || lastRank === 0) {
      const o = lastRank - index;
      if (o === 0) {
        s = icons.TRENDING_NEUTRAL;
      } else {
        s = o > 0 ? icons.TRENDING_UP : icons.TRENDING_DOWN;
        l = Math.abs(o);
      }
    } else {
      s = icons.NEW_BOX;
    }
    return (
      <ReactNative.View
        style={{
          alignItems: 'center',
        }}
      >
        {s ? <components.Icon name={s} size={15} /> : null}
        {l ? <Text style={T.rank}>{l}</Text> : null}
      </ReactNative.View>
    );
  }
};
var b = ({img, addToQueue}) => {
  if (img) {
    return (
      <TouchableScale onPress={addToQueue}>
        <ReactNative.View style={T.key}>
          <ReactNative.Image
            style={[T.img]}
            source={{
              uri: img,
            }}
          />
        </ReactNative.View>
      </TouchableScale>
    );
  }
};
var p = ({index, img, addToQueue, playing, showRank, lastRank}) => {
  if (index !== null && !img) {
    return (
      <ReactNative.TouchableOpacity onPress={addToQueue}>
        <ReactNative.View style={T.index}>
          {playing ? (
            <components.Icon name={icons.EMOTICON_HAPPY_OUTLINE} size={20} />
          ) : (
            <Text style={[T.song, T.indexText]}>{1 + (0 | index)}</Text>
          )}
          {y({
            showRank,
            lastRank,
            index,
          })}
        </ReactNative.View>
      </ReactNative.TouchableOpacity>
    );
  }
};
var I = ({textStyle, song, playing, alias, isExist, singers, album}) => (
  <ReactNative.View style={[T.textCon, textStyle]}>
    <Text
      numberOfLines={1}
      style={[
        T.song,
        playing && {
          fontWeight: 'bold',
        },
      ]}
    >
      {song}
      {alias && (
        <Text style={T.alias}>
          {' ('}
          {alias}
          {')'}
        </Text>
      )}
    </Text>
    <ReactNative.View
      style={{
        flexDirection: 'row',
      }}
    >
      {isExist ? (
        <reactNativeAnimatable.View animation={'fadeIn'} useNativeDriver={true}>
          <components.Icon
            name={icons.CHECK_CIRCLE}
            size={15}
            style={{
              marginRight: 3,
            }}
          />
        </reactNativeAnimatable.View>
      ) : null}
      {singers?.length > 0 ? (
        <Text numberOfLines={1} style={[T.singer]}>
          {singers} {album && `|  ${album}`}
        </Text>
      ) : null}
    </ReactNative.View>
  </ReactNative.View>
);
var T = ReactNative.StyleSheet.create({
  container: {
    height: constants.ITEM_HEIGHT,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 5,
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textCon: {
    flex: 1,
  },
  song: {
    fontSize: 15,
  },
  alias: {
    fontSize: 13,
    color: constants.COLORS.primaryAlpha70,
  },
  singer: {
    fontSize: 12,
    opacity: 0.8,
  },
  key: {
    width: constants.ITEM_HEIGHT,
    height: constants.ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  index: {
    width: 40,
    height: constants.ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
  },
  indexText: {
    fontSize: 14,
  },
  next: {
    height: constants.ITEM_HEIGHT,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  delete: {
    height: constants.ITEM_HEIGHT,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mv: {
    height: 15,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: constants.COLORS.secondary,
    opacity: 0.8,
  },
  rank: {
    fontSize: 9,
  },
});
export default SongRow;
