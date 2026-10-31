import {toast} from '../native/toast';
import Text from './../components/Text';
import * as _appStorage from './../storage/index';
import * as React from 'react';
import * as ReactNative from 'react-native';
import reactNativeImageCropPicker from 'react-native-image-crop-picker';
import reactNativeSlider from '@react-native-community/slider';
import * as components from '../components/index';
import * as constants from '../theme/constants';
import names from '../events/names';
import icons from '../theme/icons';
import keys from '../storage/keys';
import locales from '../locales/index';
import * as events from '../events/index';
import restartModule from '../native/restart';
import * as files from '../storage/files';
class Skin extends React.Component {
  state = {
    img: '',
    value: 1,
    blur: false,
  };
  clearRoll = () => {
    _appStorage.storage
      .remove({
        key: keys.background,
      })
      .then(() => {
        toast(locales.BACKGROUND_CACHE_CLEARED);
      });
    this.setState({
      img: '',
    });
    files.removeBackground();
    setTimeout(() => {
      restartModule.restart();
    }, 99);
  };
  openRoll = () => {
    const width = 2 * (0 | constants.DEVICE_WIDTH);
    const height = 2 * (0 | constants.DEVICE_HEIGHT);
    reactNativeImageCropPicker
      .openPicker({
        width,
        height,
        cropping: true,
        enableRotationGesture: true,
      })
      .then((e) => {
        files
          .moveToFiles({
            from: e.path,
            dest: 'background',
          })
          .then((e) => {
            this.setState({
              img: `file://${e}`,
            });
          });
      })
      .catch((e) => e);
  };
  emit = () => {
    const a_state = this.state;
    const {img, value, blur} = a_state;
    if (!img) {
      toast(locales.SKIN_NOT_PICK_PIC);
      return false;
    }
    events.emitter.emit(names.ChangeBackground, {
      path: img,
      opacity: value,
      blur,
    });
    toast(locales.SKIN_CHANGE_BG_SUCCESS);
  };
  onAlert = () => {
    ReactNative.Alert.alert(
      locales.CONFIRM_CLEAR_BACKGROUND_CACHE,
      locales.NEED_RELOAD_APP,
      [
        {
          text: locales.CANCEL,
          onPress: function () {
            return null;
          },
          style: 'cancel',
        },
        {
          text: locales.CONFIRM,
          onPress: () => {
            return this.clearRoll();
          },
        },
      ],
      {
        cancelable: true,
      },
    );
  };
  onBlur = (blur) => {
    this.setState({
      blur,
    });
  };
  componentDidMount() {
    _appStorage.storage
      .load({
        key: keys.background,
      })
      .then((t) => {
        if (t) {
          this.setState({
            img: t.path,
            value: t.opacity,
            blur: t.blur,
          });
        }
      })
      .catch(() => {
        this.setState({
          img: null,
        });
      });
  }
  render() {
    const state = this.state;
    const {img, value, blur} = state;
    return (
      <ReactNative.View style={[C.container, C.background]}>
        <ReactNative.Image
          style={[
            ReactNative.StyleSheet.absoluteFill,
            C.background,
            {
              opacity: value,
            },
          ]}
          source={{
            uri: img,
          }}
          blurRadius={blur ? 10 : 0}
        />
        <components.HeaderBar
          title={locales.BACKGROUND}
          goBack={this.props.navigation.goBack}
          rightIcon={{
            name: icons.BACKUP_RESTORE,
            onPress: this.onAlert,
          }}
        />
        <ReactNative.View style={C.btn}>
          <ReactNative.View
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              },
            ]}
          >
            <Text>{'背景图：'}</Text>
            <ReactNative.TouchableOpacity onPress={this.openRoll}>
              <components.Icon name={icons.IMAGE} color={'#fff'} />
            </ReactNative.TouchableOpacity>
          </ReactNative.View>
          <ReactNative.View
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
              },
            ]}
          >
            <Text>{'透明度：'}</Text>
            {React.createElement(reactNativeSlider, {
              maximumTrackTintColor: 'rgba(255,255,255,0.1)',
              minimumTrackTintColor: 'rgba(255,255,255,0.8)',
              thumbTintColor: '#fff',
              thumbStyle: [
                {
                  height: 10,
                  width: 10,
                },
              ],
              style: {
                width: 200,
              },
              value,
              onValueChange: (value_1) => {
                return this.setState({
                  value: value_1,
                });
              },
              onSlidingComplete: () => {
                return this.setState({
                  value,
                });
              },
            })}
          </ReactNative.View>
          <ReactNative.View
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
              },
            ]}
          >
            <Text>{'模糊效果：'}</Text>
            <components.Switch value={blur} onValueChange={this.onBlur} />
          </ReactNative.View>
        </ReactNative.View>
        <ReactNative.View style={C.send}>
          <ReactNative.TouchableOpacity onPress={this.emit}>
            <Text style={[C.textBtn]}>{'确认'}</Text>
          </ReactNative.TouchableOpacity>
        </ReactNative.View>
      </ReactNative.View>
    );
  }
}
var C = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    width: constants.DEVICE_WIDTH,
    height: constants.DEVICE_HEIGHT,
  },
  btn: {
    position: 'absolute',
    top: '70%',
    left: 30,
    elevation: 5,
  },
  send: {
    position: 'absolute',
    bottom: 50,
    width: constants.DEVICE_WIDTH,
    alignItems: 'center',
  },
  textBtn: {
    borderColor: '#fff',
    borderWidth: 2,
    padding: 10,
    paddingHorizontal: 50,
    borderRadius: 5,
  },
});
export default Skin;
