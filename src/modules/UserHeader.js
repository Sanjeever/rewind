import Text from './../components/Text';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as components from '../components/index';
import * as constants from '../theme/constants';
import icons from '../theme/icons';
import locales from '../locales/index';
import styles from '../screens/users/styles';
class UserHeader extends React.PureComponent {
  render() {
    const props = this.props;
    const {profile, followed, nativeOffset, onHeart} = props;
    const {avatarUrl, nickname, signature, follows, followeds, backgroundUrl} = profile;
    const transform = [
      {
        translateY: nativeOffset.y.interpolate({
          inputRange: [-constants.DEVICE_WIDTH, 0],
          outputRange: [-constants.DEVICE_WIDTH / 2, 0],
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
    ];
    return (
      <ReactNative.View style={d.avatarCon}>
        <ReactNative.Animated.View
          style={[
            ReactNative.StyleSheet.absoluteFill,
            {
              transform,
            },
          ]}
        >
          <ReactNative.Image
            source={{
              uri: backgroundUrl,
            }}
            style={ReactNative.StyleSheet.absoluteFill}
          />
          <ReactNative.View
            style={[
              ReactNative.StyleSheet.absoluteFill,
              {
                backgroundColor: 'rgba(0,0,0,0.5)',
              },
            ]}
          />
        </ReactNative.Animated.View>
        {React.createElement(styles, {
          imgUrl: avatarUrl,
          nativeOffset,
        })}
        <ReactNative.Animated.View
          style={{
            opacity: nativeOffset.y.interpolate({
              inputRange: [-constants.DEVICE_WIDTH / 2, 0],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            }),
          }}
        >
          {nickname ? (
            <ReactNative.TouchableOpacity onPress={onHeart}>
              <ReactNative.View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 15,
                }}
              >
                <Text style={[d.text, d.title]}>{nickname}</Text>
                <components.Icon
                  iconStyle={{
                    marginLeft: 5,
                  }}
                  size={16}
                  name={followed === true ? icons.HEART : icons.HEART_OUTLINE}
                />
              </ReactNative.View>
            </ReactNative.TouchableOpacity>
          ) : null}
          {signature ? (
            <Text numberOfLines={2} style={[d.text]}>
              {signature}
            </Text>
          ) : null}
          <ReactNative.View
            style={{
              marginTop: 15,
              alignItems: 'center',
              opcity: 0.7,
            }}
          >
            {follows ? (
              <Text style={[d.text]}>
                {locales.FOLLOWS} {follows}
              </Text>
            ) : null}
            {followeds ? (
              <Text style={[d.text]}>
                {locales.FOLLOWER} {followeds}
              </Text>
            ) : null}
          </ReactNative.View>
        </ReactNative.Animated.View>
      </ReactNative.View>
    );
  }
}
export default UserHeader;
var d = ReactNative.StyleSheet.create({
  text: {
    textAlign: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  avatarCon: {
    height: constants.DEVICE_WIDTH,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});
