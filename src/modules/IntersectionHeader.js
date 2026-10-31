import Text from './../components/Text.js';
import 'react';
import * as ReactNative from 'react-native';
import TouchableScale from '../components/TouchableScale';
import * as components from '../components/index';
import icons from '../theme/icons';
import locales from '../locales/index';
const f = ReactNative.StyleSheet.create({
  header: {
    paddingHorizontal: 15,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cover: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#fff',
  },
});
const SComponent = function ({left, right, onChangePlaylist, iLength, type, toggleType}) {
  return (
    <ReactNative.View style={f.header}>
      {left ? (
        <ReactNative.Image
          style={f.cover}
          source={{
            uri: left?.coverImgUrl,
          }}
        />
      ) : (
        <ReactNative.View style={[f.cover]} />
      )}
      <ReactNative.View
        style={{
          width: 80,
          alignItems: 'center',
        }}
      >
        <components.Icon
          name={type === 'intersection' ? icons.INTERSECTION : icons.DIFFERENCE}
          size={30}
          onPress={toggleType}
        />
        <Text
          style={{
            marginTop: 5,
          }}
        >{`${iLength} ${locales.SONG_COUNT}`}</Text>
      </ReactNative.View>
      <TouchableScale onPress={onChangePlaylist}>
        {right ? (
          <ReactNative.Image
            style={f.cover}
            source={{
              uri: right?.coverImgUrl,
            }}
          />
        ) : (
          <ReactNative.View style={[f.cover, f.center]}>
            <Text>{locales.NULL}</Text>
          </ReactNative.View>
        )}
      </TouchableScale>
    </ReactNative.View>
  );
};
export default SComponent;
