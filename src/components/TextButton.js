import Text from './Text.js';
import 'react';
import * as ReactNative from 'react-native';
const c = ReactNative.StyleSheet.create({
  textBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    opacity: 0.6,
  },
});
const IComponent = function ({onPress, style, text, textStyle}) {
  return (
    <ReactNative.TouchableOpacity onPress={onPress}>
      <ReactNative.View style={[c.textBtn, style]}>
        <Text style={[c.text, c.textBtnText, textStyle]}>{text}</Text>
      </ReactNative.View>
    </ReactNative.TouchableOpacity>
  );
};
export default IComponent;
