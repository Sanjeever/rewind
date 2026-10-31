import Text from './Text';
import 'react';
import * as ReactNative from 'react-native';
const UComponent = function ({children, style}) {
  return (
    <Text
      style={[
        {
          fontSize: 16,
          fontWeight: 'bold',
        },
        ReactNative.StyleSheet.flatten(style),
      ]}
    >
      {children}
    </Text>
  );
};
export default UComponent;
