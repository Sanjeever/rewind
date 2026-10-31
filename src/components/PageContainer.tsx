import 'react';
import * as ReactNative from 'react-native';
import Background from './Background';
import HeaderBar from './HeaderBar';
import type {HeaderBarProps} from './HeaderBar';
type Props = React.PropsWithChildren<
  HeaderBarProps & {style?: ReactNative.StyleProp<ReactNative.ViewStyle>}
>;
const FComponent = function ({style, children, blur, headerBlur, ...rest}: Props) {
  return (
    <ReactNative.View
      style={[
        {
          flex: 1,
        },
        ReactNative.StyleSheet.flatten(style),
      ]}
    >
      <Background blur={blur} />
      <HeaderBar headerBlur={headerBlur} {...rest} />
      {children}
    </ReactNative.View>
  );
};
export default FComponent;
