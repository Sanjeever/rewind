import React from 'react';
import {StyleSheet, TouchableNativeFeedback, View} from 'react-native';
import debounce from 'lodash/debounce';
import FadingEdge from '../components/FadingEdge';
import {SpringScrollView} from '../components/Scrolling';
import {Icon} from '../components';
import Text from '../components/Text';
import providers from '../services/providers';
import {STATUS_BAR_HEIGHT} from '../theme/constants';
import icons from '../theme/icons';
import {storage} from '../storage';
import keys from '../storage/keys';
import {Netease, QQMusic} from '../services';
import {SECTIONS, SECTION_KEYS, SECTION_NAMES} from '../screens/search/sections';

export default class SearchSuggestions extends React.PureComponent {
  state = {songs: [], albums: [], artists: [], history: [], error: null};
  requestId = 0;
  historyRequest = 0;
  fetchSuggestions = debounce((query, api, request) => this.loadSuggestions(query, api, request), 100);

  componentDidMount() {
    this.mounted = true;
    this.loadHistory();
    this.updateQuery();
  }

  componentDidUpdate(previous) {
    if (previous.query !== this.props.query || previous.api !== this.props.api || previous.focusing !== this.props.focusing) this.updateQuery();
    if ((!previous.focusing && this.props.focusing) || previous.historyVersion !== this.props.historyVersion) this.loadHistory();
  }

  componentWillUnmount() {
    this.mounted = false;
    this.requestId++;
    this.fetchSuggestions.cancel();
  }

  updateQuery = () => {
    const request = ++this.requestId;
    this.fetchSuggestions.cancel();
    this.setState({songs: [], albums: [], artists: [], error: null});
    const query = this.props.query.trim();
    if (this.props.focusing && query) this.fetchSuggestions(query, this.props.api, request);
  };

  loadSuggestions = async (query, api, request) => {
    try {
      const response = await (api === providers.netEase ? Netease.search_suggest(query) : QQMusic.search_suggest(query));
      if (request !== this.requestId) return;
      const expected = api === providers.netEase ? 200 : 0;
      if (response?.code !== expected) throw new Error('搜索建议失败（' + response?.code + '）');
      const data = api === providers.netEase ? response.result : response.data;
      if (!data) throw new Error('搜索建议响应缺少结果');
      this.setState(api === providers.netEase ? {
        songs: data.songs || [], albums: data.albums || [], artists: data.artists || [], error: null,
      } : {
        songs: data.song?.itemlist || [], albums: data.album?.itemlist || [], artists: data.singer?.itemlist || [], error: null,
      });
    } catch (error) {
      if (request === this.requestId) this.setState({error});
    }
  };

  loadHistory = async () => {
    const request = ++this.historyRequest;
    try {
      const history = await storage.load({key: keys.searchHistory});
      if (this.mounted && request === this.historyRequest) this.setState({history});
    } catch (error) {
      if (this.mounted && error.name !== 'NotFoundError') this.setState({error});
    }
  };

  clearHistory = async () => {
    const request = ++this.historyRequest;
    try {
      await storage.remove({key: keys.searchHistory});
      if (this.mounted && request === this.historyRequest) this.setState({history: []});
    } catch (error) {
      if (this.mounted) this.setState({error});
    }
  };

  formatSuggestion(item, section) {
    if (section === SECTION_KEYS.history) return {name: item.text};
    if (this.props.api === providers.qqMusic) return {name: item.name};
    if (section === SECTION_KEYS.songs) return {name: item.name, subName: item.artists?.[0]?.name, transName: item.transNames?.[0]};
    if (section === SECTION_KEYS.albums) return {name: item.name, subName: item.artist?.name};
    return {name: item.name, subName: item.alias?.[0]};
  }

  renderSection = section => {
    const items = this.state[section];
    if (!items.length) return null;
    const isHistory = section === SECTION_KEYS.history;
    const header = <View style={styles.header}>
      <Text style={[styles.text, styles.sectionHeader]}>{SECTION_NAMES[section]}</Text>
      {isHistory && <Icon name={icons.WINDOW_CLOSE} color="#eee" size={20} />}
    </View>;
    return <React.Fragment key={section}>
      {isHistory ? <TouchableNativeFeedback onPress={this.clearHistory} accessibilityLabel="清空搜索历史">{header}</TouchableNativeFeedback> : header}
      {items.map((item, index) => {
        const {name, transName, subName} = this.formatSuggestion(item, section);
        return <TouchableNativeFeedback key={index} onPress={() => this.props.onSuggest(item, section)}>
          <View style={styles.row}>
            <Text style={[styles.text, styles.name]}>{name}{transName ? '(' + transName + ')' : ''}</Text>
            {!!subName && <Text style={[styles.text, styles.fadeText]}>{subName}</Text>}
          </View>
        </TouchableNativeFeedback>;
      })}
    </React.Fragment>;
  };

  render() {
    if (!this.props.focusing) return null;
    return <View style={styles.container}>
      <FadingEdge top={50}>
        <SpringScrollView contentStyle={{paddingTop: 20}}>
          {this.state.error && <Text selectable style={styles.text}>{this.state.error.message}</Text>}
          {SECTIONS.map(this.renderSection)}
        </SpringScrollView>
      </FadingEdge>
    </View>;
  }
}

const styles = StyleSheet.create({
  container: {top: 40 + STATUS_BAR_HEIGHT, flex: 1, alignSelf: 'center', width: '100%', height: '100%', position: 'absolute', paddingHorizontal: 20},
  text: {fontSize: 14, padding: 5},
  sectionHeader: {borderRadius: 5, fontSize: 16, fontWeight: 'bold'},
  header: {flexDirection: 'row', alignItems: 'center'},
  row: {marginLeft: 10, flexDirection: 'row'},
  name: {fontSize: 16},
  fadeText: {opacity: 0.6},
});
