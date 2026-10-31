import Text from './../components/Text';
import * as React from 'react';
import * as ReactNative from 'react-native';
import FadingEdge from '../components/FadingEdge';
import * as reactNativeSpringScrollview from './../components/Scrolling';
import TouchableScale from '../components/TouchableScale';
import * as components from '../components/index';
import providers from '../services/providers';
import icons from '../theme/icons';
import locales from '../locales/index';
import users from '../storage/users';
import type {Playlist} from '../storage/models';
import type {Provider} from '../services/providers';
class PlaylistComparison extends React.PureComponent<
  {visible: boolean; onRequestClose(): void; onSelect(playlist: Playlist): void},
  {api: Provider; playlist: Playlist[]}
> {
  _scrollView: reactNativeSpringScrollview.SpringScrollView | null = null;
  state: {api: Provider; playlist: Playlist[]} = {
    api: providers.netEase,
    playlist: [],
  };
  loadPlaylist = async (api: Provider) => {
    const stored = await users.getUserPlayList();
    if (api === providers.netEase) {
      this.setState({
        playlist: stored?.netEase || [],
      });
    }
  };
  onTop = () => {
    this._scrollView?.scrollToBegin();
  };
  _renderItem = ({item}: {item: Playlist; index?: number}) => {
    const r = this.formatItem(item);
    return React.createElement(PlaylistComparisonScreen, {
      title: r.title,
      img: r.img,
      onPress: () => {
        return this.props.onSelect(item);
      },
      trackCount: r.trackCount,
    });
  };
  formatItem = (e: Playlist) => {
    const t: {title?: string; img?: string; trackCount?: number} = {};
    if (this.state.api === providers.netEase) {
      t.title = e.name;
      t.img = `${e.coverImgUrl}?param=200y200`;
      t.trackCount = e.trackCount;
    }
    return t;
  };
  componentDidMount() {
    this.loadPlaylist(this.state.api);
  }
  render() {
    const props = this.props;
    const {visible, onRequestClose} = props;
    const playlist = this.state.playlist;
    return (
      <ReactNative.Modal
        animationType={'fade'}
        transparent={true}
        onRequestClose={onRequestClose}
        visible={visible}
      >
        <ReactNative.View style={h.container}>
          <components.Background
            imageStyle={{
              opacity: 0.5,
            }}
            blur={true}
          />
          <ReactNative.TouchableWithoutFeedback onPress={onRequestClose}>
            <ReactNative.View style={[ReactNative.StyleSheet.absoluteFill]} />
          </ReactNative.TouchableWithoutFeedback>
          <TouchableScale onPress={this.onTop}>
            <Text style={[h.text, h.title]}>{locales.COMPARE_WITH}</Text>
          </TouchableScale>
          <FadingEdge top={30}>
            <reactNativeSpringScrollview.SpringScrollView
              ref={(t) => {
                this._scrollView = t;
              }}
              style={{
                paddingHorizontal: '20%',
              }}
            >
              {playlist.map((item, index) =>
                this._renderItem({
                  item,
                  index,
                }),
              )}
              <ReactNative.View style={h.footer} />
            </reactNativeSpringScrollview.SpringScrollView>
          </FadingEdge>
        </ReactNative.View>
      </ReactNative.Modal>
    );
  }
}
class PlaylistComparisonScreen extends React.PureComponent<{
  onPress(): void;
  title?: string;
  img?: string;
  trackCount?: number;
}> {
  render() {
    const props = this.props;
    const {onPress, title, img, trackCount} = props;
    return (
      <ReactNative.TouchableOpacity
        onPress={onPress}
        style={{
          marginTop: 15,
          alignItems: 'center',
        }}
      >
        {img ? (
          <ReactNative.Image
            style={h.cover}
            source={{
              uri: img,
            }}
          />
        ) : (
          <ReactNative.View
            style={[
              h.cover,
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
        <Text
          numberOfLines={2}
          style={[
            h.text,
            {
              fontSize: 14,
              marginTop: 5,
              fontWeight: 'bold',
              textAlign: 'center',
            },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            h.text,
            {
              fontSize: 14,
              marginTop: -3,
            },
          ]}
        >
          {'- '}
          {trackCount}
          {' -'}
        </Text>
      </ReactNative.TouchableOpacity>
    );
  }
}
const h = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
  },
  title: {
    marginTop: '15%',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  cover: {
    height: 80,
    width: 80,
    borderRadius: 40,
  },
  footer: {
    height: 50,
  },
});
export default PlaylistComparison;
