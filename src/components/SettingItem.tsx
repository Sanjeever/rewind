import Text from './Text';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as components from './index';
import icons from '../theme/icons';
interface Props {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  onPress?: () => void;
  onLongPress?: ReactNative.TouchableNativeFeedbackProps['onLongPress'];
  coverImg?: string;
  coverImgStyle?: ReactNative.StyleProp<ReactNative.ImageStyle>;
  containerStyle?: ReactNative.StyleProp<ReactNative.ViewStyle>;
  rounded?: boolean;
  titleStyle?: ReactNative.StyleProp<ReactNative.TextStyle>;
  textStyle?: ReactNative.StyleProp<ReactNative.TextStyle>;
  numberOfLines?: number;
  textConStyle?: ReactNative.StyleProp<ReactNative.ViewStyle>;
  switchButton?: boolean;
  switched?: boolean;
  onSwitch?: (value?: boolean) => void;
  showChevron?: boolean;
}
class SettingItem extends React.PureComponent<Props> {
  handleOnPress = () => {
    requestAnimationFrame(() => {
      this.props.onPress?.();
      this.props.onSwitch?.();
    });
  };
  render() {
    const props = this.props;
    const {
      title,
      subtitle,
      onLongPress,
      coverImg,
      coverImgStyle,
      containerStyle,
      rounded,
      titleStyle,
      textStyle,
      numberOfLines,
      textConStyle,
      switchButton,
      switched,
      onSwitch,
      showChevron,
    } = props;
    return (
      <ReactNative.TouchableNativeFeedback onPress={this.handleOnPress} onLongPress={onLongPress}>
        <ReactNative.View style={[c.container, containerStyle]}>
          {coverImg && (
            <ReactNative.Image
              source={{
                uri: coverImg,
              }}
              style={[c.coverImg, rounded && c.rounded, coverImgStyle]}
            />
          )}
          <ReactNative.View
            style={[
              {
                paddingLeft: 10,
                flex: 1,
              },
              textConStyle,
            ]}
          >
            <Text numberOfLines={numberOfLines || 1} style={[c.text, titleStyle, textStyle]}>
              {title}
            </Text>
            {subtitle ? (
              <Text numberOfLines={1} style={[c.text, c.subtitle, textStyle]}>
                {subtitle}
              </Text>
            ) : null}
          </ReactNative.View>
          {switchButton && <components.Switch value={switched} onValueChange={onSwitch} />}
          {showChevron && (
            <components.Icon
              name={icons.CHEVRON_RIGHT}
              style={{
                marginRight: 10,
              }}
            />
          )}
        </ReactNative.View>
      </ReactNative.TouchableNativeFeedback>
    );
  }
}
const c = ReactNative.StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
  },
  subtitle: {
    opacity: 0.5,
    fontSize: 12,
  },
  coverImg: {
    width: 50,
    height: 50,
    marginLeft: 5,
    borderRadius: 3,
  },
  rounded: {
    borderRadius: 25,
  },
});
export default SettingItem;
