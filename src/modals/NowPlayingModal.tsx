import {choosePlaylist, savePicture, showTrackDetails, subscribeModal} from './commands';
import {playTracks, removeFromPlaybackQueue, insertTracks} from '../player/commands';
import SongRow from '../features/tracks/SongRow';
import * as React from 'react';
import * as ReactNative from 'react-native';
import FadingEdge from '../components/FadingEdge';
import * as reactNativeLargelist from './../components/Scrolling';
import * as components from '../components/index';
import * as constants from '../theme/constants';
import icons from '../theme/icons';
import tabIcons from '../theme/tabIcons';
import locales from '../locales/index';
import * as utils from '../utils/index';
import '../utils/types';
import * as b from '../services/trackInfo';
import type {Provider} from '../services/providers';
import type {TrackFields} from '../services/track';
import type {Subscription} from '../events/Emitter';
import {clearQueue} from '../player/commands';
import Text from '../components/Text';
import {motion, ReducedMotionContext} from '../theme/motion';
import parseArtist from '../utils/parseArtist';
const x = {
  normal: 'normal',
  deleting: 'deleting',
  filtering: 'filtering',
} as const;
type Mode = (typeof x)[keyof typeof x];
interface Props {
  data: readonly TrackFields[];
  api: Provider;
  index: number;
  songItem: TrackFields | null;
  show: boolean;
  isRound: boolean;
  setDisplayNowPlaying(show: boolean): void;
}
class NowPlayingModal extends React.PureComponent<
  Props,
  {filterText: string; filterList: TrackFields[]; mode: Mode; expanded: boolean; presented: boolean}
