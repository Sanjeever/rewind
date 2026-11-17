import SongRow from '../tracks/SongRow';
import Text from '../../components/Text';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeAnimatable from 'react-native-animatable';
import TouchableScale from '../../components/TouchableScale';
import * as components from '../../components/index';
import * as constants from '../../theme/constants';
import icons from '../../theme/icons';
import * as trackInfo from '../../services/trackInfo';
import * as reactNativePopupMenu from 'react-native-popup-menu';
import type {TrackFields} from '../../services/track';
import type {Provider} from '../../services/providers';
import type {Playlist} from '../../storage/models';
interface Props {
  name?: string;
  api?: Provider;
  trackCount?: number;
  heartMode?: boolean;
  heartPending?: boolean;
  subscribePending?: boolean;
  coverImgUrl?: string;
  creator?: Playlist['creator'];
  lastPlayedSong?: TrackFields | null;
  orderText?: string;
  showRestore?: boolean;
  subscribed?: boolean;
  isCreatedByMe?: boolean;
  disabledLastPlayedSong?: boolean;
  onRestore?(): void;
  onSubscribe?(): void;
  savePic?(): void;
  onSortText?(): void;
  onHeartMode?(): void;
  onSort?(): void;
  onMult?(): void;
  onPlay?(): void;
  onInsert?(): void;
  onWebview?(): void;
  onUser?(): void;
  onCopy?(): void;
  onOpenUrl?(): void;
  onShare?(): void;
}
const g = 304;
const E = 120;
const b = 64;
const I = function ({onWebview, onOpenUrl, onCopy, onShare}: Props) {
  return (
    <reactNativePopupMenu.Menu>
      <reactNativePopupMenu.MenuTrigger
        accessibilityLabel="更多歌单操作"
        accessibilityRole="button"
        customStyles={{
          triggerWrapper: {
            alignItems: 'center',
            justifyContent: 'center',
          },
          TriggerTouchableComponent: ReactNative.TouchableOpacity,
        }}
      >
        <components.IconButton
          accessibilityLabel="更多"
          name={icons.MENU_OPEN}
          size={25}
          disabled={true}
        />
      </reactNativePopupMenu.MenuTrigger>
      <reactNativePopupMenu.MenuOptions
        customStyles={{
          optionsWrapper: {
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            borderWidth: 1,
            borderColor: '#fff',
            borderRadius: 16,
            padding: 8,
            flex: 0,
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          },
          OptionTouchableComponent: ReactNative.TouchableOpacity,
        }}
        optionsContainerStyle={{
          elevation: 0,
          borderRadius: 16,
          flex: 0,
          width: 'auto',
        }}
      >
        <reactNativePopupMenu.MenuOption onSelect={onCopy}>
          <Text>复制链接</Text>
          <components.Icon
            name={icons.CONTENT_COPY}
            style={{
              margin: 2,
            }}
            size={23}
          />
        </reactNativePopupMenu.MenuOption>
        <reactNativePopupMenu.MenuOption onSelect={onOpenUrl}>
          <Text>打开链接</Text>
          <components.Icon
            name={icons.LINK_VARIANT}
            style={{
              margin: 2,
            }}
            size={25}
          />
        </reactNativePopupMenu.MenuOption>
        <reactNativePopupMenu.MenuOption onSelect={onWebview}>
          <Text>网页查看</Text>
          <components.Icon
            name={icons.WEB}
            style={{
              margin: 2,
            }}
            size={25}
          />
        </reactNativePopupMenu.MenuOption>
        <reactNativePopupMenu.MenuOption onSelect={onShare}>
          <Text>分享</Text>
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
class PlaylistForeground extends React.PureComponent<Props> {
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
            <ReactNative.View>
              {h({
                coverImgUrl,
                savePic,
                creator,
                onUser,
              })}
            </ReactNative.View>
            <ReactNative.View style={{flex: 1, marginLeft: 20, gap: 10}}>
              <Text style={{fontSize: 21, fontWeight: '600'}}>{props.name}</Text>
              <Text style={{fontSize: 13, opacity: 0.7}}>
                {[
                  props.api === 'netEase'
                    ? '网易云音乐'
                    : props.api === 'qqMusic'
                      ? 'QQ 音乐'
                      : '本地歌单',
                  props.trackCount == null ? null : `${props.trackCount} 首`,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </Text>
            </ReactNative.View>
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
              <components.IconButton
                accessibilityLabel="排序"
                name={icons.SORT_VARIANT}
                size={25}
                onPress={onSort}
              />
            )}
            {showRestore && (
              <components.IconButton
                accessibilityLabel="恢复顺序"
                name={icons.BACKUP_RESTORE}
                onPress={onRestore}
                size={25}
              />
            )}
            {onHeartMode && isCreatedByMe && (
              <components.IconButton
                accessibilityLabel="心动模式"
                name={icons.HEART_PULSE}
                size={25}
                onPress={onHeartMode}
                busy={props.heartPending}
              />
            )}
            {!isCreatedByMe && onSubscribe && (
              <components.IconButton
                accessibilityLabel={subscribed ? '取消收藏歌单' : '收藏歌单'}
                name={subscribed ? icons.PLAYLIST_REMOVE : icons.PLAYLIST_PLUS}
                size={25}
                onPress={onSubscribe}
                busy={props.subscribePending}
              />
            )}
            {onMult && (
              <components.IconButton
                accessibilityLabel="多选歌曲"
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
const h = ({coverImgUrl, savePic, onUser, creator}: Props) => {
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
const y = ({lastPlayedSong, onPlay, onInsert}: Props) => {
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
        <SongRow
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
const C = ReactNative.StyleSheet.create({
  foreground: {
    width: '100%',
    minHeight: g,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: constants.STATUS_BAR_HEIGHT + 56,
    paddingBottom: b + 16,
  },
  coverCon: {
    minHeight: E,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
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
    right: -8,
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
