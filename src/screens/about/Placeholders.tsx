import 'react';
import PulsingPlaceholder from '../../components/PulsingPlaceholder';
import type {TextProps, StyleProp, TextStyle} from 'react-native';
const i = {
  PlaceHolder: function ({style}: {style?: StyleProp<TextStyle>}) {
    return (
      <PulsingPlaceholder
        style={[
          {
            borderRadius: 20,
          },
          style,
        ]}
      />
    );
  },
  Avatar: function ({
    style,
    size,
    radius = size == null ? undefined : size / 2,
  }: {
    style?: StyleProp<TextStyle>;
    size?: number;
    radius?: number;
  }) {
    return (
      <PulsingPlaceholder
        style={[
          {
            width: size,
            height: size,
            borderRadius: radius,
          },
          style,
        ]}
      />
    );
  },
  Text: function ({numbers = 14, ...rest}: TextProps & {numbers?: number}) {
    return (
      <PulsingPlaceholder {...rest} textMode>
        {'■'.repeat(numbers).split('').join(' ')}
      </PulsingPlaceholder>
    );
  },
};
export default i;
