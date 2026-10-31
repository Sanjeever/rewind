import 'react';
import * as ReactNative from 'react-native';
import TouchableScale from '../components/TouchableScale';
import * as components from '../components/index';
const SComponent = function (e) {
  const {name, size} = e;
  const size_1 = size === undefined ? 28 : size;
  const {color, disabled} = e;
  const disabled_1 = disabled !== undefined && disabled;
  const {style, onPress, onLongPress} = e;
  return (
    <ReactNative.View
      style={[
        {
          height: size_1 + 12,
          width: size_1 + 12,
          borderRadius: (size_1 + 12) / 2,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0)',
        },
        style,
      ]}
    >
      <TouchableScale
        activeScale={0.8}
        disabled={disabled_1}
        onPress={onPress}
        onLongPress={onLongPress}
      >
        <components.Icon size={size_1} name={name} color={color} />
      </TouchableScale>
    </ReactNative.View>
  );
};
export default SComponent;
