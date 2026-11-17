import 'react';
import TouchableScale from '../components/TouchableScale';
import {ActivityIndicator} from 'react-native';
import * as components from '../components/index';
import type {IconProps} from '../components/Icon';
export type ControlIconProps = Pick<
  IconProps,
  | 'name'
  | 'size'
  | 'color'
  | 'disabled'
  | 'style'
  | 'onPress'
  | 'onLongPress'
  | 'accessibilityLabel'
> & {type?: string; busy?: boolean};
const SComponent = function (e: ControlIconProps) {
  const {name, size} = e;
  const size_1 = size === undefined ? 28 : size;
  const {color, disabled} = e;
  const disabled_1 = disabled !== undefined && disabled;
  const {style, onPress, onLongPress} = e;
  return (
    <TouchableScale
      activeScale={0.94}
      disabled={disabled_1 || e.busy}
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="button"
      accessibilityLabel={e.accessibilityLabel}
      accessibilityState={{disabled: !!(disabled_1 || e.busy), busy: !!e.busy}}
      style={[
        {
          minHeight: Math.max(48, size_1 + 12),
          minWidth: Math.max(48, size_1 + 12),
          borderRadius: (size_1 + 12) / 2,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0)',
        },
        style,
      ]}
    >
      {e.busy ? (
        <ActivityIndicator color={color || '#fff'} style={{width: size_1, height: size_1}} />
      ) : (
        <components.Icon size={size_1} name={name} color={color} />
      )}
    </TouchableScale>
  );
};
export default SComponent;
