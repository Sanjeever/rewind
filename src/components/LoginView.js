import Text from './Text';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeAnimatable from 'react-native-animatable';
import * as components from './index';
import providers from '../services/providers';
import * as constants from '../theme/constants';
import icons from '../theme/icons';
import locales from '../locales/index';
const p = 0.05 * constants.DEVICE_HEIGHT;
class LoginView extends React.PureComponent {
  renderQQMusic = () => {
    const r_props = this.props;
    const {_Login, onChangeText, onWebview} = r_props;
    return (
      <ReactNative.View style={y.container}>
        <ReactNative.View style={y.inputCon}>
          <components.Input
            style={[
              {
                fontSize: 18,
              },
              y.inputText,
            ]}
            placeholder={locales.INPUT_QQ_FETCH_PUBLIC_MIX}
            onChangeText={function (e) {
              return onChangeText(e);
            }}
            keyboardType={'numeric'}
          />
        </ReactNative.View>
        <components.TextButton
          onPress={_Login}
          style={y.btnCon}
          text={locales.CONFIRM}
          textStyle={{
            opacity: 1,
          }}
        />
        <ReactNative.View
          style={[
            y.other,
            {
              width: '40%',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
            },
          ]}
        >
          <components.Icon
            style={y.textBtn}
            name={icons.QQCHAT}
            size={30}
            onPress={function () {
              return onWebview('qqmusic_qq');
            }}
          />
          <components.Icon
            style={y.textBtn}
            name={icons.WECHAT}
            size={30}
            onPress={function () {
              return onWebview('qqmusic_wechat');
            }}
          />
        </ReactNative.View>
      </ReactNative.View>
    );
  };
  renderNetease = () => {
    const r_props = this.props;
    const {_Login, otherWay, onChangeText, loginOut, onWebview} = r_props;
    return (
      <ReactNative.View style={y.container}>
        <ReactNative.View style={y.inputCon}>
          <components.Input
            style={[
              {
                fontSize: 18,
              },
              y.inputText,
            ]}
            placeholder={locales.EMAIL_OR_PHONE}
            onChangeText={function (e) {
              return onChangeText(e, 'account');
            }}
          />
        </ReactNative.View>
        <ReactNative.View style={y.inputCon}>
          <components.Input
            style={[
              {
                fontSize: 18,
              },
              y.inputText,
            ]}
            underlineColorAndroid={0}
            placeholder={locales.PASSWORD}
            onChangeText={function (e) {
              return onChangeText(e, 'password');
            }}
            secureTextEntry={true}
          />
        </ReactNative.View>
        <components.TextButton
          onPress={_Login}
          style={[y.btnCon, y.textBtn]}
          text={locales.LOG_IN}
          textStyle={{
            opacity: 1,
          }}
        />
        <components.TextButton
          onPress={otherWay}
          text={locales.FETCH_PLAYLIST}
          style={{
            marginTop: 20,
          }}
        />
        <components.TextButton
          onPress={loginOut}
          text={locales.LOG_OUT}
          style={{
            marginTop: 15,
          }}
        />
        <ReactNative.View
          style={[
            y.other,
            {
              width: '40%',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: 'row',
            },
          ]}
        >
          <components.Icon
            style={[
              y.textBtn,
              {
                marginTop: 0,
              },
            ]}
            name={icons.QQCHAT}
            size={30}
            onPress={function () {
              return onWebview('netease_qq');
            }}
          />
          <components.Icon
            style={[
              y.textBtn,
              {
                marginTop: 0,
              },
            ]}
            name={icons.SINA_WEIBO}
            size={30}
            onPress={function () {
              return onWebview('netease_weibo');
            }}
          />
        </ReactNative.View>
      </ReactNative.View>
    );
  };
  render() {
    const props = this.props;
    const {avatar, nickname, api} = props;
    return (
      <reactNativeAnimatable.View
        animation={'fadeIn'}
        useNativeDriver={true}
        style={{
          flex: 1,
          paddingTop: 60,
          alignItems: 'center',
        }}
      >
        <ReactNative.TouchableOpacity onPress={this.props.onUserManager}>
          <ReactNative.View style={y.avatarView}>
            {avatar ? (
              <ReactNative.Image
                source={{
                  uri: avatar,
                }}
                style={y.avatar}
              />
            ) : (
              <components.Icon name={icons.ACCOUNT} size={50} />
            )}
            <Text
              style={[
                {
                  fontSize: 18,
                  marginTop: 10,
                },
              ]}
            >
              {nickname}
            </Text>
          </ReactNative.View>
        </ReactNative.TouchableOpacity>
        {api === providers.netEase ? this.renderNetease() : this.renderQQMusic()}
      </reactNativeAnimatable.View>
    );
  }
}
export default LoginView;
var y = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  avatarView: {
    marginBottom: p,
    marginTop: p,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  other: {
    marginTop: p,
  },
  inputCon: {
    marginLeft: 15,
    marginRight: 15,
    justifyContent: 'center',
    marginBottom: 10,
  },
  inputText: {
    textAlign: 'center',
    width: constants.DEVICE_WIDTH,
    height: 46,
  },
  btnCon: {
    width: 200,
    marginTop: 0.5 * p,
    borderRadius: 50,
    backgroundColor: 0,
    borderWidth: 1,
    borderColor: constants.COLORS.primary,
    padding: 10,
  },
  textBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});
