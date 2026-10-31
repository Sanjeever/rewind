import * as React from 'react';
import * as ReactNative from 'react-native';
import * as components from '../components/index';
import TabbedViewPager from '../native/TabbedViewPager';
import * as constants from '../theme/constants';
import locales from '../locales/index';
import Subscriptions from './../modules/Subscriptions.js';
let i;
const tabNames = [locales.ARTIST, locales.ALBUM];
i = {};
i[locales.ARTIST] = '1';
i[locales.ALBUM] = '2';
const b = i;
class Favs extends React.PureComponent {
  state = {
    index: 0,
    searchText: '',
  };
  onTop = () => {
    let e;
    let t;
    let n;
    let r;
    if (this.state.index === 0) {
      if (!((e = (t = this.artistList).onTop) === null || e === undefined)) {
        e.call(t);
      }
    } else if (!((n = (r = this.albumList).onTop) === null || n === undefined)) {
      n.call(r);
    }
  };
  searchSong = (searchText) => {
    this.setState({
      searchText,
    });
  };
  _handleIndexChange = (index) => {
    return this.setState({
      index,
    });
  };
  _renderScene = (e) => {
    switch (e.route.key) {
      case '1':
        return (
          <Subscriptions
            type={'artist'}
            onArtist={this.onArtist}
            index={this.state.index}
            navigation={this.props.navigation}
            searchText={this.state.searchText}
            onRef={(e) => {
              return (this.artistList = e);
            }}
          />
        );
      case '2':
        return (
          <Subscriptions
            type={'album'}
            onAlbum={this.onAlbum}
            index={this.state.index}
            navigation={this.props.navigation}
            searchText={this.state.searchText}
            onRef={(e) => {
              return (this.albumList = e);
            }}
          />
        );
      default:
        return null;
    }
  };
  _renderScenes = (e) => {
    switch (e) {
      case '1':
        return (
          <Subscriptions
            type={'artist'}
            onArtist={this.onArtist}
            scrolling={this.state.scrolling}
            index={this.state.index}
            scrollEnd={() => {
              return this.setState({
                scrolling: false,
              });
            }}
            navigation={this.props.navigation}
            searchText={this.state.searchText}
            ref={(e) => {
              return (this.artistList = e);
            }}
          />
        );
      case '2':
        return (
          <Subscriptions
            type={'album'}
            onAlbum={this.onAlbum}
            scrolling={this.state.scrolling}
            index={this.state.index}
            scrollEnd={() => {
              return this.setState({
                scrolling: false,
              });
            }}
            navigation={this.props.navigation}
            searchText={this.state.searchText}
            ref={(e) => {
              return (this.albumList = e);
            }}
          />
        );
      default:
        return null;
    }
  };
  onArtist = (e, t) => {
    this.props.navigation.navigate('ArtistPage', {
      item: e,
      api: t,
    });
  };
  onAlbum = (e, t) => {
    this.props.navigation.navigate('AlbumPage', {
      item: e,
      api: t,
    });
  };
  render() {
    return (
      <components.PageContainer
        title={locales.FAVS}
        goBack={() => {
          return this.props.navigation.goBack();
        }}
        onTop={this.onTop}
        textInput={true}
        onChangeText={(t) => {
          return this.searchSong(t);
        }}
        text={this.state.searchText}
        disabledTopFadingEdge={true}
      >
        <TabbedViewPager
          tabNames={tabNames}
          style={[
            h.container,
            {
              padding: 5,
            },
          ]}
          onPageSelected={(t) => {
            return this._handleIndexChange(t.nativeEvent.position);
          }}
        >
          {tabNames.map((t, key) => (
            <ReactNative.View
              key={key}
              style={{
                flex: 1,
                paddingBottom: 45,
              }}
            >
              {this._renderScenes(b[t])}
            </ReactNative.View>
          ))}
        </TabbedViewPager>
      </components.PageContainer>
    );
  }
}
var h = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40 + constants.STATUS_BAR_HEIGHT,
  },
  tabBar: {
    marginTop: 0,
    backgroundColor: 0,
    elevation: 0,
  },
  tabStyle: {
    backgroundColor: 'rgba(0,0,0,0)',
  },
  labelStyle: {
    backgroundColor: 'rgba(0,0,0,0)',
  },
  indicatorStyle: {
    backgroundColor: constants.COLORS.primary,
  },
});
export default Favs;
