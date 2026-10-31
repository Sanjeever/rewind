import React from 'react';
import {Text as NativeText} from 'react-native';
import type {TextProps} from 'react-native';

export default React.forwardRef<React.ComponentRef<typeof NativeText>, TextProps>(function Text(
  {style, ...props},
  ref,
) {
  return <NativeText {...props} ref={ref} style={[{color: '#fff'}, style]} />;
});
