import * as React from 'react';
import * as reactNativeLargelist from './../components/Scrolling';
import * as components from '../components/index';
import ParallaxList from '../components/ParallaxList';
import providers from '../services/providers';
import * as constants from '../theme/constants';
import icons from '../theme/icons';
import PlaylistSearchResults from '../features/search/PlaylistSearchResults';
import * as services from '../services/index';
import PlaylistFilters from './../modules/PlaylistFilters';
import type {Playlist} from '../storage/models';
import type {ScreenProps} from '../navigation/types';
import {toast} from '../native/toast';
import {errorMessage} from '../utils/types';
const type = '全部歌单';
interface State {
  data: Playlist[];
  loading: boolean;
  mainModalShow: boolean;
  type: string;
  page: number;
  search: string;
  submittedSearch: string;
}
class HotPlaylist extends React.PureComponent<ScreenProps<'HotPlaylist'>, State> {
  _list: reactNativeLargelist.LargeList<Playlist> | null = null;
  _savedType: string | null = null;
  requestId = 0;
  pending = false;
  onTop = () => {
    this._list?.scrollTo({
      x: 0,
      y: 0,
    });
  };
  state: State = {
    data: [],
    loading: true,
    mainModalShow: false,
    type,
    page: 0,
    search: '',
    submittedSearch: '',
  };
  getPlaylists = async (e?: string) => {
    const request = ++this.requestId;
    this.pending = false;
    try {
      const {code, playlists} = await services.Netease.topPlaylist({
        category: e,
      });
      if (request !== this.requestId) return;
      if (code !== 200 || !playlists) throw new Error('歌单读取失败（' + code + '）');
      if (code === 200 && playlists) {
        this.setState({
          data: playlists,
          loading: false,
        });
      }
      this._list?.endLoading();
    } catch (error) {
      if (request === this.requestId) {
        this.setState({loading: false});
        toast(errorMessage(error));
      }
    }
  };
  getMore = async () => {
    if (this.pending) return;
    this.pending = true;
    const request = this.requestId;
    const page = this.state.page + 1;
    try {
      await this.morePlaylists(this.state.type, page);
    } finally {
      if (request === this.requestId) this.pending = false;
    }
  };
  morePlaylists = async (e: string, t: number) => {
    const request = this.requestId;
    try {
      const {code, playlists} = await services.Netease.topPlaylist({
        category: e,
        offset: 30 * t,
      });
      if (request !== this.requestId) return;
      if (code === 200 && playlists) {
        this.setState((state) => ({
          data: state.data.concat(playlists),
          loading: false,
          page: t,
        }));
      }
      this._list?.endLoading(!playlists?.length);
    } catch (error) {
      if (request === this.requestId) {
        this._list?.endLoading();
        toast(errorMessage(error));
      }
    }
  };
  onType = (e: string) => {
    this.setState({
      type: e,
      mainModalShow: false,
      loading: true,
      data: [],
      page: 0,
      search: '',
      submittedSearch: '',
    });
    this.getPlaylists(e);
    this.onTop();
  };
  Playlist = (playlist: Playlist) => {
    this.props.navigation.navigate('Playlist', {
      api: providers.netEase,
      playlist,
    });
  };
  onChangeText = (search: string) => {
    this.setState({
      search,
    });
  };
  onSubmitEditing = () => {
    const search = this.state.search;
    if (search?.length > 0) {
      this.setState({
        submittedSearch: search,
      });
    }
  };
  onSearch = () => {
    this.requestId++;
    this._savedType = this.state.type;
    this.setState({
      type: 'search',
      mainModalShow: false,
      submittedSearch: '',
      loading: false,
    });
  };
  formatItem = function (e: Playlist) {
    const a: {title?: string; subtitle?: string; img?: string} = {};
    a.title = e.name;
    a.subtitle = `${e.creator?.nickname} | ${e.playCount}`;
    a.img = `${e.coverImgUrl}?param=150y150`;
    return a;
  };
  _renderIndexPath = ({row}: {row: number}) => {
    const data = this.state.data;
    return this._renderItem({
      item: data[row],
      index: row,
    });
  };
  _renderItem = ({item, index}: {item: Playlist; index: number}) => {
    const i = this.formatItem(item);
    return (
      <components.ListItem
        key={index}
        title={i.title}
        subtitle={i.subtitle}
        img={i.img}
        onPress={() => {
          return this.Playlist(item);
        }}
      />
    );
  };
  componentDidMount() {
    this.getPlaylists();
  }
  componentWillUnmount() {
    this.requestId++;
  }
  render() {
    const state = this.state;
    const {loading, type, data, mainModalShow, search} = state;
    return (
      <components.PageContainer
        goBack={() => {
          return this.props.navigation.goBack();
        }}
        onTop={this.onTop}
        title={type}
        rightIcon={{
          name: icons.TAG_OUTLINE,
          onPress: () => {
            return this.setState({
              mainModalShow: !mainModalShow,
            });
          },
        }}
        textInput={type === 'search'}
        onChangeText={this.onChangeText}
        onSubmitEditing={this.onSubmitEditing}
        searchText={search}
        forceShowTextInput={type === 'search'}
        disabledTextInputBtn={true}
        headerBlur={true}
      >
        {loading && (
          <components.Spinkit
            style={{
              position: 'absolute',
              top: 100,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          />
        )}
        {type === 'search' ? (
          <PlaylistSearchResults
            api={providers.netEase}
            search={this.state.submittedSearch}
            index={3}
            navigation={this.props.navigation}
          />
        ) : (
          <reactNativeLargelist.LargeList
            ref={(t) => {
              this._list = t;
            }}
            data={[
              {
                items: data,
              },
            ]}
            onLoading={this.getMore}
            loadingFooter={ParallaxList}
            renderIndexPath={this._renderIndexPath}
            heightForIndexPath={function () {
              return constants.ITEM_HEIGHT;
            }}
          />
        )}
        <PlaylistFilters
          visible={mainModalShow}
          onClose={() => {
            return this.setState({
              mainModalShow: false,
            });
          }}
          onType={this.onType}
          currentType={type}
          onSearch={this.onSearch}
        />
      </components.PageContainer>
    );
  }
}
export default HotPlaylist;
