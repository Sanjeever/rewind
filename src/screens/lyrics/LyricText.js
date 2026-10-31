import Text from './../../components/Text';
import * as React from 'react';
import * as ReactNative from 'react-native';
class LyricText extends React.PureComponent {
  render() {
    const props = this.props;
    const {lyric, trans, onPress, style, hidden} = props;
    return (
      <ReactNative.TouchableOpacity onPress={onPress} activeOpacity={0.6}>
        <ReactNative.View
          style={[
            s.textCon,
            style,
            hidden && {
              opacity: 0,
            },
          ]}
        >
          {lyric?.length > 0 ? <Text style={[s.text]}>{lyric}</Text> : null}
          {trans?.length > 0 ? <Text style={[s.text]}>{trans || ''}</Text> : null}
        </ReactNative.View>
      </ReactNative.TouchableOpacity>
    );
  }
}
export default LyricText;
var s = ReactNative.StyleSheet.create({
  textCon: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    padding: 8,
    paddingHorizontal: 20,
  },
  text: {
    color: '#000',
    fontSize: 16,
  },
});
