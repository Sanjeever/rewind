import {toast} from '../../native/toast';
import Text from '../../components/Text';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as components from '../../components/index';
import actions from './actions';
import names from '../../events/names';
import locales from '../../locales/index';
import * as services from '../../services/index';
import * as events from '../../events/index';
import type {Subscription} from '../../events/Emitter';
import {errorMessage} from '../../utils/types';
interface Props {
  envelop(): void;
  about(): void;
  settings(): void;
  update(): void;
  timer(): void;
  cloud(): void;
  feature(): void;
}
class DrawerActions extends React.PureComponent<Props, {netEaseLogined: boolean}> {
  sub!: Subscription;
  mounted = false;
  refreshTimer?: ReturnType<typeof setTimeout>;
  state = {
    netEaseLogined: true,
  };
  checkNetEaseLogined = async () => {
    try {
      const result = await services.Netease.cloud(1);
      if (result && this.mounted) {
        this.setState({
          netEaseLogined: result.code !== 301,
        });
      }
    } catch (error) {
      if (this.mounted) toast(errorMessage(error));
    }
  };
  sponsor = function () {
    events.emitter.emit(names.SavePicModal, {
      type: 'sponsor',
      song: 'sponsor',
    });
  };
  onPress = (e: (typeof actions)[number]) => {
    const props = this.props;
    const {envelop, about, settings, update, timer, cloud, feature} = props;
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
    this.mounted = true;
    this.checkNetEaseLogined();
    this.sub = events.emitter.addListener(names.UserLogined, () => {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = setTimeout(() => {
        this.checkNetEaseLogined();
      }, 500);
    });
  }
  componentWillUnmount() {
    this.mounted = false;
    clearTimeout(this.refreshTimer);
    this.sub.remove();
  }
  render() {
    return (
      <ReactNative.View style={b.container}>
        {actions.map((t, n) => {
          if (n < 2 && !this.state.netEaseLogined) {
            return null;
          }
          return (
            <ReactNative.TouchableNativeFeedback
              key={n}
              onPress={() => {
                requestAnimationFrame(() => {
                  this.onPress(t);
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
const b = ReactNative.StyleSheet.create({
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
