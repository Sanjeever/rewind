import {toast} from '../native/toast';
import Text from './../components/Text';
import * as React from 'react';
import * as ReactNative from 'react-native';
import FadingEdge from '../components/FadingEdge';
import * as reactNativeLargelist from './../components/Scrolling.js';
import * as components from '../components/index';
import providers from '../services/providers';
import * as constants from '../theme/constants';
import names from '../events/names';
import icons from '../theme/icons';
import locales from '../locales/index';
import * as services from '../services/index';
import * as events from '../events/index';
import * as trackInfo from '../services/trackInfo';
const C = [
  {
    name: locales.PLAY,
    key: 'play',
  },
  {
    name: locales.ADD_TO_MIX,
    key: 'addToPlaylist',
  },
  {
    name: locales.DELETE_FROM_PLAYLIST,
    key: 'deleteFromPlaylist',
  },
];
const y = {
  encode: function (e) {
    return String(`k${e}`);
  },
  decode: function (e) {
    return Number(e.slice(1));
  },
};
class MultiplySelectModal extends React.PureComponent {
  state = {
    checked: {},
    showModal: false,
  };
  handleClose = () => {
    this.setState({
      checked: {},
    });
    this.props.onClose();
  };
  onTop = () => {
    this._list?.scrollTo({
      x: 0,
      y: 0,
    });
  };
  getNeedCheckAll = () => {
    const checked = this.state.checked;
    return Object.values(checked).filter((e) => e > 0).length === 0;
  };
  _renderIndexPath = ({row}) => {
    return this.renderItem({
      item: this.props.data[row],
      index: row,
    });
  };
  onTask = (e) => {
    switch (e) {
      case C[0].key:
        this.playChecked();
        break;
      case C[1].key:
        this.onCollectModal();
        break;
      case C[2].key:
        this.deleteFromPlaylist();
    }
  };
  onDots = (e) => {
    if (!(e <= 0)) {
      this.setState({
        showModal: true,
      });
    }
  };
  playChecked = () => {
    const api = this.props.api;
    const t = this.getCheckedData();
    if (t && t.length !== 0) {
      events.toPlayer({
        item: t[0],
        data: t,
        index: 0,
        api,
      });
      this.setState({
        checked: {},
        showModal: false,
      });
      this.props.onClose();
    }
  };
  deleteFromPlaylist = async () => {
    const {api, playlistId, isCustom} = this.props;
    const ids = this.getCheckedData().map((song) => song.id);
    try {
      let deleted = false;
      if (api === providers.netEase && playlistId) {
        const response = await services.Netease.playlist_tracks({
          op: 'del',
          pid: playlistId,
          tracks: ids,
        });
        if (response.code !== 200) {
          throw new Error(locales.ERROR);
        }
        events.emitter.emit(names.DeleteFromPlaylist);
        deleted = true;
      } else if (isCustom && ids.length) {
        await this.props.onDeleteCustom(ids);
        deleted = true;
      }
      if (deleted) {
        this.setState({
          checked: {},
          showModal: false,
        });
      }
    } catch (error) {
      toast(`删除失败：${error.message}`);
    }
  };
  onCollectModal = () => {
    const api = this.props.api;
    const data = this.getCheckedData();
    events.emitter.emit(names.CollectModal, {
      api,
      data,
    });
  };
  onCheckAll = () => {
    const e = this.getNeedCheckAll();
    let checked = this.state.checked;
    if (e) {
      this.props.data.map((e, a) => {
        const n = y.encode(a);
        checked[n] = 1;
      });
    } else {
      checked = {};
    }
    this.setState({
      checked,
    });
    this.forceUpdate();
  };
  onCheck = (e) => {
    const checked = {
      ...this.state.checked,
    };
    checked[y.encode(e)] ^= 1;
    this.setState({
      checked,
    });
  };
  getCheckedData = () => {
    const data = this.props.data;
    const checked = this.state.checked;
    const a = [];
    Object.keys(checked).forEach((n) => {
      const r = y.decode(n);
      const l = data[r];
      if (l && checked[n]) {
        a.push(l);
      }
    });
    return a;
  };
  isChecked = (e) => {
    const t = y.encode(e);
    return !!this.state.checked[t];
  };
  renderItem = ({item, index}) => {
    const r = trackInfo.extractFullInfo(item);
    const isChecked = this.isChecked(index);
    return (
      <components.SongRow
        index={index}
        song={r.song}
        singer={r.singer}
        album={r.album}
        isChecked={isChecked}
        onPress={() => {
          return this.onCheck(index);
        }}
      />
    );
  };
  render() {
    const e = this;
    const props = this.props;
    const {visible, data} = props;
    if (!visible) {
      return null;
    }
    const state = this.state;
    const {checked, showModal} = state;
    const length = Object.values(checked).filter((e) => e > 0).length;
    const title = length === 0 ? locales.MULT_SELECT : `${length} ${locales.SELECTED}`;
    const rightIcon = [
      {
        name: length === 0 ? icons.CHECK_ALL : icons.CANCEL,
        onPress: this.onCheckAll,
      },
      {
        name: icons.DOTS_VERTICAL,
        onPress: function () {
          return e.onDots(length);
        },
      },
    ];
    return (
      <ReactNative.Modal
        animationType={'fade'}
        transparent={true}
        onRequestClose={this.handleClose}
        visible={visible}
      >
        <ReactNative.View style={v.container}>
          <components.Background />
          <components.HeaderBar
            title={title}
            goBack={this.handleClose}
            backIcon={{
              name: icons.WINDOW_CLOSE,
            }}
            rightIcon={rightIcon}
            onTop={this.onTop}
          />
          <FadingEdge top={30}>
            <reactNativeLargelist.LargeList
              ref={function (t) {
                return (e._list = t);
              }}
              data={[
                {
                  items: data,
                },
              ]}
              heightForIndexPath={function () {
                return constants.ITEM_HEIGHT;
              }}
              renderIndexPath={this._renderIndexPath}
            />
          </FadingEdge>
          <ReactNative.Modal
            animationType={'fade'}
            transparent={true}
            onRequestClose={function () {
              return e.setState({
                showModal: false,
              });
            }}
            visible={showModal}
          >
            <ReactNative.View
              style={{
                flex: 1,
                backgroundColor: '#000',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ReactNative.TouchableWithoutFeedback
                onPress={function () {
                  return e.setState({
                    showModal: false,
                  });
                }}
              >
                <ReactNative.View style={[ReactNative.StyleSheet.absoluteFill]} />
              </ReactNative.TouchableWithoutFeedback>
              {C.map((t, key) => (
                <ReactNative.TouchableNativeFeedback
                  key={key}
                  onPress={function () {
                    return e.onTask(t.key);
                  }}
                >
                  <ReactNative.View
                    style={{
                      padding: 20,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                      }}
                    >
                      {t.name}
                    </Text>
                  </ReactNative.View>
                </ReactNative.TouchableNativeFeedback>
              ))}
            </ReactNative.View>
          </ReactNative.Modal>
        </ReactNative.View>
      </ReactNative.Modal>
    );
  }
}
export default MultiplySelectModal;
var v = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
  },
});
