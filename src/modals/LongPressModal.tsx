import {subscribeModal} from './commands';
import {toast} from '../native/toast';
import Clipboard from '@react-native-clipboard/clipboard';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeAnimatable from 'react-native-animatable';
import * as components from '../components/index';
import providers from '../services/providers';
import * as constants from '../theme/constants';
import icons from '../theme/icons';
import locales from '../locales/index';
import * as trackInfo from '../services/trackInfo';
import * as sharedUrlsModule from '../services/sharedUrls';
import type {TrackFields} from '../services/track';
import type {Subscription} from '../events/Emitter';
type Kind = 'song' | 'artist' | 'album';
interface State {
  visible: boolean;
  defaultType: boolean;
  item: TrackFields | null;
  obj: ReturnType<typeof trackInfo.extractFullInfo> | null;
}
const h = (img: string) => img.replace(/100y100/gi, '500y500').replace(/150x150/, '500x500');
const C = 'song';
const y = 'artist';
const I = 'album';
class LongPressModal extends React.PureComponent<Record<string, never>, State> {
  sub?: Subscription;
  state: State = {
    visible: false,
    defaultType: true,
    item: null,
    obj: null,
  };
  onClose = () => {
    this.setState({
      visible: false,
      defaultType: true,
      obj: null,
      item: null,
    });
  };
  getImg = function (e: TrackFields | null) {
    if (e) {
      const t = trackInfo.extractFullInfo(e);
      return h(t.img);
    }
  };
  onChangeType = () => {
    this.setState({
      defaultType: !this.state.defaultType,
    });
  };
  onPressIcon = (e: Kind) => {
    const state = this.state;
    const {obj, defaultType} = state;
    if (state.item && obj) {
      if (defaultType === false) {
        this.openUrl(obj, e);
      } else if (e === 'song') {
        this.copy(obj.song || '');
      } else if (e === 'artist') {
        this.copy(typeof obj.singer === 'string' ? obj.singer : obj.singer?.[0]?.name || '');
      } else if (e === 'album') {
        this.copy(obj.album);
      }
      this.onClose();
    }
  };
  openUrl = (e: ReturnType<typeof trackInfo.extractFullInfo>, t: Kind) => {
    let n;
    const e_api = e.api;
    const r = this.state.item && entityId(this.state.item, t);
    if (r == null) return;
    if (e_api === providers.netEase) {
      n = sharedUrlsModule.sharedUrls.netEase[t] + r;
    } else if (e_api === providers.qqMusic) {
      n = `${sharedUrlsModule.sharedUrls.qqMusic[t] + r}.html`;
    }
    if (n) this.linking(n);
  };
  copy = function (e: string) {
    Clipboard.setString(e);
    toast(`${locales.COPIED} ${e}`);
  };
  linking = function (e: string) {
    ReactNative.Linking.openURL(e);
  };
  componentDidMount() {
    this.sub = subscribeModal('LongPressModal', ({item}) => {
      this.setState({
        item,
        obj: trackInfo.extractFullInfo(item),
        visible: true,
      });
    });
  }
  componentWillUnmount() {
    this.sub?.remove();
  }
  render() {
    const state = this.state;
    const {visible, item} = state;
    const l = this.getImg(item);
    return (
      <ReactNative.Modal animationType={'fade'} onRequestClose={this.onClose} visible={visible}>
        <ReactNative.View style={H.container}>
          {l && <components.Background blur={true} coverUrl={l} />}
          <ReactNative.TouchableWithoutFeedback onPress={this.onClose}>
            <ReactNative.View style={[ReactNative.StyleSheet.absoluteFill]} />
          </ReactNative.TouchableWithoutFeedback>
          <reactNativeAnimatable.View
            useNativeDriver={true}
            animation={'bounceIn'}
            easing={'ease-out'}
            style={H.imgCon}
          >
            <ReactNative.Image
              style={H.img}
              source={{
                uri: l,
              }}
            />
            <ReactNative.View
              style={{
                flex: 1,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
              }}
            >
              <components.Icon
                name={this.state.defaultType ? icons.CONTENT_COPY : icons.LINK_VARIANT}
                onPress={this.onChangeType}
                color={'#000'}
              />
              <components.Icon
                name={icons.MUSIC_CIRCLE_OUTLINE}
                onPress={() => {
                  return this.onPressIcon(C);
                }}
                color={'#000'}
              />
              <components.Icon
                name={icons.ACCOUNT_MUSIC_OUTLINE}
                onPress={() => {
                  return this.onPressIcon(y);
                }}
                color={'#000'}
              />
              <components.Icon
                name={icons.ALBUM}
                onPress={() => {
                  return this.onPressIcon(I);
                }}
                color={'#000'}
              />
            </ReactNative.View>
          </reactNativeAnimatable.View>
        </ReactNative.View>
      </ReactNative.Modal>
    );
  }
}
function entityId(item: TrackFields, kind: Kind) {
  if (kind === 'song') return trackInfo.getUid(item);
  if (kind === 'artist') {
    const artists = item.singer || item.ar || item.artists;
    const artist = Array.isArray(artists) ? artists[0] : undefined;
    return artist?.mid || artist?.id;
  }
  const album = item.al || item.album;
  return (
    item.albummid ||
    (album && typeof album === 'object' && !Array.isArray(album)
      ? album.mid || album.id
      : undefined)
  );
}
const H = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgCon: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    height: 0.95 * constants.DEVICE_WIDTH,
    width: 0.8 * constants.DEVICE_WIDTH,
    borderRadius: 15,
    elevation: 2,
  },
  img: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 0.8 * constants.DEVICE_WIDTH,
    width: 0.8 * constants.DEVICE_WIDTH,
  },
});
export default LongPressModal;
