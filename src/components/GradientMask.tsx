import 'react';
import * as ReactNative from 'react-native';
import ReactNativeLinearGradient from 'react-native-linear-gradient';
export default function ({
  colors,
  from = 'top',
  style,
}: {
  colors?: string[];
  from?: 'top' | 'bottom';
  style?: ReactNative.StyleProp<ReactNative.ViewStyle>;
}) {
  const colors_1 =
    colors ||
    (() => {
      switch (from) {
        case 'top':
          return ['rgba(0,0,0,0.5)', 'rgba(0,0,0,0)'];
        case 'bottom':
          return ['rgba(0,0,0,0)', 'rgba(0,0,0,0.5)'];
      }
    })();
  return (
    <ReactNativeLinearGradient
      colors={colors_1}
      style={[
        {
          position: 'absolute',
          height: 80,
          width: '100%',
        },
        ReactNative.StyleSheet.flatten(style),
      ]}
    />
  );
}
