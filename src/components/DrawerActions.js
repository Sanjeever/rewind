import Text from './Text.js';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as components from './index';
import actions from '../screens/home/actions';
import names from '../events/names';
import locales from '../locales/index';
import * as services from '../services/index';
import * as events from '../events/index';
class DrawerActions extends React.PureComponent {
  state = {
    netEaseLogined: true,
  };
  checkNetEaseLogined = async () => {
    try {
      const result = await services.Netease.cloud(1);
      if (result) {
        this.setState({
          netEaseLogined: result.code !== 301,
        });
      }
    } catch (error) {
      toast(error.message);
    }
  };
  sponsor = function () {
    events.emitter.emit(names.SavePicModal, {
      type: 'sponsor',
      song: 'sponsor',
    });
  };
  onPress = (e) => {
    const a_props = this.props;
    const {envelop, about, settings, update, timer, cloud, feature} = a_props;
    switch (e.name) {
      case locales.INBOX:
        envelop();
        break;
      case locales.ABOUT:
        about();
        break;
      case locales.SETTING:
        settings();
        break;
      case locales.UPDATE:
        update();
        break;
      case locales.COUNTDOWN:
        timer();
        break;
      case locales.SPONSOR:
        this.sponsor();
        break;
      case locales.CLOUD_DRIVE:
        cloud();
        break;
      case locales.FEATURE:
        feature();
    }
  };
  componentDidMount() {
    const e = this;
    this.checkNetEaseLogined();
    this.sub = events.emitter.addListener(names.UserLogined, function () {
      setTimeout(() => {
        e.checkNetEaseLogined();
      }, 500);
    });
  }
  componentWillUnmount() {
    this.sub.remove();
  }
  render() {
    const e = this;
    return (
      <ReactNative.View style={b.container}>
        {actions.map((t, n) => {
          if (n < 2 && !e.state.netEaseLogined) {
            return null;
          }
          return (
            <ReactNative.TouchableNativeFeedback
              key={n}
              onPress={function () {
                requestAnimationFrame(() => {
                  e.onPress(t);
                });
              }}
            >
              <ReactNative.View style={b.btn}>
                <components.Icon
                  name={t.icon.name}
                  key={n}
                  size={20}
                  style={{
                    width: 25,
                  }}
                />
                <Text style={b.text}>{t.name}</Text>
              </ReactNative.View>
            </ReactNative.TouchableNativeFeedback>
          );
        })}
      </ReactNative.View>
    );
  }
}
var b = ReactNative.StyleSheet.create({
  container: {
    width: '100%',
    alignSelf: 'flex-start',
    height: '100%',
    paddingLeft: 20,
  },
  btn: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
  },
  text: {
    marginLeft: 10,
    fontSize: 15,
  },
});
export default DrawerActions;
