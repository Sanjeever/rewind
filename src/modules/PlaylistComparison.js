import Text from './../components/Text.js';
import * as React from 'react';
import * as ReactNative from 'react-native';
import FadingEdge from '../components/FadingEdge';
import * as reactNativeSpringScrollview from './../components/Scrolling.js';
import TouchableScale from '../components/TouchableScale';
import * as components from '../components/index';
import providers from '../services/providers';
import icons from '../theme/icons';
import locales from '../locales/index';
import users from '../storage/users';
class PlaylistComparison extends React.PureComponent {
  state = {
    api: providers.netEase,
    playlist: [],
  };
  loadPlaylist = async (api) => {
    const stored = await users.getUserPlayList();
    if (api === providers.netEase) {
      this.setState({
        playlist: stored?.netEase || [],
      });
    }
  };
  onTop = () => {
    this._scrollView.scrollToBegin?.();
  };
  _renderItem = ({item}) => {
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
  formatItem = (e) => {
    const t = {};
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
    const e = this;
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
          <ReactNative.TouchableWithoutFeedback onPress={this.onClosed}>
            <ReactNative.View style={[ReactNative.StyleSheet.absoluteFill]} />
          </ReactNative.TouchableWithoutFeedback>
          <TouchableScale onPress={this.onTop}>
            <Text style={[h.text, h.title]}>{locales.COMPARE_WITH}</Text>
          </TouchableScale>
          <FadingEdge top={30}>
            <reactNativeSpringScrollview.SpringScrollView
              ref={function (t) {
                return (e._scrollView = t);
              }}
              style={{
                paddingHorizontal: '20%',
              }}
            >
              {playlist.map((item, index) =>
                e._renderItem({
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
class PlaylistComparisonScreen extends React.PureComponent {
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
var h = ReactNative.StyleSheet.create({
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