> {
  static contextType = ReducedMotionContext;
  context = false;
  progress = new ReactNative.Animated.Value(0);
  positioned = false;
  onListReady = () => {
    if (this.positioned || !this.props.show) return;
    this.positioned = true;
    this.scrollTo();
  };
  sub?: Subscription;
  _list: reactNativeLargelist.LargeList<TrackFields> | null = null;
  state = {
    filterText: '',
    filterList: [] as TrackFields[],
    mode: x.normal as Mode,
    expanded: false,
    presented: this.props.show,
  };
  animate = (toValue: number, done?: () => void) => {
    this.progress.stopAnimation();
    if (this.context) {
      this.progress.setValue(toValue);
      done?.();
      return;
    }
    ReactNative.Animated.timing(this.progress, {
      toValue,
      duration: motion.panel,
      useNativeDriver: true,
    }).start(({finished}) => {
      if (finished) done?.();
    });
  };
  toggleExpanded = () => {
    ReactNative.Keyboard.dismiss();
    if (!this.context)
      ReactNative.LayoutAnimation.configureNext(ReactNative.LayoutAnimation.Presets.easeInEaseOut);
    this.setState((state) => ({
      expanded: !state.expanded,
      mode: x.normal,
      filterText: '',
      filterList: [],
    }));
  };
  handledBack = () => {
    return (
      this.state.mode !== x.normal &&
      (this.setState({
        mode: x.normal,
        filterText: '',
        filterList: [],
      }),
      true)
    );
  };
  onClose = () => {
    ReactNative.Keyboard.dismiss();
    if (this.handledBack()) return;
    if (this.state.expanded) this.toggleExpanded();
    else this.forceClose();
  };
  forceClose = () => {
    const props = this.props;
    const e_setDisplayNowPlaying = props.setDisplayNowPlaying;
    if (props.show !== false) {
      e_setDisplayNowPlaying(false);
    }
  };
  onSubmitEditing = () => {
    const filterText = this.state.filterText;
    const data = this.props.data;
    if (filterText.length > 0) {
      const filterList = utils.filterHelper.quickSearch(
        data.map((track) => ({...track})),
        filterText,
      );
      this.setState({
        filterList,
      });
    } else {
      this.setState({
        filterList: [],
      });
    }
  };
  onChangeText = (filterText: string) => {
    this.setState(
      {
        filterText,
      },
      this.onSubmitEditing,
    );
  };
  changePlaylist = function () {
    choosePlaylist();
  };
  onMode = (mode: Mode) => {
    if (mode !== x.filtering) ReactNative.Keyboard.dismiss();
    this.setState((state) => ({
      mode,
      expanded: true,
      filterText: mode === x.normal ? '' : state.filterText,
      filterList: mode === x.normal ? [] : state.filterList,
    }));
  };
  renderTools = () => {
    switch (this.state.mode) {
      case x.normal:
        return (
          <React.Fragment>
            <components.Icon
              name={icons.MAGNIFY}
              accessibilityLabel="搜索队列"
              accessibilityRole="button"
              style={{minWidth: 48, minHeight: 48}}
              onPress={() => {
                return this.onMode(x.filtering);
              }}
            />
            <components.Icon
              name={tabIcons.DISC.name}
              accessibilityLabel="切换歌单"
              accessibilityRole="button"
              style={{minWidth: 48, minHeight: 48}}
              onPress={this.changePlaylist}
            />
            <components.Icon
              name={icons.DELETE_OUTLINE}
              accessibilityLabel="管理队列"
              accessibilityRole="button"
              style={{minWidth: 48, minHeight: 48}}
              onPress={() => {
                return this.onMode(x.deleting);
              }}
              containerStyle={{
                marginRight: 3,
              }}
            />
          </React.Fragment>
        );
      case x.deleting:
        return (
          <React.Fragment>
            <components.Icon
              name={icons.ARROW_LEFT}
              accessibilityLabel="退出队列管理"
              style={{minWidth: 48, minHeight: 48}}
              onPress={() => {
                return this.onMode(x.normal);
              }}
            />
            <components.Icon
              name={icons.NOTIFICATION_CLEAR_ALL}
              accessibilityLabel="清空队列"
              style={{minWidth: 48, minHeight: 48}}
              onPress={this.onClear}
              containerStyle={{
                marginRight: 3,
              }}
            />
          </React.Fragment>
        );
      case x.filtering:
        return (
          <React.Fragment>
            <components.Icon
              name={icons.ARROW_LEFT}
              accessibilityLabel="退出队列搜索"
              style={{minWidth: 48, minHeight: 48}}
              onPress={() => {
                return this.onMode(x.normal);
              }}
            />
            <components.Input
              autoFocus={true}
              style={E.textInput}
              onChangeText={this.onChangeText}
              onSubmitEditing={this.onSubmitEditing}
              placeholder={locales.FILTER}
              accessibilityLabel="搜索队列"
            />
          </React.Fragment>
        );
    }
  };
  onClear = () => {
    clearQueue();
    this.forceClose();
  };
  _renderIndexPath = ({row}: {row: number}) => {
    const filterList = this.state.filterList;
    if (this.props.data.length !== 0) {
      let r: readonly TrackFields[] = this.props.data;
      let showPlaying = true;
      if (this.state.filterText.length > 0) {
        r = filterList;
        showPlaying = false;
      }
      return this.renderItem({
        item: r[row],
        index: row,
        showPlaying,
      });
    }
  };
  onCover = () => {
    const songItem = this.props.songItem;
    if (!songItem) return;
    const t = b.extractFullInfo(songItem, 'big');
    savePicture({
      img: t.img,
      song: songItem.name,
    });
  };
  scrollTo = () => {
    const index = this.props.index;
    this._list?.scrollTo({x: 0, y: constants.ITEM_HEIGHT * index, animated: false});
  };
  renderItem = ({
    item,
    index,
    showPlaying,
  }: {
    item: TrackFields;
    index: number;
    showPlaying: boolean;
  }) => {
    const o = b.extractFullInfo(item);
    const i = this.getSongRowExtra(item, index);
    const api = this.props.api;
    return (
      <SongRow
        song={o.song}
        singer={o.singer}
        album={o.album}
        index={index}
        playing={showPlaying && this.props.index === index}
        onPress={() => {
          return this.playFiltedMusic(item, api);
        }}
        addToQueue={() => {
          return this.addToQueue(item);
        }}
        alias={o.alias}
        {...i}
      />
    );
  };
  getSongRowExtra = (e: TrackFields, t: number) => {
    const api = this.props.api;
    if (this.state.mode === x.deleting) {
      return {
        deleteBtn: () => {
          return this.deleteFromQueue(e, t);
        },
      };
    }
    return {
      detail: function () {
        return showTrackDetails({song: e, index: t, api});
      },
    };
  };
  playFiltedMusic = (e: TrackFields, api: Provider) => {
    const data = this.props.data;
    const o = data.findIndex((t) => b.getTrackKey(e, api) === b.getTrackKey(t, api));
    if (o < 0) return;
    playTracks({song: e, tracks: data, index: o, api});
  };
  deleteFromQueue = (e: TrackFields, _index: number) => {
    const props = this.props;
    const n_api = props.api;
    if (b.getTrackKey(e, n_api) !== b.getTrackKey(props.data[props.index], n_api)) {
      removeFromPlaybackQueue({
        item: e,
        api: n_api,
      });
    }
  };
  addToQueue = (e: TrackFields) => {
    const props = this.props;
    const n_api = props.api;
    if (b.getTrackKey(e, n_api) !== b.getTrackKey(props.data[props.index], n_api)) {
      insertTracks({tracks: [e], api: n_api});
    }
  };
  componentDidMount() {
    if (this.props.show) this.animate(1);
    this.sub = subscribeModal('NowPlayingModal', (t) => {
      if (t.forceClose === true) {
        this.forceClose();
      }
    });
  }
  componentDidUpdate(previous: Props) {
    if (previous.show === this.props.show) return;
    if (this.props.show) {
      this.positioned = false;
      this.setState(
        {presented: true, expanded: false, mode: x.normal, filterText: '', filterList: []},
        () => {
          this.animate(1);
          this.scrollTo();
        },
      );
    } else {
      this.animate(0, () =>
        this.setState({
          presented: false,
          expanded: false,
          mode: x.normal,
          filterText: '',
          filterList: [],
        }),
      );
    }
  }
  componentWillUnmount() {
    this.progress.stopAnimation();
    this.sub?.remove();
  }
  render() {
    const props = this.props;
    const {songItem, data, isRound} = props;
    const state = this.state;
    const {filterList, filterText} = state;
    if (!songItem) {
      return null;
    }
    const g = b.extractFullInfo(songItem, 'big');
    const h = filterText.length > 0;
    return (
      <ReactNative.Modal
        animationType="none"
        transparent={true}
        onRequestClose={this.onClose}
        visible={state.presented}
        onShow={this.scrollTo}
      >
        <ReactNative.KeyboardAvoidingView
          behavior="height"
          style={{flex: 1, justifyContent: 'flex-end'}}
        >
          <ReactNative.Animated.View
            pointerEvents="none"
            style={[
              ReactNative.StyleSheet.absoluteFill,
              {backgroundColor: 'rgba(0,0,0,0.6)', opacity: this.progress},
            ]}
          />
          <ReactNative.Pressable
            accessibilityLabel="关闭播放队列"
            onPress={this.forceClose}
            style={ReactNative.StyleSheet.absoluteFill}
          />
          <ReactNative.Animated.View
            style={[
              E.container,
              {
                height: state.expanded ? '92%' : '62%',
                opacity: this.progress,
                transform: [
                  {
                    translateY: this.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [80, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <ReactNative.View style={E.header}>
              <ReactNative.View style={{flex: 1}}>
                <Text style={{fontSize: 18, fontWeight: '600'}}>播放队列</Text>
                <Text style={{fontSize: 12, opacity: 0.6, marginTop: 4}}>{data.length} 首</Text>
              </ReactNative.View>
              <components.TouchableBorderless
                accessibilityLabel={state.expanded ? '收起队列' : '展开队列'}
                onPress={this.toggleExpanded}
              >
                <components.Icon
                  name={state.expanded ? icons.FULLSCREEN_EXIT : icons.FULLSCREEN}
                  size={22}
                />
              </components.TouchableBorderless>
              <components.TouchableBorderless
                accessibilityLabel="关闭播放队列"
                onPress={this.forceClose}
              >
                <components.Icon name={icons.WINDOW_CLOSE} size={22} />
              </components.TouchableBorderless>
            </ReactNative.View>
            <ReactNative.TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="定位当前歌曲"
              onPress={this.scrollTo}
              onLongPress={this.onCover}
              style={E.current}
            >
              <ReactNative.Image
                source={{uri: g.img}}
                style={{width: 40, height: 40, borderRadius: isRound ? 20 : 6}}
              />
              <ReactNative.View style={{flex: 1, gap: 4}}>
                <Text numberOfLines={1} style={{fontSize: 14}}>
                  {g.song}
                </Text>
                <Text numberOfLines={1} style={{fontSize: 12, opacity: 0.6}}>
                  {parseArtist(g.singer)}
                </Text>
              </ReactNative.View>
            </ReactNative.TouchableOpacity>
            <ReactNative.View style={E.btnsBar}>{this.renderTools()}</ReactNative.View>
            <FadingEdge top={8} bottom={12}>
              <reactNativeLargelist.LargeList
                ref={(t) => {
                  this._list = t;
                }}
                data={[
                  {
                    items: h ? filterList : data,
                  },
                ]}
                heightForIndexPath={function () {
                  return constants.ITEM_HEIGHT;
                }}
                renderIndexPath={this._renderIndexPath}
                getItemLayout={(_, index) => ({
                  length: constants.ITEM_HEIGHT,
                  offset: Math.max(0, index - 1) * constants.ITEM_HEIGHT,
                  index,
                })}
                keyboardShouldPersistTaps="handled"
                onContentSizeChange={this.onListReady}
                renderEmpty={() => (
                  <Text style={{padding: 24, opacity: 0.6}}>{h ? '无匹配歌曲' : '队列为空'}</Text>
                )}
              />
            </FadingEdge>
          </ReactNative.Animated.View>
        </ReactNative.KeyboardAvoidingView>
      </ReactNative.Modal>
    );
  }
}
const E = ReactNative.StyleSheet.create({
  container: {
    backgroundColor: '#171717',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    paddingBottom: 12,
  },
  text: {
    fontSize: 15,
  },
  header: {
    paddingLeft: 20,
    paddingRight: 8,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  current: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  btnsBar: {
    height: 48,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 4,
  },
  textInput: {
    height: '100%',
    flex: 1,
    fontSize: 16,
  },
});
export default NowPlayingModal;
