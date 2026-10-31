import Text from './Text';
import * as React from 'react';
import 'react-native';
class Selectable extends React.PureComponent {
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
