import {showTrackActions} from '../../modals/commands';
import Text from '../../components/Text';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeAnimatable from 'react-native-animatable';
import TouchableScale from '../../components/TouchableScale';
import Icon from '../../components/Icon';
import * as constants from '../../theme/constants';
import icons from '../../theme/icons';
import * as utils from '../../utils/index';
import type {Artist, TrackFields} from '../../services/track';
interface SongRowProps {
  onPress?: () => void;
  onLongPress?: () => void;
  songItem?: TrackFields;
  img?: string | null;
  index?: number | null;
  song?: string;
  album?: string;
  singer?: string | Artist[] | null;
  detail?: () => void;
  onMV?: () => void;
  showMV?: boolean;
  textStyle?: ReactNative.StyleProp<ReactNative.ViewStyle>;
  playing?: boolean;
  addToQueue?: () => void;
  containerStyle?: ReactNative.StyleProp<ReactNative.ViewStyle>;
  deleteBtn?: () => void;
  isExist?: boolean;
  alias?: string;
  isChecked?: boolean;
  disabled?: boolean;
  showRank?: boolean;
  lastRank?: number;
  round?: boolean;
}
class SongRow extends React.PureComponent<SongRowProps> {
  handleOnPress = () => {
    requestAnimationFrame(() => {
      this.props.onPress?.();
    });
  };
  onLongPress = () => {
    if (this.props.onLongPress) {
      this.props.onLongPress();
      return;
    }
    const songItem = this.props.songItem;
    if (songItem) {
      showTrackActions({
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
const E = function ({onPress}: Pick<SongRowProps, 'onPress'>) {
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
      <Icon name={icons.PLAY} size={12} style={T.mv} />
    </ReactNative.TouchableOpacity>
  );
};
const h = function ({
  style,
  onPress,
  name,
  size,
}: {
  style?: ReactNative.StyleProp<ReactNative.ViewStyle>;
  onPress?: () => void;
  name?: string;
  size?: number;
}) {
  return (
    <TouchableScale onPress={onPress} activeScale={0.7}>
      <ReactNative.View style={style}>
        <Icon name={name || icons.DOTS_VERTICAL} size={size || 20} />
      </ReactNative.View>
    </TouchableScale>
  );
};
const y = ({showRank, lastRank, index}: Pick<SongRowProps, 'showRank' | 'lastRank' | 'index'>) => {
  if (showRank) {
    let l: string | number = '';
    let s;
    if (lastRank || lastRank === 0) {
      const o = lastRank - (index ?? 0);
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
        {s ? <Icon name={s} size={15} /> : null}
        {l ? <Text style={T.rank}>{l}</Text> : null}
      </ReactNative.View>
    );
  }
};
const b = ({img, addToQueue}: Pick<SongRowProps, 'img' | 'addToQueue'>) => {
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
const p = ({
  index,
  img,
  addToQueue,
  playing,
  showRank,
  lastRank,
}: Pick<SongRowProps, 'index' | 'img' | 'addToQueue' | 'playing' | 'showRank' | 'lastRank'>) => {
  if (index !== null && !img) {
    return (
      <ReactNative.TouchableOpacity onPress={addToQueue}>
        <ReactNative.View style={T.index}>
          {playing ? (
            <Icon name={icons.EMOTICON_HAPPY_OUTLINE} size={20} />
          ) : (
            <Text style={[T.song, T.indexText]}>{1 + (0 | (index ?? 0))}</Text>
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
const I = ({
  textStyle,
  song,
  playing,
  alias,
  isExist,
  singers,
  album,
}: Pick<SongRowProps, 'textStyle' | 'song' | 'playing' | 'alias' | 'isExist' | 'album'> & {
  singers?: string | null;
}) => (
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
          <Icon
            name={icons.CHECK_CIRCLE}
            size={15}
            style={{
              marginRight: 3,
            }}
          />
        </reactNativeAnimatable.View>
      ) : null}
      {singers && singers.length > 0 ? (
        <Text numberOfLines={1} style={[T.singer]}>
          {singers} {album && `|  ${album}`}
        </Text>
      ) : null}
    </ReactNative.View>
  </ReactNative.View>
);
const T = ReactNative.StyleSheet.create({
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
