import SongRow from '../features/tracks/SongRow';
import {toast} from '../native/toast';
import Text from './../components/Text';
import * as React from 'react';
import * as ReactNative from 'react-native';
import FadingEdge from '../components/FadingEdge';
import * as reactNativeLargelist from './../components/Scrolling';
import * as components from '../components/index';
import providers from '../services/providers';
import * as constants from '../theme/constants';
import names from '../events/names';
import icons from '../theme/icons';
import locales from '../locales/index';
import * as services from '../services/index';
import * as events from '../events/index';
import * as trackInfo from '../services/trackInfo';
import type {TrackFields, TrackId} from '../services/track';
import type {Provider} from '../services/providers';
import {errorMessage} from '../utils/types';
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
] as const;
const y = {
  encode: function (e: number) {
    return String(`k${e}`);
  },
  decode: function (e: string) {
    return Number(e.slice(1));
  },
};
type Props = {
  visible: boolean;
  onClose(): void;
  data: TrackFields[];
  api: Provider;
  playlistId?: TrackId | null;
} & ({isCustom: true; onDeleteCustom(selected: TrackFields[]): Promise<void>} | {isCustom?: false});
interface State {
  checked: Record<string, number>;
  showModal: boolean;
}
class MultiplySelectModal extends React.PureComponent<Props, State> {
  _list: reactNativeLargelist.LargeList<TrackFields> | null = null;
  state: State = {
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
  _renderIndexPath = ({row}: {row: number}) => {
    return this.renderItem({
      item: this.props.data[row],
      index: row,
    });
  };
  onTask = (e: (typeof C)[number]['key']) => {
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
  onDots = (e: number) => {
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
    const selected = this.getCheckedData();
    try {
      let deleted = false;
      if (api === providers.netEase && playlistId) {
        const ids = selected.map((song) => {
          if (song.id == null) throw new Error('歌曲缺少标识');
          return song.id;
        });
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
      } else if (isCustom && selected.length) {
        await this.props.onDeleteCustom(selected);
        deleted = true;
      }
      if (deleted) {
        this.setState({
          checked: {},
          showModal: false,
        });
      }
    } catch (error) {
      toast(`删除失败：${errorMessage(error)}`);
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
    let checked: Record<string, number> = {};
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
  };
  onCheck = (e: number) => {
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
    const a: TrackFields[] = [];
    Object.keys(checked).forEach((n) => {
      const r = y.decode(n);
      const l = data[r];
      if (l && checked[n]) {
        a.push(l);
      }
    });
    return a;
  };
  isChecked = (e: number) => {
    const t = y.encode(e);
    return !!this.state.checked[t];
  };
  renderItem = ({item, index}: {item: TrackFields; index: number}) => {
    const r = trackInfo.extractFullInfo(item);
    const isChecked = this.isChecked(index);
    return (
      <SongRow
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
        onPress: () => {
          return this.onDots(length);
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
              ref={(t) => {
                this._list = t;
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
            onRequestClose={() => {
              return this.setState({
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
                onPress={() => {
                  return this.setState({
                    showModal: false,
                  });
                }}
              >
                <ReactNative.View style={[ReactNative.StyleSheet.absoluteFill]} />
              </ReactNative.TouchableWithoutFeedback>
              {C.map((t, key) => (
                <ReactNative.TouchableNativeFeedback
                  key={key}
                  onPress={() => {
                    return this.onTask(t.key);
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
const v = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
  },
});
