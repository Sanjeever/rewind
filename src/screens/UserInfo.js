import {toast} from '../native/toast';
import Text from './../components/Text.js';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as components from '../components/index';
import providers from '../services/providers';
import * as constants from '../theme/constants';
import names from '../events/names';
import icons from '../theme/icons';
import locales from '../locales/index';
import * as services from '../services/index';
import * as events from '../events/index';
import * as types from '../utils/types';
import styles from './users/styles';
class UserInfo extends React.PureComponent {
  state = {
    profile: {},
    playlist: [],
    listenSongs: 0,
    peopleCanSeeMyPlayRecord: false,
  };
  getInfo = async (id) => {
    const response = await services.Netease.user_detail(id);
    if (!response) {
      return;
    }
    if (response.code === 301) {
      toast(locales.NETEASE_NOT_LOGIN);
      return;
    }
    if (!response.profile) {
      throw new Error(response.message || locales.ERROR);
    }
    this.setState({
      profile: response.profile,
      listenSongs: response.listenSongs,
      peopleCanSeeMyPlayRecord: response.peopleCanSeeMyPlayRecord,
    });
    await this.getPlaylist(id);
  };
  getPlaylist = async (id) => {
    const response = await services.Netease.user_playlist(id);
    if (response?.playlist) {
      this.setState({
        playlist: response.playlist,
      });
    }
  };
  onFollow = () => {
    const profile = this.state.profile;
    this.props.navigation.navigate('FollowPage', {
      profile,
    });
  };
  onSelectedUser = () => {
    const profile = this.state.profile;
    events.emitter.emit(names.SelectedUser, profile);
  };
  renderForeground = (nativeOffset) => {
    const a_state = this.state;
    const {profile, listenSongs} = a_state;
    const {backgroundUrl, avatarUrl, nickname, signature} = profile;
    const transform = [
      {
        translateY: nativeOffset.y.interpolate({
          inputRange: [-constants.DEVICE_WIDTH, 0],
          outputRange: [-constants.DEVICE_WIDTH / 2, 0],
          extrapolate: 'clamp',
        }),
      },
      {
        scale: nativeOffset.y.interpolate({
          inputRange: [-constants.DEVICE_WIDTH, 0],
          outputRange: [2, 1],
          extrapolate: 'clamp',
        }),
      },
    ];
    return (
      <ReactNative.View style={E.foreground}>
        {types.isString(backgroundUrl) && (
          <ReactNative.Animated.Image
            source={{
              uri: backgroundUrl,
            }}
            style={[
              E.background,
              {
                transform,
              },
            ]}
          />
        )}
        <ReactNative.Animated.View
          style={[
            E.overlay,
            {
              transform,
            },
          ]}
        />
        {avatarUrl && (
          <ReactNative.TouchableOpacity onPress={this.onFollow} onLongPress={this.onSelectedUser}>
            <ReactNative.Animated.View
              style={{
                padding: 20,
                alignItems: 'center',
              }}
            >
              {React.createElement(styles, {
                imgUrl: avatarUrl,
                nativeOffset,
              })}
              <ReactNative.Animated.View
                style={{
                  alignItems: 'center',
                  opacity: nativeOffset.y.interpolate({
                    inputRange: [-constants.DEVICE_WIDTH / 3, 0],
                    outputRange: [0, 1],
                    extrapolate: 'clamp',
                  }),
                }}
              >
                {nickname ? (
                  <Text numberOfLines={1} style={[E.title]}>
                    {nickname}
                  </Text>
                ) : null}
                {signature ? (
                  <Text numberOfLines={2} style={[E.subtitle]}>
                    {signature}
                  </Text>
                ) : null}
              </ReactNative.Animated.View>
            </ReactNative.Animated.View>
          </ReactNative.TouchableOpacity>
        )}
        <ReactNative.View
          style={{
            height: 60,
            width: '100%',
            position: 'absolute',
            bottom: 0,
          }}
        >
          <components.ListItem
            img={null}
            errorIconName={icons.CHART_BAR}
            title={locales.LISTEN_RECORD}
            subtitle={`${listenSongs} ${locales.SONG_COUNT}`}
            onPress={this.onListenRecord}
          />
        </ReactNative.View>
      </ReactNative.View>
    );
  };
  onListenRecord = () => {
    const a_state = this.state;
    const e_profile = a_state.profile;
    if (a_state.peopleCanSeeMyPlayRecord) {
      this.props.navigation.navigate('ListenRecord', {
        profile: e_profile,
      });
    } else {
      toast(locales.INVISIBLE);
    }
  };
  onPlaylist = (playlist) => {
    this.props.navigation.navigate('Playlist', {
      playlist,
      api: providers.netEase,
    });
  };
  renderItem = ({item, index}) => {
    return (
      <components.ListItem
        key={index}
        img={`${item.coverImgUrl}?param=200y200`}
        title={index === 0 ? '♡' : item.name}
        subtitle={`${item.trackCount} ${locales.SONG_COUNT}`}
        onPress={() => {
          return this.onPlaylist(item);
        }}
        rightIcon={{
          name: icons.INTERSECTION,
          size: 22,
          onPress: () => {
            return this.onPlaylistIntersection(item);
          },
        }}
      />
    );
  };
  onPlaylistIntersection = (e) => {
    this.props.navigation.navigate('PlaylistIntersection', {
      item: e,
    });
  };
  componentDidMount() {
    const params = this.props.route.params;
    if (types.isObject(params)) {
      const t = params.userId;
      if (types.isNumber(t)) {
        this.getInfo(t);
      }
    }
  }
  render() {
    const e = this;
    const playlist = this.state.playlist;
    return (
      <ReactNative.View style={E.container}>
        <components.Background />
        <components.ParallaxScrollView renderForeground={this.renderForeground}>
          {playlist?.length > 0 ? (
            playlist.map((t, index) =>
              e.renderItem({
                item: t,
                index,
              }),
            )
          ) : (
            <components.Spinkit style={E.spinkit} />
          )}
          <components.EmptyFooter />
        </components.ParallaxScrollView>
      </ReactNative.View>
    );
  }
}
export default UserInfo;
var E = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
  },
  foreground: {
    height: constants.DEVICE_WIDTH + 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 60,
  },
  background: {
    height: constants.DEVICE_WIDTH,
    width: '100%',
    position: 'absolute',
    top: 0,
  },
  overlay: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 15,
  },
  subtitle: {
    textAlign: 'center',
  },
  spinkit: {
    height: constants.DEVICE_HEIGHT - constants.DEVICE_WIDTH - 2 * constants.ITEM_HEIGHT,
  },
});
