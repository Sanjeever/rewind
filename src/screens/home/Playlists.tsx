import Text from './../../components/Text';
import Pager from './../../components/Pager';
import * as immer from 'immer';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeLargelist from './../../components/Scrolling';
import * as components from '../../components/index';
import PlaylistTabs from '../../components/PlaylistTabs';
import * as constants from '../../theme/constants';
import icons from '../../theme/icons';
import locales from '../../locales/index';
import playlistFiles from '../../storage/playlistFiles';
import CreatePlaylist from '../../modals/CreatePlaylist';
import netease from '../../../assets/images/netease.png';
import qqmusic from '../../../assets/images/qqmusic.png';
import {toast} from '../../native/toast';
import {errorMessage} from '../../utils/types';
import type {OnlineProvider} from '../../services/providers';
import type {Navigation} from '../../navigation/types';
import type {Playlist, CustomPlaylist} from '../../storage/models';
export type PlaylistTab = 'custom' | OnlineProvider;
export type OpenPlaylist = (
  ...args:
    | [playlist: Playlist, api: OnlineProvider, index: number]
    | [playlist: CustomPlaylist, api: 'local', index: number]
) => void;
interface Props {
  apisOrder: PlaylistTab[];
  netEase: Playlist[];
  qqMusic: Playlist[];
  navigation: Navigation;
  Playlist: OpenPlaylist;
  onRefresh(api: OnlineProvider, list?: reactNativeLargelist.LargeList<Playlist>): Promise<void>;
}
const b = {
  custom: '无本地歌单，点击创建。',
  netEase: '无网易云歌单，点击获取',
  qqMusic: '无QQ音乐歌单，点击获取',
};
class Playlists extends React.PureComponent<Props, {custom: CustomPlaylist[]; showModal: boolean}> {
  active = false;
  lists: Partial<Record<OnlineProvider, reactNativeLargelist.LargeList<Playlist>>> = {};
  _customScrollView: reactNativeLargelist.LargeList<CustomPlaylist> | null = null;
  _nativeOffset = {
    x: new ReactNative.Animated.Value(0),
    y: new ReactNative.Animated.Value(0),
  };
  state: {custom: CustomPlaylist[]; showModal: boolean} = {
    custom: [],
    showModal: false,
  };
  renderPagerContent = () => {
    return this.props.apisOrder.map((e) => this.renderContent(e));
  };
  renderContent = (e: PlaylistTab) => {
    if (e === 'custom') {
      return this.renderCustomContainer();
    }
    const onRefresh = this.props.onRefresh;
    const items = this.props[e];
    return (
      <ReactNative.View key={e}>
        {items?.length > 0 ? (
          <reactNativeLargelist.LargeList
            ref={(t) => {
              if (t) this.lists[e] = t;
              else delete this.lists[e];
            }}
            onRefresh={() => {
              return onRefresh(e, this.lists[e]);
            }}
            refreshHeader={PlaylistTabs}
            renderHeader={() => {
              return this.renderHeader(e);
            }}
            data={[
              {
                items,
              },
            ]}
            heightForIndexPath={function () {
              return constants.ITEM_HEIGHT;
            }}
            renderIndexPath={({row}) => {
              return (e === 'netEase' ? this._render_netEase : this._render_qqMusic)({
                item: items[row],
                index: row,
              });
            }}
            onNativeContentOffsetExtract={this._nativeOffset}
          />
        ) : (
          this.emptyTip(e)
        )}
      </ReactNative.View>
    );
  };
  renderCustomContainer = () => {
    const custom = this.state.custom;
    return (
      <ReactNative.View key={'custom'}>
        {custom?.length > 0 ? (
          <reactNativeLargelist.LargeList
            ref={(e) => {
              this._customScrollView = e;
            }}
            onRefresh={this.refreshLocal}
            refreshHeader={PlaylistTabs}
            renderHeader={() => {
              return this.renderHeader('custom');
            }}
            data={[
              {
                items: custom,
              },
            ]}
            heightForIndexPath={function () {
              return constants.ITEM_HEIGHT;
            }}
            renderIndexPath={({row}) => {
              return this._renderLocal({
                item: custom[row],
                index: row,
              });
            }}
            onNativeContentOffsetExtract={this._nativeOffset}
          />
        ) : (
          this.emptyTip('custom')
        )}
      </ReactNative.View>
    );
  };
  onHeader = (e: PlaylistTab) => {
    let url;
    switch (e) {
      case 'netEase':
        this.props.navigation.navigate('UserManager');
        break;
      case 'qqMusic':
        url = 'https://y.qq.com/';
        this.props.navigation.navigate('WebViewPage', {
          url,
        });
        break;
      case 'custom':
        this.createLocal();
    }
  };
  createLocal = () => {
    this.setState({
      showModal: !this.state.showModal,
    });
  };
  createPL = async ({title, img}: {title: string; img: string}) => {
    try {
      const current = await playlistFiles.getPlaylist();
      const playlists = [
        ...current.playlists,
        {
          title,
          img,
          tracks: [],
        },
      ];
      await playlistFiles.toPlaylist({
        ...current,
        playlists,
      });
      this.setState({
        custom: playlists,
        showModal: false,
      });
    } catch (error) {
      toast('创建歌单失败：' + errorMessage(error));
    }
  };
  refreshLocal = () => {
    return this.loadLocalPlaylist();
  };
  loadLocalPlaylist = async () => {
    try {
      const {playlists} = await playlistFiles.getPlaylist();
      if (!this.active) return;
      this.setState({
        custom: playlists,
      });
    } catch (error) {
      if (this.active) toast('读取歌单失败：' + errorMessage(error));
    } finally {
      this._customScrollView?.endRefresh();
    }
  };
  alertDeleteLocalPL = (_item: CustomPlaylist, t: number) => {
    ReactNative.Alert.alert(locales.CONFIRM_DELETE_CUSTOM_MIX, locales.CAN_NOT_RECOVER, [
      {
        text: locales.CANCEL,
        onPress: function () {
          return null;
        },
        style: 'cancel',
      },
      {
        text: locales.CONFIRM,
        onPress: () => {
          return this.deleteLocalPL(t);
        },
      },
    ]);
  };
  deleteLocalPL = async (e: number) => {
    try {
      const current = await playlistFiles.getPlaylist();
      const t = immer.produce(current.playlists, function (t) {
        t.splice(e, 1);
      });
      await playlistFiles.toPlaylist({
        ...current,
        playlists: t,
      });
      this.setState({
        custom: t,
      });
    } catch (error) {
      toast('删除歌单失败：' + errorMessage(error));
    }
  };
  emptyTip = (e: PlaylistTab) => {
    return (
      <reactNativeLargelist.SpringScrollView
        contentStyle={{
          flex: 1,
        }}
      >
        {this.renderHeader(e)}
        <ReactNative.View
          style={{
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <ReactNative.TouchableNativeFeedback
            onPress={() => {
              return this.onEmptyTip(e);
            }}
          >
            <ReactNative.View style={P.btnCon}>
              <Text style={P.labelText}>{b[e]}</Text>
            </ReactNative.View>
          </ReactNative.TouchableNativeFeedback>
        </ReactNative.View>
      </reactNativeLargelist.SpringScrollView>
    );
  };
  onEmptyTip = (e: PlaylistTab) => {
    switch (e) {
      case 'netEase':
        this.props.navigation.navigate('NeteaseLogin');
        break;
      case 'qqMusic':
        this.props.navigation.navigate('QQMusicLogin');
        break;
      case 'custom':
        this.createLocal();
    }
  };
  renderHeader = (e: PlaylistTab) => {
    let source;
    switch (e) {
      case 'netEase':
        source = netease;
        break;
      case 'qqMusic':
        source = qqmusic;
    }
    return (
      <ReactNative.Animated.View
        style={[
          P.headerCon,
          {
            alignItems: 'center',
            justifyContent: 'center',
          },
          {
            opacity: this._nativeOffset.y.interpolate({
              inputRange: [-80, 0],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            }),
          },
        ]}
      >
        {source ? (
          <ReactNative.TouchableOpacity
            onPress={() => {
              return this.onHeader(e);
            }}
          >
            <ReactNative.Image
              source={source}
              style={{
                height: 22,
                width: 22,
              }}
            />
          </ReactNative.TouchableOpacity>
        ) : (
          <components.Icon
            name={icons.DISC}
            onPress={() => {
              return this.onHeader(e);
            }}
          />
        )}
      </ReactNative.Animated.View>
    );
  };
  _renderLocal = ({item, index}: {item: CustomPlaylist; index: number}) => {
    return (
      <components.ListItem
        errorIconName={icons.DISC}
        img={item.img}
        key={index}
        title={item.title}
        subtitle={String(item.tracks.length)}
        onPress={() => {
          return this.props.Playlist(item, 'local', index);
        }}
        onLongPress={() => {
          return this.alertDeleteLocalPL(item, index);
        }}
      />
    );
  };
  _render_netEase = ({item, index}: {item: Playlist; index: number}) => {
    let title = item.name && index === 0 ? '♡' : item.name || '';
    if ((title = title.replace(/\s\u6700\u61c2\u4f60.+\u9996$/, '')).includes('私人雷达')) {
      title = '[私人雷达]';
    }
    return (
      <components.ListItem
        img={`${item.coverImgUrl}?param=200y200`}
        title={title}
        subtitle={`${item.trackCount} ${locales.SONG_COUNT}`}
        onPress={() => {
          return this.props.Playlist(item, 'netEase', index);
        }}
      />
    );
  };
  _render_qqMusic = ({item, index}: {item: Playlist; index: number}) => {
    const a = this.formatItem(item, index);
    return (
      <components.ListItem
        img={a.picurl}
        title={a.title}
        subtitle={a.num == null ? undefined : String(a.num)}
        onPress={() => {
          return this.props.Playlist(a, 'qqMusic', index);
        }}
      />
    );
  };
  formatItem = function (e: Playlist, t: number) {
    const r: Playlist & {num?: string | number} = {};
    if (e.title) {
      r.title = e.title?.length > 0 && t === 0 ? '♡' : e.title;
      r.picurl = e.picurl || undefined;
      r.num = e.subtitle ? e.subtitle.replace(/首.+/, '') : undefined;
      r.id = e.id || e.dissid;
      r.dirid = e.dirid;
    } else {
      r.title = e.dissname;
      r.num = e.songnum;
      r.picurl = e.logo;
      r.id = e.dissid;
      r.dirid = e.dirid;
    }
    return r;
  };
  componentDidMount() {
    this.active = true;
    this.loadLocalPlaylist();
  }
  componentWillUnmount() {
    this.active = false;
  }
  render() {
    return (
      <ReactNative.View
        style={{
          flex: 1,
        }}
      >
        {React.createElement(
          Pager,
          {
            style: {
              flex: 1,
            },
            initialPage: 1,
          },
          this.renderPagerContent(),
        )}
        <CreatePlaylist
          showModal={this.state.showModal}
          closeModal={() => {
            return this.setState({
              showModal: false,
            });
          }}
          createPL={this.createPL}
        />
      </ReactNative.View>
    );
  }
}
export default Playlists;
const P = ReactNative.StyleSheet.create({
  headerCon: {
    height: 30,
    padding: 5,
    alignItems: 'center',
    flexDirection: 'row',
  },
  labelText: {
    fontSize: 13,
    opacity: 0.9,
  },
  btnCon: {
    height: 50,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
