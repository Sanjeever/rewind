import Text from './Text';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeAnimatable from 'react-native-animatable';
import * as constants from '../theme/constants';
import icons from '../theme/icons';
import locales from '../locales/index';
import * as components from './index';
import Input from './Input';
import type {IconProps} from './Icon';
type HeaderIcon = Pick<IconProps, 'name' | 'size' | 'color'> & {onPress?: () => void};
export interface HeaderBarProps {
  title?: React.ReactNode;
  bold?: boolean;
  onTop?: () => void;
  fontColor?: ReactNative.ColorValue;
  onSubmitEditing?: ReactNative.TextInputProps['onSubmitEditing'];
  onChangeText?: (text: string) => void;
  searchText?: string;
  forceShowTextInput?: boolean;
  rightIcon?: HeaderIcon | HeaderIcon[] | (() => React.ReactNode);
  opacity?: number | ReactNative.Animated.Value;
  goBack?: () => void;
  blur?: boolean;
  headerBlur?: boolean;
  headerStyle?: ReactNative.StyleProp<ReactNative.ViewStyle>;
  toolStyle?: ReactNative.StyleProp<ReactNative.ViewStyle>;
  textInput?: boolean;
  backIcon?: Pick<IconProps, 'name'>;
  iconColor?: ReactNative.ColorValue;
  disabledTextInputBtn?: boolean;
}
class HeaderBar extends React.PureComponent<HeaderBarProps> {
  state = {
    showTextInput: false,
    hideStatusBar: false,
  };
  titleOrTextInput = () => {
    const showTextInput = this.state.showTextInput;
    const r_props = this.props;
    const {bold, onTop, fontColor, title, onSubmitEditing, onChangeText, searchText} = r_props;
    if (r_props.forceShowTextInput || showTextInput === true) {
      return (
        <reactNativeAnimatable.View
          useNativeDriver={true}
          animation={'fadeIn'}
          style={{
            flex: 1,
            marginBottom: -2,
          }}
        >
          <Input
            autoFocus={true}
            style={b.textInput}
            placeholder={locales.SEARCH}
            onChangeText={function (e) {
              return onChangeText!(e);
            }}
            onSubmitEditing={onSubmitEditing}
            value={searchText}
          />
        </reactNativeAnimatable.View>
      );
    }
    return (
      <ReactNative.TouchableOpacity disabled={!onTop} onPress={this._onTop}>
        <ReactNative.View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <Text
            numberOfLines={1}
            style={[
              b.text,
              {
                paddingLeft: 5,
                paddingRight: 5,
              },
              fontColor
                ? {
                    color: fontColor,
                  }
                : undefined,
              bold && b.bold,
            ]}
          >
            {title}
          </Text>
        </ReactNative.View>
      </ReactNative.TouchableOpacity>
    );
  };
  renderRightIcon = () => {
    const rightIcon = this.props.rightIcon;
    if (rightIcon) {
      if (typeof rightIcon === 'function') {
        return <ReactNative.View style={b.rightIcon}>{rightIcon()}</ReactNative.View>;
      }
      if (Array.isArray(rightIcon)) {
        return (
          <ReactNative.View
            style={[
              {
                right: 10,
                top: ReactNative.StatusBar.currentHeight,
                position: 'absolute',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              },
            ]}
          >
            {rightIcon.map((e, key) =>
              React.createElement(h, {
                key,
                onPress: () => {
                  return this.onRightIcon(e);
                },
                size: e.size,
                name: e.name,
              }),
            )}
          </ReactNative.View>
        );
      }
      return (
        <ReactNative.View style={b.rightIcon}>
          {React.createElement(h, {
            onPress: function () {
              return rightIcon.onPress!();
            },
            size: rightIcon.size,
            name: rightIcon.name,
          })}
        </ReactNative.View>
      );
    }
    return null;
  };
  _onTop = () => {
    this.props.onTop?.();
  };
  onRightIcon = (e: HeaderIcon) => {
    if (e.name === 'magnify') {
      this.switchTextInput();
    } else if (e.onPress) {
      e.onPress();
    }
  };
  textInputBtn = () => {
    return (
      <ReactNative.View style={b.rightIcon}>
        {React.createElement(h, {
          onPress: this.switchTextInput,
          name: icons.MAGNIFY,
        })}
      </ReactNative.View>
    );
  };
  switchTextInput = () => {
    this.setState({
      showTextInput: !this.state.showTextInput,
    });
  };
  render() {
    const props = this.props;
    const {
      opacity,
      goBack,
      blur,
      rightIcon,
      headerStyle,
      toolStyle,
      textInput,
      backIcon,
      iconColor,
      disabledTextInputBtn,
    } = props;
    return (
      <ReactNative.Animated.View
        style={[b.container, b.borderline, ReactNative.StyleSheet.flatten(headerStyle)]}
      >
        {blur && (
          <ReactNative.Animated.View
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity,
              },
              b.borderline,
            ]}
          >
            <components.Background blur={true} />
          </ReactNative.Animated.View>
        )}
        <ReactNative.View
          style={[
            b.tool,
            toolStyle,
            (textInput || rightIcon) && {
              paddingRight: 70,
            },
          ]}
        >
          {React.createElement(h, {
            onPress: goBack,
            name: backIcon?.name || icons.ARROW_LEFT,
            color: iconColor,
          })}
          {this.titleOrTextInput()}
        </ReactNative.View>
        {this.renderRightIcon()}
        {textInput === true && !disabledTextInputBtn && this.textInputBtn()}
      </ReactNative.Animated.View>
    );
  }
}
const h = function ({onPress, name, size}: HeaderIcon) {
  return (
    <components.TouchableBorderless style={b.padding} onPress={onPress}>
      <components.Icon style={b.iconStyle} name={name} size={size} />
    </components.TouchableBorderless>
  );
};
const b = ReactNative.StyleSheet.create({
  container: {
    height: 40 + constants.STATUS_BAR_HEIGHT,
    width: '100%',
  },
  borderline: {
    borderBottomColor: constants.COLORS.primaryAlpha10,
    borderBottomWidth: ReactNative.StyleSheet.hairlineWidth,
  },
  padding: {
    padding: 6,
  },
  tool: {
    position: 'absolute',
    top: ReactNative.StatusBar.currentHeight,
    alignItems: 'center',
    flexDirection: 'row',
    height: 40,
    paddingHorizontal: 10,
    width: '100%',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 5,
  },
  text: {
    fontSize: 16,
  },
  rightIcon: {
    position: 'absolute',
    right: 10,
    top: ReactNative.StatusBar.currentHeight,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  iconStyle: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  bold: {
    fontWeight: 'bold',
  },
});
export default HeaderBar;
