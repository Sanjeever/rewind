import * as React from 'react';
import * as ReactNative from 'react-native';
import * as components from './index';
import type {IconProps} from './Icon';
import Text from './Text';
class IconButton extends React.PureComponent<
  Pick<IconProps, 'name' | 'onPress' | 'size' | 'disabled' | 'accessibilityLabel'>
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
        <ReactNative.TouchableOpacity
          onPress={onPress}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={props.accessibilityLabel}
          style={{minWidth: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center'}}
        >
          <components.Icon name={name} size={size || 20} />
          {props.accessibilityLabel && (
            <Text style={{fontSize: 12, marginTop: 6}}>{props.accessibilityLabel}</Text>
          )}
        </ReactNative.TouchableOpacity>
      </ReactNative.View>
    );
  }
}
export default IconButton;
