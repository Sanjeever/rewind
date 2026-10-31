import {toast} from '../native/toast';
import _default from '@react-native-clipboard/clipboard';
import _default2 from './../components/Text';
import lottieReactNative from 'lottie-react-native';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as Scrolling from './../components/Scrolling.js';
import TouchableScale from '../components/TouchableScale';
import * as Index from '../components/index';
import Placeholders from './about/Placeholders';
import icons from '../theme/icons';
import locales from '../locales/index';
import * as endpoints from '../services/endpoints';
import * as infoModule from '../native/info';
import linkData from './about/linkData';
import CreditsSection from './about/CreditsSection';
import LinkList from './about/LinkList';
import styles from './about/styles';
import _loading from '../../assets/animations/loading';
class About extends React.PureComponent {
  ICON_SIZE = 27;
  state = {
    speed: 1,
    ended: false,
  };
  linking = function (e) {
    ReactNative.Linking.openURL(e);
  };
  onHelp = () => {
    return this.props.navigation.navigate('Tip');
  };
  goBack = () => {
    return this.props.navigation.goBack();
  };
  onTop = () => {
    return this._scrollView.scrollToBegin?.();
  };
  onClip = function (e) {
    toast(`${locales.COPIED} ${e}`);
    _default.setString(e);
  };
  onThanks = () => {
    return this.props.navigation.navigate('Tip', {
      url: `${endpoints.HOST_PAGE}/thanks`,
    });
  };
  onSpeedUp = () => {
    let speed = this.state.speed + 1;
    let ended = this.state.ended;
    if (speed % 5 == 0) {
      toast(`${speed}x……`);
    }
    if (speed >= 100) {
      speed = 1;
      ended = false;
    } else if (speed >= 50) {
      ended = true;
    }
    this.setState({
      speed,
      ended,
    });
  };
  renderAll = () => {
    return (
      <React.Fragment>
        {React.createElement(
          _default2,
          {
            style: [
              styles.text,
              {
                marginBottom: 10,
              },
            ],
          },
          '\t\t',
          '本应用只在相关群组/频道发布更新，其他地方下载的无法保证可用性。',
        )}
        {linkData.sites.map((e, key) => (
          <CreditsSection
            key={key}
            onPress={() => {
              return this.linking(e.url);
            }}
            renderAvatar={() => {
              return <Index.Icon name={e.icon} size={this.ICON_SIZE} style={styles.avatar} />;
            }}
            title={e.name}
            subtitle={e.url}
          />
        ))}
        <Index.Title style={[styles.title]}>{'相关的人'}</Index.Title>
        {this.renderPersons()}
        <Index.Title style={[styles.title]}>{'开源库'}</Index.Title>
        <CreditsSection
          onPress={this.onThanks}
          renderAvatar={() => {
            return (
              <Index.Icon name={icons.HEART_OUTLINE} size={this.ICON_SIZE} style={styles.avatar} />
            );
          }}
          title={'点击查看'}
          subtitle={`${endpoints.HOST_PAGE}/thanks`}
        />
        <Index.EmptyFooter />
      </React.Fragment>
    );
  };
  renderPersons = () => {
    return linkData.persons.map((e, t) => {
      const subtitle = linkData.qqs[t];
      const uri = linkData.qqAvatarUrl.replace('%qq', subtitle);
      return (
        <CreditsSection
          key={t}
          onPress={() => {
            return this.onClip(subtitle);
          }}
          renderAvatar={function () {
            return (
              <ReactNative.View style={[styles.avatar]}>
                <ReactNative.Image
                  style={[
                    styles.borderLine,
                    {
                      height: 55,
                      width: 55,
                      borderRadius: 27.5,
                    },
                  ]}
                  source={{
                    uri,
                  }}
                />
              </ReactNative.View>
            );
          }}
          title={e.name}
          subtitle={subtitle}
        />
      );
    });
  };
  render() {
    const e = this;
    const state = this.state;
    const {ended, speed} = state;
    return (
      <Index.PageContainer
        title={ended ? '■ ■ ■' : locales.ABOUT}
        goBack={this.goBack}
        onTop={this.onTop}
        rightIcon={{
          name: icons.HELP_CIRCLE_OUTLINE,
          onPress: this.onHelp,
        }}
        blur={true}
      >
        <Scrolling.SpringScrollView
          ref={function (t) {
            return (e._scrollView = t);
          }}
          style={{
            padding: 15,
          }}
        >
          <ReactNative.View style={styles.lottieContainer}>
            <TouchableScale onPress={this.onSpeedUp}>
              <lottieReactNative
                source={_loading}
                loop={true}
                autoPlay={true}
                style={styles.lottieView}
                speed={speed}
              />
            </TouchableScale>
            {ended ? (
              <Placeholders.Text style={[styles.text, styles.version]} numbers={3} />
            ) : (
              React.createElement(
                _default2,
                {
                  style: [styles.text, styles.version],
                },
                infoModule.versionName,
              )
            )}
          </ReactNative.View>
          {ended ? <LinkList info={linkData} /> : this.renderAll()}
        </Scrolling.SpringScrollView>
      </Index.PageContainer>
    );
  }
}
export default About;
