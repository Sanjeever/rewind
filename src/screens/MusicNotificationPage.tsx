import * as appStorage from './../storage/index';
import * as immer from 'immer';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeSpringScrollview from './../components/Scrolling';
import * as components from '../components/index';
import notification from '../settings/notification';
import icons from '../theme/icons';
import keys from '../storage/keys';
import locales from '../locales/index';
import restartModule from '../native/restart';
import NotificationOption from '../features/settings/NotificationOption';
import {toast} from '../native/toast';
import {errorMessage} from '../utils/types';
import type {Navigation} from '../navigation/types';
type Config = typeof notification.configObject;
const {configObject, configKeys} = notification;
class MusicNotificationPage extends React.PureComponent<
  {navigation: Pick<Navigation, 'goBack'>},
  {config: Config; changed: boolean}
> {
  backSubscription?: ReactNative.NativeEventSubscription;
  state = {
    config: configObject,
    changed: false,
  };
  onBackPress = () => {
    return !!this.state.changed && (this.alertChange(), true);
  };
  confirmChange = async () => {
    if (await this.saveConfig()) restartModule.restart();
  };
  loadConfig = () => {
    appStorage.storage
      .load<Config>({
        key: keys.musicNotification,
      })
      .then((config) => {
        if (config) {
          this.setState({
            config,
          });
        }
      });
  };
  saveConfig = async () => {
    try {
      await appStorage.storage.save({
        key: keys.musicNotification,
        data: this.state.config,
      });
      return true;
    } catch (error) {
      toast('保存通知设置失败：' + errorMessage(error));
      return false;
    }
  };
  onSwitch = (e: keyof Config) => {
    const config = immer.produce(this.state.config, function (t) {
      t[e].on = !t[e].on;
    });
    this.setState(
      {
        config,
        changed: true,
      },
      this.saveConfig,
    );
  };
  removeStorage = () => {
    appStorage.storage.remove({
      key: keys.musicNotification,
    });
    this.setState({
      config: configObject,
    });
  };
  componentDidMount() {
    this.loadConfig();
    this.backSubscription = ReactNative.BackHandler.addEventListener(
      'hardwareBackPress',
      this.onBackPress,
    );
  }
  componentWillUnmount() {
    this.backSubscription?.remove();
  }
  alertChange() {
    ReactNative.Alert.alert(locales.WARN, locales.NEED_RELOAD_APP, [
      {
        text: locales.CANCEL,
        onPress: () => {
          this.props.navigation.goBack();
        },
        style: 'cancel',
      },
      {
        text: locales.CONFIRM,
        onPress: this.confirmChange,
      },
    ]);
  }
  render() {
    const config = this.state.config;
    return (
      <components.PageContainer
        title={locales.MUSIC_NOTIFICATION}
        goBack={this.props.navigation.goBack}
        rightIcon={[
          {
            name: icons.BACKUP_RESTORE,
            onPress: () => {
              return this.removeStorage();
            },
          },
        ]}
      >
        <reactNativeSpringScrollview.SpringScrollView
          style={{
            padding: 10,
          }}
        >
          {configKeys.map((n, key) => {
            const r = config[n];
            return (
              <NotificationOption
                key={key}
                name={r.title}
                switched={r.on}
                onSwitch={() => {
                  return this.onSwitch(n);
                }}
              />
            );
          })}
        </reactNativeSpringScrollview.SpringScrollView>
      </components.PageContainer>
    );
  }
}
export default MusicNotificationPage;
