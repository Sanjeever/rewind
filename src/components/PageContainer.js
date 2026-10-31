import 'react';
import * as ReactNative from 'react-native';
import Background from './Background';
import HeaderBar from './HeaderBar';
const FComponent = function ({style, children, blur, headerBlur, ...rest}) {
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
