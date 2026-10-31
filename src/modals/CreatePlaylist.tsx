import Text from './../components/Text';
import * as React from 'react';
import * as ReactNative from 'react-native';
import reactNativeImageCropPicker from 'react-native-image-crop-picker';
import * as components from '../components/index';
import icons from '../theme/icons';
import locales from '../locales/index';
import * as files from '../storage/files';
class CreatePlaylist extends React.PureComponent<
  {showModal: boolean; closeModal(): void; createPL(playlist: {title: string; img: string}): void},
  {coverImg: string; coverTitle: string}
> {
  state = {
    coverImg: '',
    coverTitle: locales.DEFAULT_MIX_TITLE,
  };
  openRoll = () => {
    reactNativeImageCropPicker
      .openPicker({
        width: 400,
        height: 400,
        cropping: true,
        enableRotationGesture: true,
      })
      .then((e) => {
        const coverTitle = this.state.coverTitle;
        files
          .moveToFiles({
            from: e.path,
            dest: 'playlist/imgs',
            fileName: coverTitle,
          })
          .then((e) => {
            this.setState({
              coverImg: `file://${e}`,
            });
          });
      })
      .catch((e) => e);
  };
  render() {
    const props = this.props;
    const {showModal, closeModal, createPL} = props;
    return (
      <ReactNative.Modal animationType={'fade'} visible={showModal} onRequestClose={closeModal}>
        <ReactNative.View style={m.modalCon}>
          <ReactNative.TouchableWithoutFeedback onPress={closeModal}>
            <ReactNative.View style={[ReactNative.StyleSheet.absoluteFill]} />
          </ReactNative.TouchableWithoutFeedback>
          <Text style={m.createTitle}>{'创建本地歌单'}</Text>
          <ReactNative.View
            style={{
              width: '100%',
              alignItems: 'center',
              marginTop: 30,
            }}
          >
            <Text
              style={[
                m.plText,
                {
                  marginBottom: 0,
                },
              ]}
            >
              {'歌单名称'}
            </Text>
            <components.Input
              style={m.textInput}
              placeholder={locales.DEFAULT_MIX_TITLE}
              onChangeText={(coverTitle) => {
                return this.setState({
                  coverTitle,
                });
              }}
            />
            <Text style={m.plText}>{'歌单封面'}</Text>
            <ReactNative.TouchableNativeFeedback onPress={this.openRoll}>
              <ReactNative.View
                style={{
                  alignItems: 'center',
                }}
              >
                {this.state.coverImg ? (
                  <ReactNative.Image
                    source={{
                      uri: this.state.coverImg,
                    }}
                    style={m.coverImg}
                  />
                ) : (
                  <components.Icon name={icons.DISC} size={50} />
                )}
              </ReactNative.View>
            </ReactNative.TouchableNativeFeedback>
            <ReactNative.TouchableNativeFeedback
              onPress={() => {
                return createPL({
                  title: this.state.coverTitle,
                  img: this.state.coverImg,
                });
              }}
            >
              <ReactNative.View
                style={{
                  width: 200,
                  padding: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 30,
                }}
              >
                <Text
                  style={[
                    m.labelText,
                    {
                      fontSize: 16,
                    },
                  ]}
                >
                  {'创建'}
                </Text>
              </ReactNative.View>
            </ReactNative.TouchableNativeFeedback>
          </ReactNative.View>
        </ReactNative.View>
      </ReactNative.Modal>
    );
  }
}
export default CreatePlaylist;
const m = ReactNative.StyleSheet.create({
  labelText: {
    fontSize: 13,
    opacity: 0.9,
  },
  modalCon: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createTitle: {
    fontSize: 18,
  },
  plText: {
    fontSize: 14,
    marginTop: 20,
    marginBottom: 10,
  },
  textInput: {
    width: '80%',
    fontSize: 15,
    textAlign: 'center',
  },
  coverImg: {
    height: 100,
    width: 100,
    borderRadius: 5,
  },
});
