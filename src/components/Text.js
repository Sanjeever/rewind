import React from 'react';
import {Text as NativeText} from 'react-native';

export default React.forwardRef(function Text({style, ...props}, ref) {
  return <NativeText {...props} ref={ref} style={[{color: '#fff'}, style]} />;
});
