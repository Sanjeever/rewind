import React from 'react';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import type {StyleProp, ViewStyle} from 'react-native';
type Props = React.PropsWithChildren<{top?: number; bottom?: number; style?: StyleProp<ViewStyle>}>;

export default function FadingEdge({top = 0, bottom = 0, children, style}: Props) {
  return (
    <View style={[{flex: 1}, style]}>
      {children}
      {top > 0 && (
        <LinearGradient
          pointerEvents="none"
          colors={['#000', '#00000000']}
          style={{position: 'absolute', top: 0, left: 0, right: 0, height: top}}
        />
      )}
      {bottom > 0 && (
        <LinearGradient
          pointerEvents="none"
          colors={['#00000000', '#000']}
          style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: bottom}}
        />
      )}
    </View>
  );
}
