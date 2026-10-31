import Text from './Text';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeAnimatable from 'react-native-animatable';
import TouchableScale from './TouchableScale';
import * as components from './index';
import * as constants from '../theme/constants';
import icons from '../theme/icons';
import * as trackInfo from '../services/trackInfo';
import reactNativePopupMenu from 'react-native-popup-menu';
const g = 0.9 * constants.DEVICE_WIDTH;
const E = 0.5 * constants.DEVICE_WIDTH;
const b = 0.2 * constants.DEVICE_WIDTH;
const I = function ({onWebview, onOpenUrl, onCopy, onShare}) {
  return (
    <reactNativePopupMenu.Menu>
      <reactNativePopupMenu.MenuTrigger
        customStyles={{
          triggerWrapper: {
            alignItems: 'center',
            justifyContent: 'center',
          },
          TriggerTouchableComponent: ReactNative.TouchableOpacity,
        }}
      >
        <components.IconButton name={icons.MENU_OPEN} size={25} disabled={true} />
      </reactNativePopupMenu.MenuTrigger>
      <reactNativePopupMenu.MenuOptions
        style={{
          color: '#000',
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          borderWidth: 1,
          borderColor: '#fff',
          borderRadius: 16,
          padding: 8,
          flex: 0,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}
        optionsContainerStyle={{
          elevation: 0,
          borderRadius: 16,
          flex: 0,
          width: 'auto',
        }}
        customStyles={{
          OptionTouchableComponent: ReactNative.TouchableOpacity,
        }}
      >
        <reactNativePopupMenu.MenuOption onSelect={onCopy}>
          <components.Icon
            name={icons.CONTENT_COPY}
            style={{
              margin: 2,
            }}
            size={23}
          />
        </reactNativePopupMenu.MenuOption>
        <reactNativePopupMenu.MenuOption onSelect={onOpenUrl}>
          <components.Icon
            name={icons.LINK_VARIANT}
            style={{
              margin: 2,
            }}
            size={25}
          />
        </reactNativePopupMenu.MenuOption>
        <reactNativePopupMenu.MenuOption onSelect={onWebview}>
          <components.Icon
            name={icons.WEB}
            style={{
              margin: 2,
            }}
            size={25}
          />
        </reactNativePopupMenu.MenuOption>
        <reactNativePopupMenu.MenuOption onSelect={onShare}>
          <components.Icon
            name={icons.SHARE_VARIANT_OUTLINE}
            style={{
              margin: 2,
            }}
            size={25}
          />
        </reactNativePopupMenu.MenuOption>
      </reactNativePopupMenu.MenuOptions>
    </reactNativePopupMenu.Menu>
  );
};
class PlaylistForeground extends React.PureComponent {
  render() {
    const props = this.props;
    const {
      coverImgUrl,
      onRestore,
      showRestore,
      subscribed,
      onSubscribe,
      savePic,
      orderText,
      onSortText,
    } = props;
    props.heartMode;
    const {
      onHeartMode,
      onSort,
      onMult,
      isCreatedByMe,
      lastPlayedSong,
      onPlay,
      onInsert,
      onWebview,
      creator,
      onUser,
      disabledLastPlayedSong,
      onCopy,
      onOpenUrl,
      onShare,
    } = props;
    return (
      <React.Fragment>
        <ReactNative.View style={[C.foreground]}>
          <ReactNative.View style={C.coverCon}>
            {h({
              coverImgUrl,
              savePic,
              creator,
              onUser,
            })}
          </ReactNative.View>
          <ReactNative.View style={C.extraBtnCon}>
            {orderText ? (
              <ReactNative.TouchableOpacity
                activeOpacity={0.7}
                onPress={onSortText}
                style={{
                  position: 'absolute',
                  left: 50,
                  bottom: 0,
                }}
              >
                <reactNativeAnimatable.Text style={C.sortText} animation={'fadeIn'}>
                  {orderText}
                </reactNativeAnimatable.Text>
              </ReactNative.TouchableOpacity>
            ) : null}
            {onSort && (
              <components.IconButton name={icons.SORT_VARIANT} size={25} onPress={onSort} />
            )}
            {showRestore && (
              <components.IconButton name={icons.BACKUP_RESTORE} onPress={onRestore} size={25} />
            )}
            {onHeartMode && isCreatedByMe && (
              <components.IconButton name={icons.HEART_PULSE} size={25} onPress={onHeartMode} />
            )}
            {!isCreatedByMe && onSubscribe && (
              <components.IconButton
                name={subscribed ? icons.PLAYLIST_REMOVE : icons.PLAYLIST_PLUS}
                size={25}
                onPress={onSubscribe}
              />
            )}
            {onMult && (
              <components.IconButton
                name={icons.CHECKBOX_MULTIPLE_MARKED_CIRCLE_OUTLINE}
                size={25}
                onPress={onMult}
              />
            )}
            {onWebview && (
              <I onWebview={onWebview} onCopy={onCopy} onOpenUrl={onOpenUrl} onShare={onShare} />
            )}
          </ReactNative.View>
        </ReactNative.View>
        {!disabledLastPlayedSong &&
          y({
            lastPlayedSong,
            onPlay,
            onInsert,
          })}
      </React.Fragment>
    );
  }
}
export default PlaylistForeground;
var h = ({coverImgUrl, savePic, onUser, creator}) => {
  if (coverImgUrl) {
    return (
      <React.Fragment>
        <TouchableScale onPress={savePic} style={C.coverImg}>
          <ReactNative.Image
            style={C.coverImg}
            source={{
              uri: coverImgUrl,
            }}
          />
        </TouchableScale>
        {creator?.avatarUrl && (
          <TouchableScale style={C.avatarCon} onPress={onUser}>
            <ReactNative.Image
              style={C.avatar}
              source={{
                uri: creator.avatarUrl,
              }}
            />
          </TouchableScale>
        )}
      </React.Fragment>
    );
  }
  return (
    <ReactNative.View style={[C.coverCon]}>
      <ReactNative.View
        style={[
          C.coverImg,
          {
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: E / 2,
          },
        ]}
      >
        <components.Icon name={icons.DISC} size={100} color={'#111'} />
      </ReactNative.View>
    </ReactNative.View>
  );
};
var y = ({lastPlayedSong, onPlay, onInsert}) => {
  if (lastPlayedSong === null) {
    return (
      <ReactNative.TouchableNativeFeedback onPress={onPlay}>
        <ReactNative.View
          style={{
            width: constants.DEVICE_WIDTH,
            height: 60,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 13,
          }}
        >
          <components.Icon name={icons.PLAY} />
          <Text
            style={{
              marginLeft: 7,
            }}
          >
            {'播放全部'}
          </Text>
        </ReactNative.View>
      </ReactNative.TouchableNativeFeedback>
    );
  }
  const r = trackInfo.extractFullInfo(lastPlayedSong);
  return (
    <ReactNative.TouchableNativeFeedback onPress={onPlay}>
      <ReactNative.View
        style={{
          height: 60,
          width: constants.DEVICE_WIDTH,
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 11,
          paddingRight: 18,
        }}
      >
        <TouchableScale onPress={onInsert}>
          <ReactNative.Image
            source={{
              uri: r.img,
            }}
            style={{
              height: 26,
              width: 26,
              borderRadius: 13,
              marginRight: 3,
            }}
          />
        </TouchableScale>
        <components.SongRow
          containerStyle={{
            flex: 1,
          }}
          song={r.song}
          singer={r.singer}
          alias={r.alias}
          index={null}
          disabled={true}
        />
        <components.Icon name={icons.PLAY} />
      </ReactNative.View>
    </ReactNative.TouchableNativeFeedback>
  );
};
var C = ReactNative.StyleSheet.create({
  foreground: {
    width: '100%',
    height: g,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverCon: {
    height: E,
    width: '100%',
    alignItems: 'center',
  },
  coverImg: {
    width: E,
    height: E,
    borderRadius: 5,
  },
  extraBtnCon: {
    position: 'absolute',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    bottom: 0,
    height: b,
    paddingHorizontal: 20,
  },
  avatarCon: {
    position: 'absolute',
    right: 70,
    bottom: -10,
  },
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#fff',
  },
  sortText: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    color: '#000',
    padding: 3,
    fontWeight: 'bold',
    borderRadius: 1,
  },
});
