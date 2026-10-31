import * as React from 'react';
import * as reactNativeSpringScrollview from './../components/Scrolling';
import * as components from '../components/index';
import locales from '../locales/index';
import audioPlayer from '../native/audioPlayer';
import languageModule from '../native/language';
import type {ScreenProps} from '../navigation/types';
class FeaturePage extends React.PureComponent<ScreenProps<'FeaturePage'>> {
  render() {
    const t = [
      {
        title: locales.LANGUAGE,
        subtitle: languageModule.language,
        onPress: () => this.props.navigation.navigate('LanguagePage'),
      },
      {
        title: locales.BACKGROUND,
        subtitle: locales.BACKGROUND_SUB,
        onPress: () => this.props.navigation.navigate('Skin'),
      },
      {
        title: locales.ORDER,
        subtitle: locales.ORDER_SUB,
        onPress: () => this.props.navigation.navigate('OrderPage'),
      },
      {
        title: locales.CACHE,
        subtitle: '/Android/data/com.kuss.rewind/cache/audio-cache',
        onPress: () => this.props.navigation.navigate('CachePage'),
      },
      {
        title: locales.MUSIC_NOTIFICATION,
        subtitle: locales.MUSIC_NOTIFICATION_SUB,
        onPress: () => this.props.navigation.navigate('MusicNotificationPage'),
      },
      {
        title: locales.EQUALIZER,
        subtitle: locales.EQUALIZER_SUB,
        onPress: function () {
          return audioPlayer.openEqualizer();
        },
      },
    ];
    return (
      <components.PageContainer
        title={locales.FEATURE}
        goBack={() => {
          return this.props.navigation.goBack();
        }}
      >
        <reactNativeSpringScrollview.SpringScrollView
          style={{
            padding: 10,
            paddingHorizontal: 15,
          }}
        >
          {t.map((t, key) => (
            <components.SettingItem
              key={key}
              title={t.title}
              subtitle={t.subtitle}
              onPress={t.onPress}
            />
          ))}
        </reactNativeSpringScrollview.SpringScrollView>
      </components.PageContainer>
    );
  }
}
export default FeaturePage;
