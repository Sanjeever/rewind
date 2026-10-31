import {toast} from '../native/toast';
import Clipboard from '@react-native-clipboard/clipboard';
import * as React from 'react';
import * as ReactNative from 'react-native';
import reactNativePopupMenu from 'react-native-popup-menu';
import * as components from '../components/index';
import VideoPlayer from '../player/VideoPlayer';
import providers from '../services/providers';
import names from '../events/names';
import icons from '../theme/icons';
import locales from '../locales/index';
import * as services from '../services/index';
import * as events from '../events/index';
import intentVideo from '../native/intentVideo';
import orientation from '../native/orientation';
const y = (brs) => brs[1080] || brs[720] || brs[480] || brs[240];
class Video extends React.Component {
  state = {
    isFullscreen: false,
    hideStatus: false,
    url: undefined,
    title: undefined,
  };
  onBackPress = () => {
    if (this.state.isFullscreen) {
      this.exitFullscreen();
      return true;
    }
  };
  getMVUrl = async (id, api) => {
    try {
      let url;
      let title;
      if (api === providers.netEase) {
        const response = await services.Netease.mv(id);
        if (response?.data) {
          url = y(response.data.brs);
          title = `${response.data.name} - ${response.data.artistName}`;
        }
      } else if (api === providers.qqMusic) {
        url = await services.QQMusic.getMV(id);
      }
      if (!url) {
        throw new Error(locales.MV_PLAYER_ERROR);
      }
      this.setState({
        url,
        title,
      });
    } catch (error) {
      toast(error.message);
    }
  };
  fullscreen = () => {
    orientation.lockToLandscape();
    this.setState({
      isFullscreen: true,
    });
  };
  exitFullscreen = () => {
    this.setState({
      isFullscreen: false,
    });
    orientation.lockToPortrait();
  };
  componentDidMount() {
    this.backSubscription = ReactNative.BackHandler.addEventListener(
      'hardwareBackPress',
      this.onBackPress,
    );
    const e = (this.props.route || {}).params || {};
    const {mvid, api} = e;
    this.getMVUrl(mvid, api);
    events.emitter.emit(names.HidePlayer, {
      hide: true,
    });
  }
  componentWillUnmount() {
    this.exitFullscreen();
    this.backSubscription?.remove();
    events.emitter.emit(names.HidePlayer, {
      hide: false,
    });
  }
  render() {
    const state = this.state;
    const {url, title, isFullscreen, hideStatus} = state;
    return (
      <ReactNative.View
        style={[
          C.container,
          isFullscreen && {
            paddingTop: 0,
          },
        ]}
      >
        <VideoPlayer
          title={title}
          source={{
            uri: url,
          }}
          onBack={this.props.navigation.goBack}
          onEnterFullscreen={this.fullscreen}
          onExitFullscreen={this.exitFullscreen}
          onShowControls={() => {
            this.setState({
              hideStatus: false,
            });
          }}
          onHideControls={() => {
            this.setState({
              hideStatus: true,
            });
          }}
          toggleResizeModeOnFullscreen={false}
          TopRight={
            <E
              onCopy={function () {
                toast(locales.MV_URL_CLIPBOARD);
                Clipboard.setString(url);
              }}
              onOpenUrl={function () {
                ReactNative.Linking.openURL(url);
              }}
              onIntentVideo={function () {
                intentVideo.playVideo(url);
              }}
            />
          }
          isFullscreen={isFullscreen}
          doubleTapTime={200}
          playInBackground={true}
        />
        <ReactNative.StatusBar hidden={hideStatus} />
      </ReactNative.View>
    );
  }
}
var E = function ({onCopy, onOpenUrl, onIntentVideo}) {
  return (
    <reactNativePopupMenu.Menu
      style={{
        width: '100%',
      }}
    >
      <reactNativePopupMenu.MenuTrigger
        customStyles={{
          triggerWrapper: {
            alignItems: 'center',
            justifyContent: 'center',
          },
          TriggerTouchableComponent: ReactNative.TouchableOpacity,
        }}
      >
        <components.Icon name={icons.DOTS_VERTICAL} />
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
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
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
            size={20}
          />
        </reactNativePopupMenu.MenuOption>
        <reactNativePopupMenu.MenuOption onSelect={onOpenUrl}>
          <components.Icon
            name={icons.LINK_VARIANT}
            style={{
              margin: 2,
            }}
          />
        </reactNativePopupMenu.MenuOption>
        <reactNativePopupMenu.MenuOption onSelect={onIntentVideo}>
          <components.Icon
            name={icons.VIDEO_OUTLINE}
            style={{
              margin: 2,
            }}
          />
        </reactNativePopupMenu.MenuOption>
      </reactNativePopupMenu.MenuOptions>
    </reactNativePopupMenu.Menu>
  );
};
var C = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    backgroundColor: '#000',
  },
});
export default Video;
