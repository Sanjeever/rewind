import Text from './Text';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeAnimatable from 'react-native-animatable';
import * as constants from '../theme/constants';
import icons from '../theme/icons';
import * as components from './index';
interface Props {
  img?: string | null;
  subtitle?: string | string[] | null;
  title?: string;
  animOffsetY: ReactNative.Animated.Value;
  alias?: string;
  onInfo?: () => void;
}
class ParallaxForeground extends React.PureComponent<Props> {
  renderBottomMask = () => {
    const animOffsetY = this.props.animOffsetY;
    return (
      <ReactNative.Animated.View
        style={{
          position: 'absolute',
          width: '100%',
          height: 150,
          bottom: 0,
          opacity: animOffsetY.interpolate({
            inputRange: [-50, 0],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          }),
        }}
      >
        <components.GradientMask
          from={'bottom'}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </ReactNative.Animated.View>
    );
  };
  render() {
    const props = this.props;
    const {img, subtitle, title, animOffsetY, alias, onInfo} = props;
    const g = constants.STATUS_BAR_HEIGHT + 40;
    const m = typeof subtitle === 'string' ? [subtitle] : subtitle;
    const transform = [
      {
        translateY: animOffsetY.interpolate({
          inputRange: [-constants.DEVICE_WIDTH, 0],
          outputRange: [-constants.DEVICE_WIDTH / 2, 0],
          extrapolate: 'clamp',
        }),
      },
      {
        scale: animOffsetY.interpolate({
          inputRange: [-constants.DEVICE_WIDTH, 0],
          outputRange: [2, 1],
          extrapolate: 'clamp',
        }),
      },
    ];
    return (
      <ReactNative.Animated.View
        style={[
          f.foreground,
          {
            opacity: animOffsetY.interpolate({
              inputRange: [100, constants.DEVICE_WIDTH - g - 30],
              outputRange: [1, 0],
              extrapolate: 'clamp',
            }),
          },
        ]}
      >
        {typeof img === 'string' && img ? (
          <reactNativeAnimatable.Image
            animation={'fadeIn'}
            useNativeDriver={true}
            source={{
              uri: img,
            }}
            style={[
              f.foregroundImg,
              {
                transform,
              },
            ]}
          />
        ) : (
          <ReactNative.View style={[f.foregroundImg, f.foregroundIconCon]}>
            <components.Icon name={icons.ACCOUNT_MUSIC} size={70} />
          </ReactNative.View>
        )}
        {this.renderBottomMask()}
        <ReactNative.Animated.View
          style={[
            f.textCon,
            {
              opacity: animOffsetY.interpolate({
                inputRange: [-constants.DEVICE_WIDTH / 3, 0],
                outputRange: [0, 1],
                extrapolate: 'clamp',
              }),
            },
          ]}
        >
          <components.Selectable style={[f.bold]}>
            {title}
            {Boolean(alias) && (
              <Text style={f.alias}>
                {' / '}
                {alias}
              </Text>
            )}
          </components.Selectable>
          {m &&
            m.length > 0 &&
            m.map(
              (e, key) =>
                typeof e === 'string' && (
                  <Text key={key} style={f.subtitle}>
                    {e}
                  </Text>
                ),
            )}
          {Boolean(onInfo) && (
            <components.Icon name={icons.INFORMATION_OUTLINE} style={f.info} onPress={onInfo} />
          )}
        </ReactNative.Animated.View>
      </ReactNative.Animated.View>
    );
  }
}
export default ParallaxForeground;
const f = ReactNative.StyleSheet.create({
  foreground: {
    height: constants.DEVICE_WIDTH,
    width: '100%',
    justifyContent: 'center',
  },
  foregroundImg: {
    width: '100%',
    height: '100%',
  },
  foregroundIconCon: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 21,
  },
  textCon: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
  },
  alias: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  subtitle: {
    opacity: 0.7,
  },
  info: {
    position: 'absolute',
    alignSelf: 'center',
    right: 20,
  },
});
