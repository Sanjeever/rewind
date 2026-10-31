import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeSpringScrollview from './../components/Scrolling';
import * as components from '../components/index';
import icons from '../theme/icons';
import locales from '../locales/index';
import restartModule from '../native/restart';
import languageModule from '../native/language';
import type {ScreenProps} from '../navigation/types';
const f = [
  {
    name: '中文/大陆',
    code: 'zh_CN',
  },
  {
    name: '中文/臺灣',
    code: 'zh_TW',
  },
  {
    name: '中文/香港',
    code: 'zh_HK',
  },
  {
    name: 'English',
    code: 'en_US',
  },
];
class LanguagePage extends React.PureComponent<
  ScreenProps<'LanguagePage'>,
  {language: string; changed: boolean}
> {
  backSubscription?: ReactNative.NativeEventSubscription;
  state = {
    language: languageModule.language,
    changed: false,
  };
  onBackPress = () => {
    return this.state.changed === true && (this.alertChange(), true);
  };
  confirmChange = function (e: string) {
    languageModule.setLanguageCode(e);
    setTimeout(() => {
      restartModule.restart();
    }, 99);
  };
  changeLanguage = (language: string) => {
    this.setState({
      language,
      changed: !(language === languageModule.language),
    });
  };
  componentDidMount() {
    this.backSubscription = ReactNative.BackHandler.addEventListener(
      'hardwareBackPress',
      this.onBackPress,
    );
  }
  componentWillUnmount() {
    this.backSubscription?.remove();
  }
  alertChange() {
    const language = this.state.language;
    if (languageModule.language !== language) {
      ReactNative.Alert.alert(locales.CONFIRM_CHANGE_LANGUAGE, locales.NEED_RELOAD_APP, [
        {
          text: locales.CANCEL,
          onPress: () => {
            this.props.navigation.goBack();
          },
          style: 'cancel',
        },
        {
          text: locales.CONFIRM,
          onPress: () => {
            return this.confirmChange(language);
          },
        },
      ]);
    }
  }
  render() {
    const language = this.state.language;
    return (
      <components.PageContainer
        title={locales.LANGUAGE}
        goBack={this.props.navigation.goBack}
        rightIcon={{
          name: icons.CHECK,
          onPress: () => {
            return this.alertChange();
          },
        }}
      >
        <reactNativeSpringScrollview.SpringScrollView
          style={{
            flex: 1,
          }}
        >
          {f.map((n, t) => (
            <components.SongRow
              key={t}
              song={n.name}
              singer={n.code}
              index={t}
              isChecked={n.code === language}
              onPress={() => {
                return this.changeLanguage(n.code);
              }}
            />
          ))}
        </reactNativeSpringScrollview.SpringScrollView>
      </components.PageContainer>
    );
  }
}
export default LanguagePage;
