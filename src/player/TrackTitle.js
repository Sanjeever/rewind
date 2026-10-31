import Text from './../components/Text.js';
import 'react';
import * as ReactNative from 'react-native';
import * as components from '../components/index';
import * as constants from '../theme/constants';
const size = 0.65 * constants.DEVICE_WIDTH;
const f = ReactNative.StyleSheet.create({
  songTitleCon: {
    flex: 1,
    width: constants.DEVICE_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  songAuthor: {
    opacity: 0.7,
  },
  alias: {
    marginLeft: 15,
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: 'normal',
  },
});
const CComponent = function ({
  title,
  subtitle,
  viewStyle,
  titleStyle,
  authorStyle,
  onPress,
  alias,
  numberOfLines,
}) {
  return (
    <ReactNative.View
      accessible={false}
      style={[
        viewStyle || f.songTitleCon,
        onPress && {
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
    >
      {title ? (
        <Text
          style={[f.songTitle, ReactNative.StyleSheet.flatten(titleStyle)]}
          numberOfLines={numberOfLines || 1}
        >
          {title}
          {alias && <Text style={f.alias}> ({alias})</Text>}
        </Text>
      ) : null}
      {subtitle?.length > 0 ? (
        <Text
          numberOfLines={numberOfLines || 1}
          style={[f.songAuthor, ReactNative.StyleSheet.flatten(authorStyle)]}
        >
          {subtitle}
        </Text>
      ) : null}
      {Boolean(onPress) && (
        <components.TouchableBorderless
          onPress={onPress}
          style={{
            position: 'absolute',
            padding: 50,
          }}
          size={size}
        >
          <ReactNative.View
            style={{
              height: '100%',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0)',
              flex: 1,
            }}
          />
        </components.TouchableBorderless>
      )}
    </ReactNative.View>
  );
};
export default CComponent;
