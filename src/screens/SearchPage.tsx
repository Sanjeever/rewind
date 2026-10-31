import _neteaseImage from '../../assets/images/netease.png';
import _qqmusicImage from '../../assets/images/qqmusic.png';
import {toast} from '../native/toast';
import React from 'react';
import {Image, Keyboard, StyleSheet, View} from 'react-native';
import {TabBar, TabView} from 'react-native-tab-view';
import type {SceneRendererProps, NavigationState, Route, TabBarProps} from 'react-native-tab-view';
import {Background, Icon, Input, TouchableBorderless} from '../components';
import providers from '../services/providers';
import {STATUS_BAR_HEIGHT, COLORS} from '../theme/constants';
import icons from '../theme/icons';
import locales from '../locales';
import {SECTION_KEYS} from './search/sections';
import AlbumSearchResults from '../modules/AlbumSearchResults';
import VideoSearchResults from '../modules/VideoSearchResults';
import PlaylistSearchResults from '../modules/PlaylistSearchResults';
import ArtistSearchResults from '../modules/ArtistSearchResults';
import SongSearchResults from '../modules/SongSearchResults';
import SearchSuggestions from '../modules/SearchSuggestions';
import {searchHistory} from '../storage/history';
import type {ScreenProps} from '../navigation/types';
import type {OnlineProvider} from '../services/providers';
import type {SuggestionItem} from '../modules/SearchSuggestions';
import type {SectionKey} from './search/sections';
import type {EntitySearchProps} from '../modules/EntitySearchResults';
interface State extends NavigationState<Route> {
  api: OnlineProvider;
  text: string;
  query: string;
  focusing: boolean;
  show: boolean;
  historyVersion: number;
}
const providerImages = {
  netEase: _neteaseImage,
  qqMusic: _qqmusicImage,
};
const resultComponents: React.ComponentType<EntitySearchProps>[] = [
  ({search, api}) => <SongSearchResults search={search} api={api} />,
  ArtistSearchResults,
  AlbumSearchResults,
  PlaylistSearchResults,
  VideoSearchResults,
];
export default class SearchPage extends React.PureComponent<ScreenProps<'SearchPage'>, State> {
  mounted = false;
  state: State = {
    api: providers.netEase,
    index: 0,
    text: this.props.route.params?.text || '',
    query: '',
    focusing: true,
    show: false,
    historyVersion: 0,
    routes: [
      {
        key: '0',
        title: locales.ARTIST_SONGS,
      },
      {
        key: '1',
        title: locales.ARTIST,
      },
      {
        key: '2',
        title: locales.ARTIST_ALBUM,
      },
      {
        key: '3',
        title: locales.MIX,
      },
      {
        key: '4',
        title: locales.ARTIST_MV,
      },
    ],
  };
  componentDidMount() {
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }
  submit = () => {
    const query = this.state.text.trim();
    if (!query) {
      return;
    }
    this.setState({
      query,
      show: true,
      focusing: false,
    });
    searchHistory(query, this.state.api)
      .then(() => {
        if (this.mounted) {
          this.setState((state) => ({
            historyVersion: state.historyVersion + 1,
          }));
        }
      })
      .catch((error) => toast(`保存搜索历史失败：${error.message}`));
    Keyboard.dismiss();
  };
  changeProvider = () => {
    const api = this.state.api === providers.netEase ? providers.qqMusic : providers.netEase;
    this.setState(
      {
        api,
      },
      this.submit,
    );
  };
  changeText = (text: string) => {
    this.setState({
      text,
    });
  };
  selectSuggestion = (item: SuggestionItem, section: SectionKey) => {
    if ('text' in item) {
      if (item.api === 'local') return;
      this.setState(
        {
          text: item.text,
          api: item.api,
        },
        this.submit,
      );
    } else if (section === SECTION_KEYS.songs) {
      this.setState(
        {
          text: item.name!,
        },
        this.submit,
      );
    } else {
      const screen = section === SECTION_KEYS.artists ? 'ArtistPage' : 'AlbumPage';
      this.props.navigation.navigate(screen, {
        item,
        api: this.state.api,
      });
    }
  };
  renderScene = ({route}: SceneRendererProps & {route: Route}) => {
    const Result = resultComponents[Number(route.key)];
    return (
      <Result
        search={this.state.query}
        api={this.state.api}
        index={this.state.index}
        navigation={this.props.navigation}
      />
    );
  };
  renderTabBar = (props: TabBarProps<Route>) => (
    <TabBar
      {...props}
      pressColor="rgba(0,0,0,0.3)"
      tabStyle={styles.tab}
      options={Object.fromEntries(
        this.state.routes.map((route) => [route.key, {labelStyle: styles.label}]),
      )}
      indicatorStyle={styles.indicator}
      style={styles.tabBar}
    />
  );
  render() {
    const {api, text, focusing, show} = this.state;
    return (
      <View style={styles.container}>
        <Background />
        <View style={styles.toolbar}>
          <TouchableBorderless onPress={() => this.props.navigation.goBack()} style={styles.button}>
            <Icon name={icons.ARROW_LEFT} />
          </TouchableBorderless>
          <Input
            autoFocus
            value={text}
            style={styles.textInput}
            placeholder="Everything……"
            onChangeText={this.changeText}
            onSubmitEditing={this.submit}
            onFocus={() =>
              this.setState({
                focusing: true,
              })
            }
          />
          <TouchableBorderless
            onPress={this.changeProvider}
            style={styles.button}
            accessibilityLabel={api === providers.netEase ? '切换到 QQ 音乐' : '切换到网易云音乐'}
          >
            <View style={styles.provider}>
              <Image source={providerImages[api]} style={styles.providerImage} />
            </View>
          </TouchableBorderless>
        </View>
        <SearchSuggestions
          query={text}
          focusing={focusing}
          historyVersion={this.state.historyVersion}
          api={api}
          onSuggest={this.selectSuggestion}
        />
        {show && !focusing && (
          <TabView
            style={styles.container}
            navigationState={this.state}
            renderScene={this.renderScene}
            renderTabBar={this.renderTabBar}
            onIndexChange={(index) =>
              this.setState({
                index,
              })
            }
          />
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    marginTop: STATUS_BAR_HEIGHT,
    height: 40,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  button: {
    padding: 6,
  },
  provider: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  providerImage: {
    height: 25,
    width: 25,
  },
  tabBar: {
    marginTop: -10,
    backgroundColor: 'transparent',
    elevation: 0,
  },
  tab: {
    backgroundColor: 'transparent',
  },
  label: {
    backgroundColor: 'transparent',
    fontSize: 13,
    padding: 0,
  },
  indicator: {
    backgroundColor: COLORS.primary,
  },
});
