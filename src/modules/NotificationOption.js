import 'react';
import * as ReactNative from 'react-native';
import * as components from '../components/index';
const CComponent = function ({name, switched, onSwitch}) {
  return (
    <ReactNative.TouchableNativeFeedback onPress={onSwitch}>
      <ReactNative.View
        style={{
          flex: 1,
          height: 60,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 12,
        }}
      >
        <components.Title>{name}</components.Title>
        <components.Switch value={switched} onValueChange={onSwitch} />
      </ReactNative.View>
    </ReactNative.TouchableNativeFeedback>
  );
};
export default CComponent;
