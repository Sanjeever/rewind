import React from 'react';
import {Image, Keyboard, StyleSheet, View} from 'react-native';
import {TabBar, TabView} from 'react-native-tab-view';
import debounce from 'lodash/debounce';
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

const providerImages = {
  netEase: require('../../assets/images/netease.png'),
  qqMusic: require('../../assets/images/qqmusic.png'),
};
const resultComponents = [SongSearchResults, ArtistSearchResults, AlbumSearchResults, PlaylistSearchResults, VideoSearchResults];

export default class SearchPage extends React.PureComponent {
  state = {
    api: providers.netEase,
    index: 0,
    text: this.props.route.params?.text || '',
    query: '',
    focusing: true,
    show: false,
    routes: [
      {key: '0', title: locales.ARTIST_SONGS},
      {key: '1', title: locales.ARTIST},
      {key: '2', title: locales.ARTIST_ALBUM},
      {key: '3', title: locales.MIX},
      {key: '4', title: locales.ARTIST_MV},
    ],
  };

  updateSuggestions = debounce(text => {
    if (text.trim()) this.suggestions?.search_suggest(text.trim());
    else this.suggestions?.clearAllSuggestions();
  }, 100);

  componentDidMount() {
    if (this.state.text) this.updateSuggestions(this.state.text);
  }

  componentWillUnmount() {
    this.updateSuggestions.cancel();
  }

  submit = () => {
    const query = this.state.text.trim();
    if (!query) return;
    this.updateSuggestions.cancel();
    this.setState({query, show: true, focusing: false});
    this.suggestions?.insertHistoryItem(query, this.state.api);
    Keyboard.dismiss();
  };

  changeProvider = () => {
    this.updateSuggestions.cancel();
    const api = this.state.api === providers.netEase ? providers.qqMusic : providers.netEase;
    this.suggestions?.clearAllSuggestions();
    this.setState({api}, this.submit);
  };

  changeText = text => {
    this.setState({text});
    this.updateSuggestions(text);
  };

  selectSuggestion = (item, section) => {
    if (section === SECTION_KEYS.history) {
      this.setState({text: item.text, api: item.api}, this.submit);
    } else if (section === SECTION_KEYS.songs) {
      this.setState({text: item.name}, this.submit);
    } else {
      const screen = section === SECTION_KEYS.artists ? 'ArtistPage' : 'AlbumPage';
      this.props.navigation.navigate(screen, {item, api: this.state.api});
    }
  };

  renderScene = ({route}) => {
    const Result = resultComponents[Number(route.key)];
    return <Result search={this.state.query} api={this.state.api} index={this.state.index}
      navigation={this.props.navigation} />;
  };

  renderTabBar = props => <TabBar {...props} pressColor="rgba(0,0,0,0.3)"
    tabStyle={styles.tab} labelStyle={styles.label} indicatorStyle={styles.indicator} style={styles.tabBar} />;

  render() {
    const {api, text, focusing, show} = this.state;
    return <View style={styles.container}>
      <Background />
      <View style={styles.toolbar}>
        <TouchableBorderless onPress={() => this.props.navigation.goBack()} style={styles.button}>
          <Icon name={icons.ARROW_LEFT} />
        </TouchableBorderless>
        <Input autoFocus value={text} style={styles.textInput} placeholder="Everything……"
          onChangeText={this.changeText} onSubmitEditing={this.submit}
          onFocus={() => this.setState({focusing: true})} />
        <TouchableBorderless onPress={this.changeProvider} style={styles.button}
          accessibilityLabel={api === providers.netEase ? '切换到 QQ 音乐' : '切换到网易云音乐'}>
          <View style={styles.provider}>
            <Image source={providerImages[api]} style={styles.providerImage} />
          </View>
        </TouchableBorderless>
      </View>
      <SearchSuggestions focusing={focusing} onRef={suggestions => { this.suggestions = suggestions; }}
        api={api} onSuggest={this.selectSuggestion} />
      {show && !focusing && <TabView style={styles.container} navigationState={this.state}
        renderScene={this.renderScene} renderTabBar={this.renderTabBar}
        onIndexChange={index => this.setState({index})} />}
    </View>;
  }
}

const styles = StyleSheet.create({
  container: {flex: 1},
  toolbar: {marginTop: STATUS_BAR_HEIGHT, height: 40, width: '100%', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 10},
  textInput: {flex: 1, fontSize: 16, paddingHorizontal: 10},
  button: {padding: 6},
  provider: {height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', flex: 1},
  providerImage: {height: 25, width: 25},
  tabBar: {marginTop: -10, backgroundColor: 'transparent', elevation: 0},
  tab: {backgroundColor: 'transparent'},
  label: {backgroundColor: 'transparent', fontSize: 13, padding: 0},
  indicator: {backgroundColor: COLORS.primary},
});
