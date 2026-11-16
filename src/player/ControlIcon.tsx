import 'react';
import TouchableScale from '../components/TouchableScale';
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
> & {type?: string};
const SComponent = function (e: ControlIconProps) {
  const {name, size} = e;
  const size_1 = size === undefined ? 28 : size;
  const {color, disabled} = e;
  const disabled_1 = disabled !== undefined && disabled;
  const {style, onPress, onLongPress} = e;
  return (
    <TouchableScale
      activeScale={0.8}
      disabled={disabled_1}
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="button"
      accessibilityLabel={e.accessibilityLabel}
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
      <components.Icon size={size_1} name={name} color={color} />
    </TouchableScale>
  );
};
export default SComponent;
