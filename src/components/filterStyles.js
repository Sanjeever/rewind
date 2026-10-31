import Text from './Text';
import 'react';
import * as ReactNative from 'react-native';
import * as filterColors from './filterColors';
const c = ReactNative.StyleSheet.create({
  container: {
    marginHorizontal: 3,
  },
  item: {
    alignItems: 'center',
    color: filterColors.defaultColor,
    textAlignVertical: 'center',
  },
  highlight: {
    color: filterColors.highlightColor,
    fontWeight: 'bold',
  },
});
const HComponent = function ({name, onPress, highlight, textStyle}) {
  return (
    <ReactNative.TouchableOpacity onPress={onPress}>
      <ReactNative.View style={c.container}>
        <Text style={[c.item, highlight && c.highlight, textStyle]}>{name}</Text>
      </ReactNative.View>
    </ReactNative.TouchableOpacity>
  );
};
export default HComponent;
