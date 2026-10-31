import * as React from 'react';
import * as ReactNative from 'react-native';
import * as constants from '../theme/constants';
class Input extends React.PureComponent<ReactNative.TextInputProps> {
  render() {
    const props = this.props;
    const {style, maxLength, ...rest} = props;
    return (
      <ReactNative.TextInput
        autoCorrect={false}
        maxLength={maxLength || 40}
        underlineColorAndroid={'transparent'}
        style={[
          {
            color: constants.COLORS.primary,
          },
          style,
        ]}
        placeholderTextColor={constants.COLORS.primaryAlpha70}
        selectionColor={constants.COLORS.primaryAlpha70}
        {...rest}
      />
    );
  }
}
export default Input;
