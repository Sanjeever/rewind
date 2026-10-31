import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import createIconSet from 'react-native-vector-icons/lib/create-icon-set';
import glyphs from '../theme/iconGlyphs';
import type {
  ColorValue,
  StyleProp,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';

export interface IconProps extends Omit<TouchableOpacityProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  name: string;
  size?: number;
  color?: ColorValue;
  iconStyle?: StyleProp<TextStyle>;
  component?: React.ComponentType<TouchableOpacityProps>;
  underlayColor?: ColorValue;
  reverse?: boolean;
  raised?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  reverseColor?: ColorValue;
}

const Glyph = createIconSet(glyphs, 'Material Design Icons', 'MaterialCommunityIcons.ttf');
export default function Icon({
  name,
  size = 24,
  color = '#fff',
  iconStyle,
  component,
  underlayColor: _underlayColor,
  reverse = false,
  raised = false,
  containerStyle,
  style,
  reverseColor = '#fff',
  onPress,
  ...props
}: IconProps) {
  const Container = component || (onPress ? TouchableOpacity : View);
  return (
    <Container
      {...props}
      onPress={onPress}
      style={[
        (reverse || raised) && {borderRadius: size + 4, height: size * 2 + 4, width: size * 2 + 4},
        raised && {elevation: 2},
        {
          backgroundColor: reverse ? color : raised ? '#fff' : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        },
        containerStyle,
        style,
      ]}
    >
      <Glyph
        name={name}
        size={size}
        color={reverse ? reverseColor : color}
        style={[{backgroundColor: 'transparent'}, iconStyle]}
      />
    </Container>
  );
}
