import * as React from 'react';
import * as reactNativeSpringScrollview from './../components/Scrolling.js';
import * as components from '../components/index';
import locales from '../locales/index';
import audioPlayer from '../native/audioPlayer';
import languageModule from '../native/language';
class FeaturePage extends React.PureComponent {
  onPage = (e) => {
    this.props.navigation.navigate(e);
  };
  render() {
    const e = this;
    const t = [
      {
        title: locales.LANGUAGE,
        subtitle: languageModule.language,
        page: 'LanguagePage',
      },
      {
        title: locales.BACKGROUND,
        subtitle: locales.BACKGROUND_SUB,
        page: 'Skin',
      },
      {
        title: locales.ORDER,
        subtitle: locales.ORDER_SUB,
        page: 'OrderPage',
      },
      {
        title: locales.CACHE,
        subtitle: '/Android/data/com.kuss.rewind/cache/audio-cache',
        page: 'CachePage',
      },
      {
        title: locales.MUSIC_NOTIFICATION,
        subtitle: locales.MUSIC_NOTIFICATION_SUB,
        page: 'MusicNotificationPage',
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
        goBack={function () {
          return e.props.navigation.goBack();
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
              onPress={
                t.onPress
                  ? t.onPress
                  : function () {
                      return e.onPage(t.page);
                    }
              }
            />
          ))}
        </reactNativeSpringScrollview.SpringScrollView>
      </components.PageContainer>
    );
  }
}
export default FeaturePage;
