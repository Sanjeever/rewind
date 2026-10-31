import Text from './../../components/Text.js';
import 'react';
import * as ReactNative from 'react-native';
import * as components from '../../components/index';
import * as utils from '../../utils/index';
const d = ReactNative.StyleSheet.create({
  msgItemCon: {
    minHeight: 100,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  text: {
    color: '#fff',
    opacity: 0.8,
    fontSize: 14,
  },
  content: {
    padding: 10,
    flex: 1,
  },
  msg: {
    marginBottom: 5,
  },
  albumItem: {
    height: 70,
    padding: 5,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 5,
    borderWidth: ReactNative.StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
  mvItem: {
    height: 130,
    padding: 5,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 5,
    borderWidth: ReactNative.StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
});
const GComponent = function ({msg, data, time, onAlbum, onMV, onSong, user, fromUser}) {
  return (
    <ReactNative.View
      style={[
        d.msgItemCon,
        user !== fromUser && {
          alignSelf: 'flex-end',
        },
      ]}
    >
      <ReactNative.View
        style={[
          d.content,
          user !== fromUser && {
            minWidth: 100,
          },
        ]}
      >
        <Text
          style={[
            d.text,
            d.msg,
            user !== fromUser && {
              alignSelf: 'flex-end',
            },
          ]}
        >
          {msg}
        </Text>
        {data.type === 2 ? (
          <components.SettingItem
            coverImg={`${data.album.picUrl}?param=200y200`}
            itemHeight={70}
            title={data.album.name}
            subtitle={utils.parseArtist(data.album.artists)}
            containerStyle={d.albumItem}
            onPress={onAlbum}
          />
        ) : null}
        {data.type === 7 ? (
          <components.SettingItem
            coverImg={`${data.mv.imgurl}?param=200y200`}
            coverImgStyle={{
              height: '90%',
              width: '50%',
            }}
            itemHeight={130}
            title={data.mv.name}
            subtitle={data.mv.artistName}
            containerStyle={d.mvItem}
            onPress={onMV}
          />
        ) : null}
        {data.type === 1 ? (
          <components.SettingItem
            coverImg={`${data.song.album.picUrl}?param=200y200`}
            itemHeight={70}
            title={data.song.name}
            subtitle={data.song.album.name}
            containerStyle={d.albumItem}
            onPress={onSong}
          />
        ) : null}
        <Text
          style={[
            d.text,
            {
              fontSize: 12,
              color: '#eee',
              alignSelf: 'flex-end',
            },
          ]}
        >
          {time}
        </Text>
      </ReactNative.View>
    </ReactNative.View>
  );
};
export default GComponent;
