import 'react';
import * as components from '../../components/index';
import {View} from 'react-native';
import Text from '../../components/Text';
import type {IconProps} from '../../components/Icon';
const IComponent = function ({
  icon,
  title,
  onPress,
}: {
  icon: Pick<IconProps, 'name' | 'color'>;
  title: string;
  onPress(): void;
}) {
  return (
    <components.TouchableBorderless
      onPress={onPress}
      accessibilityLabel={title}
      style={{
        width: 80,
        height: 64,
      }}
      size={50}
    >
      <View style={{alignItems: 'center', gap: 6}}>
        <components.Icon name={icon.name} color={icon.color} size={23} />
        <Text style={{fontSize: 12}}>{title}</Text>
      </View>
    </components.TouchableBorderless>
  );
};
export default IComponent;
