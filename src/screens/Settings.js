import {toast} from '../native/toast';
import Text from './../components/Text';
import * as _appStorage from './../storage/index';
import {mergeSettings} from '../settings/merge';
import * as React from 'react';
import * as ReactNative from 'react-native';
import reactNativeSlider from '@react-native-community/slider';
import * as reactNativeSpringScrollview from './../components/Scrolling';
import * as components from '../components/index';
import * as defaults from '../settings/defaults';
import * as constants from '../theme/constants';
import names from '../events/names';
import icons from '../theme/icons';
import keysModule from '../storage/keys';
import locales from '../locales/index';
import * as events from '../events/index';
import restartModule from '../native/restart';
class Settings extends React.Component {
  state = {
    settings: defaults.defaultSettings,
    modified: false,
    modal: false,
  };
  save = async () => {
    if (!this.state.modified) {
      return false;
    }
    await _appStorage.storage.save({
      key: keysModule.settings,
      data: this.state.settings,
    });
    events.emitter.emit(names.SettingsChanged);
    return true;
  };
  alertResetSettings = () => {
    ReactNative.Alert.alert(locales.WARN, locales.CONFIRM_RESET_ALL_SETTINGS, [
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
          return this.resetSettings();
        },
      },
    ]);
  };
  resetSettings = async () => {
    try {
      const settings = mergeSettings({}, defaults.defaultSettings);
      await _appStorage.storage.save({
        key: keysModule.settings,
        data: settings,
      });
      this.setState({
        settings,
        modified: false,
      });
      events.emitter.emit(names.SettingsChanged);
    } catch (error) {
      toast(`设置保存失败：${error.message}`);
    }
  };
  onValueChange = (e) => {
    const settings = this.state.settings;
    settings.bottomPadding.subtitle = e;
    this.setState({
      settings,
      modified: true,
    });
  };
  onSlidingComplete = function (e) {
    events.emitter.emit(names.BottomPaddingChange, e);
  };
  onTop = () => {
    return this.scrollView.scrollToBegin?.();
  };
  renderSettingItems = () => {
    const settings = this.state.settings;
    return defaults.settingsMap.map((t, key) => {
      const i = settings[t];
      const o = defaults.defaultSettings[t];
      if (t.includes('SECTION')) {
        return (
          <components.Title key={t} style={C.sectionText}>
            {defaults.sectionsMap[t].title}
          </components.Title>
        );
      }
      if (t === 'bottomPadding') {
        return (
          <components.SettingItem
            key={key}
            title={o.title}
            subtitle={o.subtitle || null}
            onPress={this.onShowBottomPaddingModal}
            showChevron={true}
          />
        );
      }
      return (
        <ReactNative.TouchableNativeFeedback
          key={key}
          onPress={() => {
            return this.switchOptions(t);
          }}
        >
          <components.SettingItem
            key={key}
            title={o.title}
            subtitle={o.subtitle || null}
            switchButton={true}
            switched={i.on}
            onSwitch={() => {
              return this.switchOptions(t);
            }}
          />
        </ReactNative.TouchableNativeFeedback>
      );
    });
  };
  onModalClose = () => {
    this.setState({
      modal: false,
    });
  };
  restart = () => {
    this.save()
      .then(() => {
        restartModule.restart();
      })
      .catch((error) => {
        toast(`设置保存失败：${error.message}`);
      });
  };
  onShowBottomPaddingModal = () => {
    this.setState({
      modal: true,
    });
  };
  switchOptions = async (key) => {
    const settings = {
      ...this.state.settings,
      [key]: {
        ...this.state.settings[key],
        on: !this.state.settings[key].on,
      },
    };
    const previous = this.state.settings;
    this.setState({
      settings,
      modified: true,
    });
    try {
      await _appStorage.storage.save({
        key: keysModule.settings,
        data: settings,
      });
      this.setState({
        modified: false,
      });
      events.emitter.emit(names.SettingsChanged);
    } catch (error) {
      this.setState({
        settings: previous,
      });
      toast(`设置保存失败：${error.message}`);
    }
  };
  async componentDidMount() {
    const stored = await _appStorage.storage.load({
      key: keysModule.settings,
    });
    this.setState({
      settings: mergeSettings(stored, defaults.defaultSettings),
    });
  }
  componentWillUnmount() {
    this.save().catch((error) => toast(`设置保存失败：${error.message}`));
  }
  render() {
    const settings = this.state.settings;
    return (
      <components.PageContainer
        title={locales.SETTING}
        goBack={() => {
          return this.props.navigation.goBack();
        }}
        rightIcon={{
          name: icons.BACKUP_RESTORE,
          onPress: this.alertResetSettings,
        }}
        onTop={this.onTop}
      >
        <reactNativeSpringScrollview.SpringScrollView
          ref={(instance) => (this.scrollView = instance)}
          style={{
            padding: 10,
            paddingHorizontal: 15,
          }}
        >
          {this.renderSettingItems()}
          <ReactNative.TouchableOpacity onPress={this.restart}>
            <Text style={C.text}>{locales.RESTART_APP}</Text>
          </ReactNative.TouchableOpacity>
          <ReactNative.View
            style={{
              height: 100,
            }}
          />
          <ReactNative.Modal
            visible={this.state.modal}
            onRequestClose={this.onModalClose}
            transparent={true}
            animationType={'fade'}
          >
            <ReactNative.View
              style={{
                height: constants.DEVICE_HEIGHT / 2,
                width: '100%',
                backgroundColor: 'rgba(0,0,0,0)',
              }}
            >
              <ReactNative.View style={C.modal}>
                <components.Background />
                {React.createElement(reactNativeSlider, {
                  style: {
                    width: '90%',
                  },
                  maximumTrackTintColor: constants.COLORS.primaryAlpha70,
                  minimumTrackTintColor: constants.COLORS.primaryAlpha10,
                  thumbTintColor: constants.COLORS.primary,
                  value: settings.bottomPadding.subtitle,
                  maximumValue: 100,
                  onValueChange: this.onValueChange,
                  onSlidingComplete: this.onSlidingComplete,
                  step: 1,
                })}
                <Text style={C.text}>
                  {locales.RELATIVE_VALUE}
                  {':'}
                  {String(settings.bottomPadding.subtitle)}
                </Text>
                <ReactNative.TouchableOpacity onPress={this.onModalClose}>
                  <Text
                    style={[
                      C.text,
                      {
                        marginTop: 20,
                        fontSize: 18,
                      },
                    ]}
                  >
                    {locales.CONFIRM}
                  </Text>
                </ReactNative.TouchableOpacity>
              </ReactNative.View>
            </ReactNative.View>
          </ReactNative.Modal>
        </reactNativeSpringScrollview.SpringScrollView>
      </components.PageContainer>
    );
  }
}
var C = ReactNative.StyleSheet.create({
  modal: {
    height: '50%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  text: {
    fontSize: 14,
    alignSelf: 'center',
    marginTop: 20,
  },
  sectionText: {
    marginVertical: 5,
    paddingLeft: 10,
  },
});
export default Settings;
