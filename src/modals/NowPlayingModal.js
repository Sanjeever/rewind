import * as React from 'react';
import * as ReactNative from 'react-native';
import FadingEdge from '../components/FadingEdge';
import * as reactNativeLargelist from './../components/Scrolling.js';
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
const x = {
  normal: 'normal',
  deleting: 'deleting',
  filtering: 'filtering',
};
class NowPlayingModal extends React.PureComponent {
  state = {
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
    const a_props = this.props;
    const e_setDisplayNowPlaying = a_props.setDisplayNowPlaying;
    if (a_props.show !== false) {
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
      const filterList = utils.filterHelper.quickSearch(data, filterText);
      this.setState({
        filterList,
      });
    } else {
      this.setState({
        filterList: [],
      });
    }
  };
  onChangeText = (filterText) => {
    this.onSubmitEditing();
    this.setState({
      filterText,
    });
  };
  changePlaylist = function () {
    events.emitter.emit(names.ChangePlaylist);
  };
  onMode = (mode) => {
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
              style={{
                paddding: 5,
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
    events.toPlayer({
      type: 'clearPlayingList',
    });
    this.forceClose();
  };
  _renderIndexPath = ({row}) => {
    const filterList = this.state.filterList;
    if (this.props.data.length !== 0) {
      let r = this.props.data;
      let showPlaying = true;
      if (filterList.length > 0) {
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
    const t = b.extractFullInfo(songItem, 'big');
    events.emitter.emit(names.SavePicModal, {
      img: t.img,
      song: songItem.name,
    });
  };
  scrollTo = () => {
    const index = this.props.index;
    this._list?.scrollToIndexPath?.({
      section: 0,
      row: index,
    });
  };
  renderItem = ({item, index, showPlaying}) => {
    const o = b.extractFullInfo(item);
    const i = this.getSongRowExtra(item, index);
    const api = this.props.api;
    return (
      <components.SongRow
        song={o.song}
        singer={o.singer}
        album={o.album}
        index={index}
        playing={showPlaying && this.props.index === index}
        onPress={() => {
          return this.playFiltedMusic(item, index, api, item.api);
        }}
        addToQueue={() => {
          return this.addToQueue(item, null, false);
        }}
        alias={o.alias}
        {...i}
      />
    );
  };
  getSongRowExtra = (e, t) => {
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
  playFiltedMusic = (e, t, n, r) => {
    const data = this.props.data;
    const o = data.findIndex((t) => b.extractFullInfo(e).song === b.extractFullInfo(t).song);
    let api = n;
    if (r && r !== n) {
      api = n;
    }
    events.toPlayer({
      item: e,
      data,
      index: o,
      api,
    });
  };
  deleteFromQueue = (e, t) => {
    const a_props = this.props;
    const n_api = a_props.api;
    if (a_props.index !== t) {
      this.refreshList(e, 'delete');
      events.emitter.emit(names.DeleteFromQueue, {
        item: e,
        api: n_api,
      });
    }
  };
  addToQueue = (e, t) => {
    const a_props = this.props;
    const n_api = a_props.api;
    if (a_props.index !== t) {
      this.refreshList(e, 'add');
      events.toInsertToList({
        data: e,
        api: n_api,
      });
    }
  };
  refreshList = (e, t) => {
    let n = null;
    switch (t) {
      case 'add':
        (n = this.props.data.filter(
          (t) => b.extractFullInfo(t).song !== b.extractFullInfo(e).song,
        )).splice(this.props.index + 1, 0, e);
        break;
      case 'delete':
        n = this.props.data.filter((t) => b.extractFullInfo(t).song !== b.extractFullInfo(e).song);
    }
    this.setState({
      data: n,
    });
  };
  playMusic = (item, t, api) => {
    const data = this.props.data;
    events.toPlayer({
      item,
      data,
      index: t,
      api,
    });
  };
  componentDidMount() {
    const e = this;
    this.sub = events.emitter.addListener(names.NowPlayingModal, function (t) {
      if (t.forceClose === true) {
        e.forceClose();
      }
    });
  }
  componentWillUnmount() {
    this.sub.remove?.();
  }
  render() {
    const e = this;
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
                onPress={function () {
                  return e.scrollTo();
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
              ref={function (t) {
                return (e._list = t);
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
                return <components.Spinkit />;
              }}
            />
          </FadingEdge>
        </ReactNative.View>
      </ReactNative.Modal>
    );
  }
}
var E = ReactNative.StyleSheet.create({
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
