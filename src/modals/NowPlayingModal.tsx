import SongRow from '../features/tracks/SongRow';
import * as React from 'react';
import * as ReactNative from 'react-native';
import FadingEdge from '../components/FadingEdge';
import * as reactNativeLargelist from './../components/Scrolling';
import * as components from '../components/index';
import * as constants from '../theme/constants';
import names from '../events/names';
import icons from '../theme/icons';
import tabIcons from '../theme/tabIcons';
import locales from '../locales/index';
import * as events from '../events/index';
import * as utils from '../utils/index';
import '../utils/types';
import * as b from '../services/trackInfo';
import type {Provider} from '../services/providers';
import type {TrackFields} from '../services/track';
import type {Subscription} from '../events/Emitter';
import {clearQueue} from '../player/commands';
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
  {filterText: string; filterList: TrackFields[]; mode: Mode}
> {
  sub?: Subscription;
  _list: reactNativeLargelist.LargeList<TrackFields> | null = null;
  state: {filterText: string; filterList: TrackFields[]; mode: Mode} = {
    filterText: '',
    filterList: [],
    mode: x.normal,
  };
  handledBack = () => {
    return (
      this.state.mode !== x.normal &&
      (this.setState({
        mode: x.normal,
      }),
      true)
    );
  };
  onClose = () => {
    if (!this.handledBack()) {
      this.forceClose();
    }
  };
  forceClose = () => {
    const props = this.props;
    const e_setDisplayNowPlaying = props.setDisplayNowPlaying;
    if (props.show !== false) {
      e_setDisplayNowPlaying(false);
      this.setState({
        filterText: '',
        filterList: [],
        mode: x.normal,
      });
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
    events.emitter.emit(names.ChangePlaylist);
  };
  onMode = (mode: Mode) => {
    this.setState({
      mode,
    });
  };
  renderTools = () => {
    switch (this.state.mode) {
      case x.normal:
        return (
          <React.Fragment>
            <components.Icon
              name={icons.MAGNIFY}
              onPress={() => {
                return this.onMode(x.filtering);
              }}
            />
            <components.Icon name={tabIcons.DISC.name} onPress={this.changePlaylist} />
            <components.Icon
              name={icons.DELETE_OUTLINE}
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
              onPress={() => {
                return this.onMode(x.normal);
              }}
            />
            <components.Icon
              name={icons.NOTIFICATION_CLEAR_ALL}
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
    events.emitter.emit(names.SavePicModal, {
      img: t.img,
      song: songItem.name,
    });
  };
  scrollTo = () => {
    const index = this.props.index;
    this._list?.scrollTo({x: 0, y: constants.ITEM_HEIGHT * index});
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
        return events.toDetailModal({
          item: e,
          index: t,
          api,
        });
      },
    };
  };
  playFiltedMusic = (e: TrackFields, api: Provider) => {
    const data = this.props.data;
    const o = data.findIndex((t) => b.getTrackKey(e, api) === b.getTrackKey(t, api));
    if (o < 0) return;
    events.toPlayer({
      item: e,
      data,
      index: o,
      api,
    });
  };
  deleteFromQueue = (e: TrackFields, _index: number) => {
    const props = this.props;
    const n_api = props.api;
    if (b.getTrackKey(e, n_api) !== b.getTrackKey(props.data[props.index], n_api)) {
      events.emitter.emit(names.DeleteFromQueue, {
        item: e,
        api: n_api,
      });
    }
  };
  addToQueue = (e: TrackFields) => {
    const props = this.props;
    const n_api = props.api;
    if (b.getTrackKey(e, n_api) !== b.getTrackKey(props.data[props.index], n_api)) {
      events.toInsertToList({
        data: e,
        api: n_api,
      });
    }
  };
  componentDidMount() {
    this.sub = events.emitter.addListener(names.NowPlayingModal, (t) => {
      if (t.forceClose === true) {
        this.forceClose();
      }
    });
  }
  componentWillUnmount() {
    this.sub?.remove();
  }
  render() {
    const props = this.props;
    const {show, songItem, data, isRound} = props;
    const state = this.state;
    const {filterList, filterText} = state;
    if (!songItem) {
      return null;
    }
    const g = b.extractFullInfo(songItem, 'big');
    const h = filterText.length > 0;
    return (
      <ReactNative.Modal
        animationType={'fade'}
        transparent={true}
        onRequestClose={this.onClose}
        visible={show}
      >
        <ReactNative.View
          style={[
            E.container,
            {
              backgroundColor: '#000',
            },
          ]}
        >
          {g && (
            <components.Background
              imageStyle={{
                opacity: 0.5,
              }}
              coverUrl={g.img}
              blur={true}
            />
          )}
          <ReactNative.TouchableWithoutFeedback onPress={this.forceClose}>
            <ReactNative.View
              style={{
                width: '100%',
                height: '35%',
                position: 'absolute',
              }}
            />
          </ReactNative.TouchableWithoutFeedback>
          {g && (
            <ReactNative.View style={E.title}>
              <ReactNative.TouchableOpacity onPress={this.onCover}>
                <ReactNative.Image
                  source={{
                    uri: g.img,
                  }}
                  style={{
                    height: 150,
                    width: 150,
                    borderRadius: isRound ? 75 : 5,
                  }}
                />
              </ReactNative.TouchableOpacity>
              <ReactNative.TouchableOpacity
                onPress={() => {
                  return this.scrollTo();
                }}
                style={{
                  alignItems: 'center',
                }}
              >
                <components.Selectable
                  numberOfLines={3}
                  style={[
                    E.text,
                    {
                      fontSize: 18,
                      fontWeight: 'bold',
                      marginTop: 5,
                      textAlign: 'center',
                    },
                  ]}
                >
                  {g.song}
                </components.Selectable>
                <components.Selectable
                  style={[
                    E.text,
                    {
                      fontSize: 13,
                      textAlign: 'center',
                    },
                  ]}
                >
                  {g.album}
                </components.Selectable>
              </ReactNative.TouchableOpacity>
            </ReactNative.View>
          )}
          <ReactNative.View style={E.btnsBar}>{this.renderTools()}</ReactNative.View>
          <FadingEdge top={30}>
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
              renderEmpty={function () {
                return <ReactNative.View />;
              }}
            />
          </FadingEdge>
        </ReactNative.View>
      </ReactNative.Modal>
    );
  }
}
const E = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 15,
  },
  title: {
    marginTop: '15%',
    alignItems: 'center',
  },
  btnsBar: {
    height: 40,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
  },
  textInput: {
    height: '100%',
    width: '100%',
    fontSize: 16,
  },
});
export default NowPlayingModal;
