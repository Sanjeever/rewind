import * as React from 'react';
import * as reactNativeLargelist from './../components/Scrolling.js';
import * as components from '../components/index';
import ParallaxList from '../components/ParallaxList';
import providers from '../services/providers';
import * as constants from '../theme/constants';
import icons from '../theme/icons';
import PlaylistSearchResults from './../modules/PlaylistSearchResults';
import * as services from '../services/index';
import PlaylistFilters from './../modules/PlaylistFilters.js';
const type = '全部歌单';
class HotPlaylist extends React.PureComponent {
  _savedType = null;
  onTop = () => {
    this._list?.scrollTo({
      x: 0,
      y: 0,
    });
  };
  state = {
    data: [],
    loading: true,
    mainModalShow: false,
    type,
    page: 0,
    search: '',
    submittedSearch: '',
  };
  getPlaylists = (e) => {
    services.Netease.topPlaylist({
      category: e,
    }).then(({code, playlists}) => {
      if (code === 200 && playlists.length > 0) {
        this.setState({
          data: playlists,
          loading: false,
        });
      }
      this._list.endLoading?.();
    });
  };
  getMore = () => {
    this.setState(
      {
        page: this.state.page + 1,
      },
      () => {
        const page = this.state.page;
        this.morePlaylists(this.state.type, page);
      },
    );
  };
  morePlaylists = (e, t) => {
    services.Netease.topPlaylist({
      category: e,
      offset: 30 * t,
    }).then(({code, playlists}) => {
      if (code === 200 && playlists) {
        this.setState({
          data: this.state.data.concat(playlists),
          loading: false,
        });
      }
      this._list.endLoading?.();
    });
  };
  onType = (e) => {
    this.setState({
      type: e,
      mainModalShow: false,
      loading: true,
      data: [],
      search: '',
      submittedSearch: '',
    });
    this.getPlaylists(e);
    this.onTop();
  };
  Playlist = (playlist) => {
    this.props.navigation.navigate('Playlist', {
      api: providers.netEase,
      playlist,
    });
  };
  onChangeText = (search) => {
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
    this._savedType = this.state.type;
    this.setState({
      type: 'search',
      mainModalShow: false,
      submittedSearch: '',
    });
  };
  formatItem = function (e) {
    const a = {};
    a.title = e.name;
    a.subtitle = `${e.creator?.nickname} | ${e.playCount}`;
    a.img = `${e.coverImgUrl}?param=150y150`;
    return a;
  };
  _renderIndexPath = ({row}) => {
    const data = this.state.data;
    return this._renderItem({
      item: data[row],
      index: row,
    });
  };
  _renderItem = ({item, index}) => {
    const i = this.formatItem(item);
    return (
      <components.ListItem
        key={index}
        title={i.title}
        subtitle={i.subtitle}
        img={i.img}
        onPress={() => {
          return this.Playlist(item, providers.netEase);
        }}
      />
    );
  };
  componentDidMount() {
    this.getPlaylists();
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
              return (this._list = t);
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
