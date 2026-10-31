import {toast} from '../native/toast';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as components from './index';
import * as constants from '../theme/constants';
import names from '../events/names';
import icons from '../theme/icons';
import * as events from '../events/index';
import '../utils/types';
import users from '../storage/users';
import type {Subscription} from '../events/Emitter';
interface Profile {
  avatarUrl: string;
  nickname?: string;
  page: 'NeteaseLogin' | 'QQMusicLogin';
}
class ProfileHeader extends React.PureComponent<
  {
    onNavigate(route: 'NeteaseLogin' | 'QQMusicLogin' | 'InitialLogin'): void;
    nativeOffset: {y: ReactNative.Animated.Value};
  },
  {data: Profile[]}
> {
  sub!: Subscription;
  state: {data: Profile[]} = {
    data: [],
  };
  getUserInfo = async () => {
    const accounts = await users.getUserInfo();
    const data: Profile[] = [];
    if (typeof accounts?.netEase?.avatarUrl === 'string') {
      data.push({
        avatarUrl: `${accounts.netEase.avatarUrl}?param=200y200`,
        nickname: accounts.netEase.nickname,
        page: 'NeteaseLogin',
      });
    }
    if (typeof accounts?.qqMusic?.avatarUrl === 'string') {
      data.push({
        avatarUrl: accounts.qqMusic.avatarUrl,
        nickname: accounts.qqMusic.nickname,
        page: 'QQMusicLogin',
      });
    }
    this.setState({
      data,
    });
  };
  easterEgg = function (e?: string) {
    toast(`你好啊，${e}`);
  };
  renderAvatars = () => {
    const n_props = this.props;
    const {onNavigate, nativeOffset} = n_props;
    return this.state.data.map((e, r) => {
      if (e) {
        return (
          <ReactNative.TouchableNativeFeedback
            key={r}
            onPress={function () {
              return onNavigate(e.page);
            }}
            onLongPress={() => {
              return this.easterEgg(e.nickname);
            }}
          >
            <ReactNative.View style={m.con}>
              {e.avatarUrl && (
                <ReactNative.Animated.Image
                  style={[
                    m.avatar,
                    {
                      transform: [
                        {
                          translateY: nativeOffset.y.interpolate({
                            inputRange: [-constants.DEVICE_WIDTH, 0],
                            outputRange: [-constants.DEVICE_WIDTH / 2 + 100 * r, 0],
                            extrapolate: 'clamp',
                          }),
                        },
                        {
                          translateX: nativeOffset.y.interpolate({
                            inputRange: [-constants.DEVICE_WIDTH, 0],
                            outputRange: [0.35 * constants.DEVICE_WIDTH - 30, 0],
                            extrapolate: 'clamp',
                          }),
                        },
                        {
                          scale: nativeOffset.y.interpolate({
                            inputRange: [-constants.DEVICE_WIDTH, 0],
                            outputRange: [2, 1],
                            extrapolate: 'clamp',
                          }),
                        },
                      ],
                    },
                  ]}
                  source={{
                    uri: e.avatarUrl,
                  }}
                />
              )}
              {Boolean(e.nickname) && (
                <ReactNative.Animated.Text
                  style={[
                    m.nickname,
                    {
                      opacity: nativeOffset.y.interpolate({
                        inputRange: [-60, 0],
                        outputRange: [0, 1],
                        extrapolate: 'clamp',
                      }),
                    },
                  ]}
                >
                  {e.nickname}
                </ReactNative.Animated.Text>
              )}
            </ReactNative.View>
          </ReactNative.TouchableNativeFeedback>
        );
      }
    });
  };
  componentDidMount() {
    this.getUserInfo();
    this.sub = events.emitter.addListener(names.UserLogined, () => {
      setTimeout(() => {
        this.getUserInfo();
      }, 500);
    });
  }
  componentWillUnmount() {
    this.sub.remove?.();
  }
  render() {
    const onNavigate = this.props.onNavigate;
    const data = this.state.data;
    return (
      <ReactNative.Animated.View style={m.container}>
        {data.length > 0 ? (
          this.renderAvatars()
        ) : (
          <ReactNative.View style={m.con}>
            <components.Icon
              name={icons.ACCOUNT}
              size={40}
              onPress={function () {
                return onNavigate('InitialLogin');
              }}
              style={{
                marginLeft: 10,
              }}
            />
          </ReactNative.View>
        )}
      </ReactNative.Animated.View>
    );
  }
}
const m = ReactNative.StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 50,
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  con: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  nickname: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});
export default ProfileHeader;
