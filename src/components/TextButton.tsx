import Text from './Text';
import 'react';
import * as ReactNative from 'react-native';
import type {GestureResponderEvent, StyleProp, TextStyle, ViewStyle} from 'react-native';
interface Props {
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  text?: React.ReactNode;
  textStyle?: StyleProp<TextStyle>;
}
const c = ReactNative.StyleSheet.create({
  textBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    opacity: 0.6,
  },
});
const TextButton = function ({onPress, style, text, textStyle}: Props) {
  return (
    <ReactNative.TouchableOpacity onPress={onPress}>
      <ReactNative.View style={[c.textBtn, style]}>
        <Text style={[c.text, textStyle]}>{text}</Text>
      </ReactNative.View>
    </ReactNative.TouchableOpacity>
  );
};
export default TextButton;
