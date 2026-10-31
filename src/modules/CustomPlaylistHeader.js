import Text from './../components/Text.js';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as components from '../components/index';
import icons from '../theme/icons';
class CustomPlaylistHeader extends React.PureComponent {
  render() {
    const props = this.props;
    const {onPress, title, img, trackCount} = props;
    return (
      <ReactNative.TouchableOpacity onPress={onPress}>
        <ReactNative.View
          style={{
            marginTop: 15,
            alignItems: 'center',
          }}
        >
          {img ? (
            <ReactNative.Image
              style={c.cover}
              source={{
                uri: img,
              }}
            />
          ) : (
            <ReactNative.View
              style={[
                c.cover,
                {
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#fff',
                },
              ]}
            >
              <components.Icon name={icons.DISC} size={35} color={'#111'} />
            </ReactNative.View>
          )}
          <ReactNative.View style={c.textCon}>
            <Text style={[c.title]} numberOfLines={2}>
              {title}
            </Text>
            <Text style={[c.subtitle]}>
              {'- '}
              {trackCount}
              {' -'}
            </Text>
          </ReactNative.View>
        </ReactNative.View>
      </ReactNative.TouchableOpacity>
    );
  }
}
export default CustomPlaylistHeader;
var c = ReactNative.StyleSheet.create({
  cover: {
    height: 80,
    width: 80,
    borderRadius: 40,
  },
  textCon: {
    width: 160,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 5,
    fontWeight: 'bold',
  },
});
