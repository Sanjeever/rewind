import * as _appStorage from './../storage/index.js';
import * as immer from 'immer';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeSpringScrollview from './../components/Scrolling.js';
import * as components from '../components/index';
import notification from '../settings/notification';
import icons from '../theme/icons';
import keys from '../storage/keys';
import locales from '../locales/index';
import restartModule from '../native/restart';
import NotificationOption from './../modules/NotificationOption.js';
const {configObject, configKeys} = notification;
class MusicNotificationPage extends React.PureComponent {
  state = {
    config: configObject,
    changed: false,
  };
  onBackPress = () => {
    return !!this.state.changed && (this.alertChange(), true);
  };
  confirmChange = () => {
    this.saveConfig();
    setTimeout(() => {
      restartModule.restart();
    }, 99);
  };
  loadConfig = () => {
    _appStorage.storage
      .load({
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
  saveConfig = () => {
    _appStorage.storage.save({
      key: keys.musicNotification,
      data: this.state.config,
    });
  };
  onSwitch = (e) => {
    const config = immer.produce(this.state.config, function (t) {
      t[e].on = !t[e].on;
    });
    this.setState({
      config,
      changed: true,
    });
    this.saveConfig();
  };
  removeStorage = () => {
    _appStorage.storage.remove({
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
