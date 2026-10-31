import * as React from 'react';
import * as ReactNative from 'react-native';
import * as components from '../components/index';
import TabbedViewPager from '../native/TabbedViewPager';
import * as constants from '../theme/constants';
import locales from '../locales/index';
import Subscriptions from '../features/account/Subscriptions';
import type {SubscriptionItem} from '../features/account/Subscriptions';
import type {Provider} from '../services/providers';
import type {ScreenProps} from '../navigation/types';
const tabNames = [locales.ARTIST, locales.ALBUM];
const i: Record<string, string> = {};
i[locales.ARTIST] = '1';
i[locales.ALBUM] = '2';
const b = i;
class Favs extends React.PureComponent<ScreenProps<'Favs'>, {index: number; searchText: string}> {
  artistList: Subscriptions | null = null;
  albumList: Subscriptions | null = null;
  state = {
    index: 0,
    searchText: '',
  };
  onTop = () => {
    (this.state.index === 0 ? this.artistList : this.albumList)?.onTop();
  };
  searchSong = (searchText: string) => {
    this.setState({
      searchText,
    });
  };
  _handleIndexChange = (index: number) => {
    return this.setState({
      index,
    });
  };
  _renderScene = (e: {route: {key: string}}) => {
    switch (e.route.key) {
      case '1':
        return (
          <Subscriptions
            type={'artist'}
            onArtist={this.onArtist}
            index={this.state.index}
            navigation={this.props.navigation}
            searchText={this.state.searchText}
            ref={(e) => {
              this.artistList = e;
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
            ref={(e) => {
              this.albumList = e;
            }}
          />
        );
      default:
        return null;
    }
  };
  _renderScenes = (e: string) => {
    switch (e) {
      case '1':
        return (
          <Subscriptions
            type={'artist'}
            onArtist={this.onArtist}
            index={this.state.index}
            navigation={this.props.navigation}
            searchText={this.state.searchText}
            ref={(e) => {
              this.artistList = e;
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
            ref={(e) => {
              this.albumList = e;
            }}
          />
        );
      default:
        return null;
    }
  };
  onArtist = (e: SubscriptionItem, t: Provider) => {
    this.props.navigation.navigate('ArtistPage', {
      item: e,
      api: t,
    });
  };
  onAlbum = (e: SubscriptionItem, t: Provider) => {
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
        searchText={this.state.searchText}
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
const h = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40 + constants.STATUS_BAR_HEIGHT,
  },
  tabBar: {
    marginTop: 0,
    backgroundColor: 'transparent',
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
