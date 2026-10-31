import {subscribeModal} from './commands';
import {toast} from '../native/toast';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as ReactNativeAnimatable from 'react-native-animatable';
import rnFetchBlob from 'react-native-blob-util';
import * as constants from '../theme/constants';
import * as paths from '../storage/paths';
import locales from '../locales/index';
import _mediaStore from '../native/mediaStore';
import type {Subscription} from '../events/Emitter';
import {errorMessage} from '../utils/types';
const m =
  'alipays://platformapi/startapp?saId=10000007&qrcode=https://qr.alipay.com/fkx05853auiq7gkm8jbmccb';
const uri = 'https://s2.ax1x.com/2020/02/27/301NcV.jpg';
interface State {
  img?: string;
  song?: string;
  mainModalShow: boolean;
  type: string;
}
class SavePicModal extends React.PureComponent<Record<string, never>, State> {
  sub!: Subscription;
  state: State = {
    img: '',
    song: '',
    mainModalShow: false,
    type: '',
  };
  sponsorSave = () => {
    return this.downloadSource(uri, 'thanks.jpg', '赞赏码');
  };
  saveTo = async () => {
    const state = this.state;
    const {img, song} = state;
    try {
      if (state.type !== 'sponsor') {
        if (!img) {
          throw new Error('封面地址为空');
        }
        const o = `${song}_${String(Date.now())}`;
        const l = img.replace(/\?param=.+y.+/gi, '');
        await this.downloadSource(l, `${o.replace(/[\\/:*?"<>|]/g, '_')}.jpg`, '封面');
      } else {
        await this.sponsorSave();
      }
      this.onClosed();
    } catch (error) {
      toast(`${locales.SAVE_FAILED}：${errorMessage(error)}`);
    }
  };
  downloadSource = async (source: string, name: string, folder: string) => {
    const temporary = `${paths.cache_dir}cover-${Date.now()}.jpg`;
    try {
      let path = source;
      if (source.startsWith('data:image/')) {
        await rnFetchBlob.fs.writeFile(temporary, source.slice(source.indexOf(',') + 1), 'base64');
        path = temporary;
      } else if (/^https?:/.test(source)) {
        const response = await rnFetchBlob
          .config({
            path: temporary,
          })
          .fetch('GET', source);
        const status = response.info().status;
        if (status < 200 || status >= 300) {
          throw new Error(`HTTP ${status}`);
        }
        path = temporary;
      }
      await _mediaStore.publish(path, name, 'image/jpeg', folder);
    } finally {
      if (await rnFetchBlob.fs.exists(temporary)) {
        await rnFetchBlob.fs.unlink(temporary);
      }
    }
  };
  onClosed = () => {
    this.setState({
      img: '',
      mainModalShow: false,
      type: '',
    });
  };
  onAliPay = function () {
    ReactNative.Linking.openURL(m);
  };
  componentDidMount() {
    this.sub = subscribeModal('SavePicModal', (t) => {
      this.setState({
        img: t.img,
        song: t.song,
        type: t.type || '',
        mainModalShow: true,
      });
    });
  }
  componentWillUnmount() {
    this.sub.remove?.();
  }
  render() {
    const state = this.state;
    const {type, img} = state;
    return (
      <ReactNative.Modal
        animationType={'fade'}
        transparent={true}
        visible={this.state.mainModalShow}
        onRequestClose={this.onClosed}
      >
        <ReactNative.View style={g.container}>
          <ReactNative.TouchableWithoutFeedback onPress={this.onClosed}>
            <ReactNative.View style={[ReactNative.StyleSheet.absoluteFill]} />
          </ReactNative.TouchableWithoutFeedback>
          {img !== '' ? (
            <ReactNativeAnimatable.Image
              animation={'zoomIn'}
              source={{
                uri: img,
              }}
              style={g.img}
            />
          ) : null}
          {type === 'sponsor' ? (
            <ReactNativeAnimatable.Image
              animation={'zoomIn'}
              source={{
                uri,
              }}
              style={g.img}
            />
          ) : null}
          <ReactNative.TouchableOpacity style={g.btn} onPress={this.saveTo}>
            <ReactNativeAnimatable.Text animation={'fadeInUp'}>
              {locales.SAVE}
            </ReactNativeAnimatable.Text>
          </ReactNative.TouchableOpacity>
          {type === 'sponsor' ? (
            <ReactNative.TouchableOpacity onPress={this.onAliPay}>
              <ReactNativeAnimatable.Text
                animation={'fadeIn'}
                style={[
                  {
                    marginTop: 20,
                  },
                ]}
              >
                {locales.ALI_PAY}
              </ReactNativeAnimatable.Text>
            </ReactNative.TouchableOpacity>
          ) : null}
        </ReactNative.View>
      </ReactNative.Modal>
    );
  }
}
const g = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
  btn: {
    marginTop: 25,
    alignItems: 'center',
    width: 100,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  img: {
    width: 0.8 * constants.DEVICE_WIDTH,
    height: 0.8 * constants.DEVICE_WIDTH,
    borderRadius: 5,
  },
});
export default SavePicModal;
