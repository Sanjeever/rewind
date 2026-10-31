import 'react';
import PulsingPlaceholder from '../../components/PulsingPlaceholder';
const i = {
  PlaceHolder: function ({style}) {
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
  Avatar: function ({style, size, radius = size / 2}) {
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
  Text: function ({numbers = 14, ...rest}) {
    return (
      <PulsingPlaceholder {...rest} textMode>
        {'■'.repeat(numbers).split('').join(' ')}
      </PulsingPlaceholder>
    );
  },
};
export default i;
