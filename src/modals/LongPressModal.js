import {toast} from '../native/toast';
import Clipboard from '@react-native-clipboard/clipboard';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeAnimatable from 'react-native-animatable';
import * as components from '../components/index';
import providers from '../services/providers';
import * as constants from '../theme/constants';
import names from '../events/names';
import icons from '../theme/icons';
import locales from '../locales/index';
import * as events from '../events/index';
import * as trackInfo from '../services/trackInfo';
import * as sharedUrlsModule from '../services/sharedUrls';
const h = (img) => img.replace(/100y100/gi, '500y500').replace(/150x150/, '500x500');
const C = 'song';
const y = 'artist';
const I = 'album';
class LongPressModal extends React.PureComponent {
  state = {
    visible: false,
    defaultType: true,
  };
  onClose = () => {
    this.setState({
      visible: false,
      defaultType: true,
      obj: null,
      item: null,
    });
  };
  getImg = function (e) {
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
  onPressIcon = (e) => {
    const a_state = this.state;
    const {obj, defaultType} = a_state;
    if (a_state.item) {
      if (defaultType === false) {
        this.openUrl(obj, e);
      } else if (e === 'song') {
        this.copy(obj.song);
      } else if (e === 'artist') {
        this.copy(obj.singer[0].name);
      } else if (e === 'album') {
        this.copy(obj.album);
      }
      this.onClose();
    }
  };
  openUrl = (e, t) => {
    let n;
    const e_api = e.api;
    const r = T(this.state.item, t);
    if (e_api === providers.netEase) {
      n = sharedUrlsModule.sharedUrls.netEase[t] + r;
    } else if (e_api === providers.qqMusic) {
      n = `${sharedUrlsModule.sharedUrls.qqMusic[t] + r}.html`;
    }
    this.linking(n);
  };
  copy = function (e) {
    Clipboard.setString(e);
    toast(`${locales.COPIED} ${e}`);
  };
  linking = function (e) {
    ReactNative.Linking.openURL(e);
  };
  componentDidMount() {
    const e = this;
    this.sub = events.emitter.addListener(names.LongPressModal, function ({item}) {
      e.setState({
        item,
        obj: trackInfo.extractFullInfo(item),
        visible: true,
      });
    });
  }
  componentWillUnmount() {
    this.sub.remove?.();
  }
  render() {
    const e = this;
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
                onPress={function () {
                  return e.onPressIcon(C);
                }}
                color={'#000'}
              />
              <components.Icon
                name={icons.ACCOUNT_MUSIC_OUTLINE}
                onPress={function () {
                  return e.onPressIcon(y);
                }}
                color={'#000'}
              />
              <components.Icon
                name={icons.ALBUM}
                onPress={function () {
                  return e.onPressIcon(I);
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
const E = (e, t) => {
  switch (t) {
    case 'song':
      return e;
    case 'artist':
      return (e.singer || e.ar || e.artist)[0];
    case 'album':
      return e.al || e.album;
  }
};
var T = (item, t) => {
  let n;
  const a = E(item, t);
  switch (t) {
    case 'song':
      n = a.songmid || a.mid || a.id;
      break;
    case 'artist':
      n = a.mid || a.id;
      break;
    case 'album':
      n = item.albummid || a.mid || a.id;
  }
  return n;
};
var H = ReactNative.StyleSheet.create({
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
