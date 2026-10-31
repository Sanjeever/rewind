import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import createIconSet from 'react-native-vector-icons/lib/create-icon-set';
import glyphs from '../theme/iconGlyphs';

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
}) {
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
