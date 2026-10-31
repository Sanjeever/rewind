import 'react';
import * as components from '../../components/index';
import type {IconProps} from '../../components/Icon';
const IComponent = function ({
  icon,
  onPress,
}: {
  icon: Pick<IconProps, 'name' | 'color'>;
  onPress(): void;
}) {
  return (
    <components.TouchableBorderless
      onPress={onPress}
      style={{
        padding: 8,
      }}
      size={50}
    >
      <components.Icon
        name={icon.name}
        color={icon.color}
        size={25}
        style={{
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}
      />
    </components.TouchableBorderless>
  );
};
export default IComponent;
