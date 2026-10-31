import React from 'react';
import {LargeList} from '../components/Scrolling';
import {ListItem, Spinkit} from '../components';
import {Netease} from '../services';
import {emitter} from '../events';
import names from '../events/names';
import {ITEM_HEIGHT} from '../theme/constants';
import {toast} from '../native/toast';
import {errorMessage} from '../utils/types';
import locales from '../locales';
import type {Subscription} from '../events/Emitter';
import type {Navigation} from '../navigation/types';
import type {Provider} from '../services/providers';
import type {SearchEntity} from '../services/searchEntities';
import type {Artist} from '../services/track';

export interface SubscriptionItem extends SearchEntity {
  artists?: Artist[];
  albumname?: string;
  albumSize?: number;
  singername?: string;
  songnum?: number;
}
type Props = {index: number; searchText: string; navigation: Navigation} & (
  | {type: 'artist'; onArtist(item: SubscriptionItem, api: Provider): void}
  | {type: 'album'; onAlbum(item: SubscriptionItem, api: Provider): void}
);
interface State {
  data: SubscriptionItem[];
  initData: SubscriptionItem[];
  loaded: boolean;
}
export default class Subscriptions extends React.PureComponent<Props, State> {
  state: State = {data: [], initData: [], loaded: false};
  list: LargeList<SubscriptionItem> | null = null;
  subscription!: Subscription;
  requestId = 0;
  offset = 0;
  pending = false;
  componentDidMount() {
    this.subscription = emitter.addListener(names.UserLogined, this.loadData);
    this.loadData();
  }
  componentDidUpdate(previous: Props) {
    if (previous.searchText !== this.props.searchText) this.searchSong(this.props.searchText);
  }
  componentWillUnmount() {
    this.requestId++;
    this.subscription.remove();
  }
  onTop = () => this.list?.scrollToBegin();
  searchSong = (query: string) =>
    this.setState({
      data: query ? this.filterList(query, this.state.initData) : this.state.initData,
    });
  filterList(query: string, items: SubscriptionItem[]) {
    const pattern = new RegExp(query.replace(/\?/g, '\\?').replace(/\s/, ''), 'gi');
    return items.filter((item) => item.name!.match(pattern));
  }
  loadData = () => {
    const request = ++this.requestId;
    this.offset = 0;
    this.pending = false;
    this.setState({data: [], initData: [], loaded: false});
    return this.fetchPage(request);
  };
  fetchPage = async (request = this.requestId) => {
    if (this.pending) return;
    this.pending = true;
    try {
      const result = await (this.props.type === 'artist'
        ? Netease.sublist_artist({offset: this.offset})
        : Netease.sublist_album({offset: this.offset}));
      if (request !== this.requestId) return;
      if (result.code === 301) {
        toast(locales.NETEASE_NOT_LOGIN);
        this.props.navigation.navigate('NeteaseLogin');
        return;
      }
      if (result.code !== 200 || !result.data) throw new Error(result.message || locales.ERROR);
      const items: SubscriptionItem[] = result.data;
      this.offset += items.length;
      this.setState((state) => {
        const initData = [...state.initData, ...items];
        return {
          initData,
          data: this.props.searchText ? this.filterList(this.props.searchText, initData) : initData,
          loaded: true,
        };
      });
      this.list?.endLoading(!items.length);
    } catch (error) {
      if (request === this.requestId) {
        toast(errorMessage(error));
        this.list?.endLoading();
      }
    } finally {
      if (request === this.requestId) {
        this.pending = false;
        this.setState({loaded: true});
      }
    }
  };
  renderItem = ({row}: {row: number}) => {
    const item = this.state.data[row];
    const isArtist = this.props.type === 'artist';
    const subtitle = isArtist
      ? item.albumSize
        ? `${item.albumSize} ${locales.ALBUM_COUNT}`
        : null
      : item.artists
        ? `${item.artists[0].name}  |  ${item.size} ${locales.SONG_COUNT}`
        : `${item.singername}  |  ${item.songnum}`;
    const image = isArtist
      ? item.img1v1Url
        ? `${item.img1v1Url}?param=200y200`
        : `http://y.gtimg.cn/music/photo_new/T001R150x150M000${item.mid}.jpg`
      : item.picUrl
        ? `${item.picUrl}?param=200y200`
        : item.pic;
    return (
      <ListItem
        title={isArtist ? item.name : item.name || item.albumname}
        subtitle={subtitle}
        img={image}
        onPress={() => {
          const props = this.props;
          if (props.type === 'artist') props.onArtist(item, 'netEase');
          else props.onAlbum(item, 'netEase');
        }}
      />
    );
  };
  render() {
    if (!this.state.loaded) return <Spinkit />;
    return (
      <LargeList
        ref={(list) => {
          this.list = list;
        }}
        data={[{items: this.state.data}]}
        heightForIndexPath={() => ITEM_HEIGHT}
        renderIndexPath={this.renderItem}
        onLoading={() => this.fetchPage()}
      />
    );
  }
}
