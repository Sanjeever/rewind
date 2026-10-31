import {toast} from '../native/toast';
import Clipboard from '@react-native-clipboard/clipboard';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativePopupMenu from 'react-native-popup-menu';
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
import type {ScreenProps} from '../navigation/types';
import type {Provider} from '../services/providers';
import type {TrackId} from '../services/track';
import {errorMessage} from '../utils/types';
const y = (brs: Record<string, string>) => brs[1080] || brs[720] || brs[480] || brs[240];
class Video extends React.Component<
  ScreenProps<'Video'>,
  {isFullscreen: boolean; hideStatus: boolean; url?: string; title?: string}
> {
  active = false;
  backSubscription?: ReactNative.NativeEventSubscription;
  state: {isFullscreen: boolean; hideStatus: boolean; url?: string; title?: string} = {
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
    return false;
  };
  getMVUrl = async (id: TrackId, api: Provider) => {
    try {
      let url;
      let title;
      if (api === providers.netEase) {
        const response = await services.Netease.mv(id);
        if (response?.data?.brs) {
          url = y(response.data.brs);
          title = `${response.data.name} - ${response.data.artistName}`;
        }
      } else if (api === providers.qqMusic) {
        url = (await services.QQMusic.getMV(id)) || undefined;
      }
      if (!url) {
        throw new Error(locales.MV_PLAYER_ERROR);
      }
      if (!this.active) return;
      this.setState({
        url,
        title,
      });
    } catch (error) {
      if (this.active) toast(errorMessage(error));
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
    this.active = true;
    this.backSubscription = ReactNative.BackHandler.addEventListener(
      'hardwareBackPress',
      this.onBackPress,
    );
    const e = this.props.route.params;
    const {mvid, api} = e;
    this.getMVUrl(mvid, api);
    events.emitter.emit(names.HidePlayer, {
      hide: true,
    });
  }
  componentWillUnmount() {
    this.active = false;
    orientation.lockToPortrait();
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
                if (!url) return;
                toast(locales.MV_URL_CLIPBOARD);
                Clipboard.setString(url);
              }}
              onOpenUrl={function () {
                if (!url) return;
                ReactNative.Linking.openURL(url);
              }}
              onIntentVideo={function () {
                if (!url) return;
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
const E = function ({
  onCopy,
  onOpenUrl,
  onIntentVideo,
}: {
  onCopy(): void;
  onOpenUrl(): void;
  onIntentVideo(): void;
}) {
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
        customStyles={{
          optionsWrapper: {
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            borderWidth: 1,
            borderColor: '#fff',
            borderRadius: 16,
            padding: 8,
            flex: 0,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
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
const C = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    backgroundColor: '#000',
  },
});
export default Video;
