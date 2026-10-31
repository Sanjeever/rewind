import * as React from 'react';
import * as ReactNative from 'react-native';
import * as components from './index';
import type {IconProps} from './Icon';
class IconButton extends React.PureComponent<
  Pick<IconProps, 'name' | 'onPress' | 'size' | 'disabled'>
> {
  render() {
    const props = this.props;
    const {onPress, name, size, disabled} = props;
    return (
      <ReactNative.View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: 80,
          width: 80,
        }}
      >
        <ReactNative.TouchableOpacity onPress={onPress} disabled={disabled}>
          <components.Icon name={name} size={size || 20} />
        </ReactNative.TouchableOpacity>
      </ReactNative.View>
    );
  }
}
export default IconButton;
