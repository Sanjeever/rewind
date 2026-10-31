import Text from './../../components/Text.js';
import _default2 from './../../components/Pager.js';
import * as immer from 'immer';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeLargelist from './../../components/Scrolling.js';
import * as components from '../../components/index';
import PlaylistTabs from '../../components/PlaylistTabs';
import * as constants from '../../theme/constants';
import icons from '../../theme/icons';
import locales from '../../locales/index';
import playlistFiles from '../../storage/playlistFiles';
import CreatePlaylist from '../../modals/CreatePlaylist';
import netease from '../../../assets/images/netease.png';
import qqmusic from '../../../assets/images/qqmusic.png';
const b = {
  custom: '无本地歌单，点击创建。',
  netEase: '无网易云歌单，点击获取',
  qqMusic: '无QQ音乐歌单，点击获取',
};
class Playlists extends React.PureComponent {
  _nativeOffset = {
    x: new ReactNative.Animated.Value(0),
    y: new ReactNative.Animated.Value(0),
  };
  state = {
    custom: [],
    showModal: false,
  };
  renderPagerContent = () => {
    return this.props.apisOrder.map((e) => this.renderContent(e));
  };
  renderContent = (e) => {
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
              return (this[`_${e}ScrollView]`] = t);
            }}
            onRefresh={() => {
              return onRefresh(e, this[`_${e}ScrollView]`]);
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
              return this[`_render_${e}`]({
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
              return (this._customScrollView = e);
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
  onHeader = (e) => {
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
  createPL = async ({title, img}) => {
    const playlists = [
      ...this.state.custom,
      {
        title,
        img,
        tracks: [],
      },
    ];
    await playlistFiles.toPlaylist({
      playlists,
    });
    this.setState({
      custom: playlists,
      showModal: false,
    });
  };
  refreshLocal = () => {
    return this.loadLocalPlaylist();
  };
  loadLocalPlaylist = async () => {
    try {
      const {playlists} = await playlistFiles.getPlaylist();
      this.setState({
        custom: playlists,
      });
    } finally {
      this._customScrollView?.endRefresh();
    }
  };
  alertDeleteLocalPL = (e, t) => {
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
  deleteLocalPL = async (e) => {
    const t = immer.produce(this.state.custom, function (t) {
      t.splice(e, 1);
    });
    await playlistFiles.toPlaylist({
      playlists: t,
    });
    this.setState({
      custom: t,
    });
  };
  emptyTip = (e) => {
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
  onEmptyTip = (e) => {
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
  renderHeader = (e) => {
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
  _renderLocal = ({item, index}) => {
    return (
      <components.ListItem
        errorIconName={icons.DISC}
        img={item.img}
        key={index}
        title={item.title}
        subtitle={item.tracks.length}
        onPress={() => {
          return this.props.Playlist(item, 'local', index);
        }}
        onLongPress={() => {
          return this.alertDeleteLocalPL(item, index);
        }}
      />
    );
  };
  _render_netEase = ({item, index}) => {
    let title = item.name?.length > 0 && index === 0 ? '♡' : item.name;
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
  _render_qqMusic = ({item, index}) => {
    const a = this.formatItem(item, index);
    return (
      <components.ListItem
        img={a.picurl}
        title={a.title}
        subtitle={a.num}
        onPress={() => {
          return this.props.Playlist(a, 'qqMusic', index);
        }}
      />
    );
  };
  formatItem = function (e, t) {
    const r = {};
    if (e.title) {
      r.title = e.title?.length > 0 && t === 0 ? '♡' : e.title;
      r.picurl = e.picurl !== '' ? e.picurl : null;
      r.num = e.subtitle !== '' ? e.subtitle.replace(/\u9996.+/, '') : null;
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
    this.loadLocalPlaylist();
  }
  render() {
    const e = this;
    return (
      <ReactNative.View
        style={{
          flex: 1,
        }}
      >
        {React.createElement(
          _default2,
          {
            ref: (instance) => (this.viewPager = instance),
            style: {
              flex: 1,
            },
            initialPage: 1,
          },
          this.renderPagerContent(),
        )}
        <CreatePlaylist
          showModal={this.state.showModal}
          closeModal={function () {
            return e.setState({
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
var P = ReactNative.StyleSheet.create({
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
