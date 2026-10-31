import React from 'react';
import {StyleSheet, View} from 'react-native';
import {LargeList} from '../../components/Scrolling';
import {ListItem, Spinkit, TextButton} from '../../components';
import Text from '../../components/Text';
import {ITEM_HEIGHT} from '../../theme/constants';
import {searchEntities} from '../../services/searchEntities';
import type {EntityKind, SearchEntity} from '../../services/searchEntities';
import type {OnlineProvider} from '../../services/providers';
import trackDescription from '../../services/trackDescription';
import searchTypes from '../../services/searchTypes';
import queue from '../../player/videoActions';
import type {Navigation} from '../../navigation/types';

export interface EntitySearchProps {
  search: string;
  api: OnlineProvider;
  index: number;
  navigation: Pick<Navigation, 'navigate'>;
}
interface Props extends EntitySearchProps {
  kind: EntityKind;
}
interface State {
  data: SearchEntity[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
}

export default class EntitySearchResults extends React.PureComponent<Props, State> {
  state: State = {data: [], loading: false, error: null, hasMore: false};
  requestId = 0;
  offset = 0;
  pending = false;
  searched = false;
  list: LargeList<SearchEntity> | null = null;

  componentDidMount() {
    if (this.active()) this.search();
  }
  componentDidUpdate(previous: Props) {
    if (previous.api !== this.props.api || previous.search !== this.props.search) {
      this.requestId++;
      this.searched = false;
      this.pending = false;
      this.setState({data: [], loading: false, error: null, hasMore: false});
    }
    if (this.active() && !this.searched) this.search();
  }
  componentWillUnmount() {
    this.requestId++;
  }
  active() {
    return this.props.index === searchTypes[this.props.kind];
  }

  search = () => {
    this.searched = true;
    const requestId = ++this.requestId;
    this.offset = 0;
    this.pending = false;
    if (!this.props.search) {
      this.setState({data: [], loading: false, error: null, hasMore: false});
      return;
    }
    this.setState({data: [], loading: true, error: null, hasMore: false});
    return this.fetchPage(requestId);
  };
  fetchPage = async (requestId = this.requestId) => {
    if (this.pending) return;
    this.pending = true;
    const {api, search: query, kind} = this.props;
    try {
      const result = await searchEntities({query, api, kind, offset: this.offset});
      if (requestId !== this.requestId) return;
      this.offset = result.offset;
      this.setState((state) => ({
        data: [...state.data, ...result.items],
        loading: false,
        error: null,
        hasMore: result.hasMore,
      }));
      this.list?.endLoading(!result.hasMore);
    } catch (reason) {
      if (requestId !== this.requestId) return;
      const error = reason instanceof Error ? reason : new Error(String(reason));
      this.setState({loading: false, error});
      this.list?.endLoading();
    } finally {
      if (requestId === this.requestId) this.pending = false;
    }
  };
  loadMore = () => {
    if (this.state.hasMore && !this.state.error) return this.fetchPage();
  };
  open = (item: SearchEntity) => {
    const {kind, api, navigation} = this.props;
    if (kind === 'mvs') queue.playMV((api === 'netEase' ? item.id : item.v_id)!, api);
    else if (kind === 'playlists') navigation.navigate('Playlist', {playlist: item, api});
    else if (kind === 'albums') navigation.navigate('AlbumPage', {item, api});
    else navigation.navigate('ArtistPage', {item, api});
  };
  renderItem = ({row}: {row: number}) => {
    const item = this.state.data[row];
    const description = trackDescription({
      item,
      api: this.props.api,
      page: searchTypes[this.props.kind],
    });
    return <ListItem {...description} onPress={() => this.open(item)} />;
  };
  renderStatus = () => {
    if (this.state.error)
      return (
        <View style={styles.status}>
          <Text selectable>{this.state.error.message}</Text>
          <TextButton text="重试" onPress={() => this.fetchPage()} style={{padding: 12}} />
        </View>
      );
    return this.state.data.length ? null : <Text style={styles.status}>无搜索结果</Text>;
  };
  render() {
    if (this.state.loading) return <Spinkit />;
    return (
      <LargeList
        key={this.props.api + ':' + this.props.search}
        ref={(list) => {
          this.list = list;
        }}
        data={[{items: this.state.data}]}
        heightForIndexPath={() => ITEM_HEIGHT}
        renderIndexPath={this.renderItem}
        renderFooter={this.renderStatus}
        onLoading={this.state.hasMore && !this.state.error ? this.loadMore : undefined}
      />
    );
  }
}
const styles = StyleSheet.create({status: {padding: 20, alignItems: 'center'}});
