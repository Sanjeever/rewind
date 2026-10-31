import Text from './Text';
import * as React from 'react';
import type {TextProps} from 'react-native';
class Selectable extends React.PureComponent<TextProps> {
  render() {
    const props = this.props;
    const {children, ...rest} = props;
    return (
      <Text selectable={true} selectionColor={'#e41749'} {...rest}>
        {children}
      </Text>
    );
  }
}
export default Selectable;
