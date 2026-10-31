import Text from './../components/Text';
import * as _appStorage from './../storage/index';
import * as React from 'react';
import * as ReactNative from 'react-native';
import FadingEdge from '../components/FadingEdge';
import * as reactNativeLargelist from './../components/Scrolling';
import * as components from '../components/index';
import providers from '../services/providers';
import * as constants from '../theme/constants';
import names from '../events/names';
import icons from '../theme/icons';
import keysModule from '../storage/keys';
import locales from '../locales/index';
import * as events from '../events/index';
import * as trackInfo from '../services/trackInfo';
import dimensions from '../native/dimensions';
import * as sectionsModule from '../screens/history/sections';
const L = dimensions.get('SOFT_MENU_BAR_HEIGHT');
class HistorySelection extends React.Component {
  state = {
    checkedList: {
      netEase: [],
      qqMusic: [],
      local: [],
    },
    selectedAll: false,
    show_netEase: true,
    show_qqMusic: true,
    show_local: true,
    needBottomPadding: false,
  };
  loadSetting = () => {
    _appStorage.storage
      .load({
        key: keysModule.settings,
      })
      .then((e) => {
        if (e?.navbarPadding.on) {
          this.setState({
            needBottomPadding: true,
          });
        }
      });
  };
  clean = () => {
    this.setState({
      checkedList: {
        netEase: [],
        qqMusic: [],
        local: [],
      },
      selectedAll: false,
    });
  };
  onTop = () => {
    this._list?.scrollTo({
      x: 0,
      y: 0,
    });
  };
  getData = () => {
    return sectionsModule.sections.map((e) => ({
      items: this.props[e].length > 0 ? this.props[e] : [],
    }));
  };
  _heightForIndexPath = function () {
    return constants.ITEM_HEIGHT;
  };
  _heightForSection = (e) => {
    const t = sectionsModule.sections[e];
    if (this.sectionDataLength(t) === 0) {
      return 0;
    }
    return sectionsModule.SECTION_HEIGHT;
  };
  _renderSection = (e) => {
    const t = sectionsModule.sections[e];
    const n = sectionsModule.sectionTitleMap[t];
    const l = this.sectionDataLength(t);
    return (
      <ReactNative.View style={sectionsModule.sectionStyle.container}>
        <components.Title style={[sectionsModule.sectionStyle.numbers]}>{l}</components.Title>
        <components.Title>{n}</components.Title>
      </ReactNative.View>
    );
  };
  _renderIndexPath = ({section, row}) => {
    const l = sectionsModule.sections[section];
    const index = row;
    const o = this.props[l][index];
    const u = trackInfo.extractFullInfo(o);
    const isChecked = this.isCheck(index, l);
    return (
      <ReactNative.View>
        <components.SongRow
          song={u.song}
          singer={u.singer}
          album={u.album}
          isChecked={isChecked}
          index={index}
          onPress={() => {
            return this.onChecked(index, l);
          }}
        />
      </ReactNative.View>
    );
  };
  sectionDataLength = (e) => {
    let t;
    const a_props = this.props;
    const {netEase, qqMusic, local} = a_props;
    switch (e) {
      case providers.netEase:
        t = netEase.length;
        break;
      case providers.qqMusic:
        t = qqMusic.length;
        break;
      case providers.local:
        t = local.length;
    }
    return t;
  };
  addToPlay = () => {
    const e = this.mostChecked();
    events.emitter.emit(names.InsertToList, {
      data: e.data,
      type: 'array',
      api: e.api,
    });
    this.clean();
  };
  mostChecked = () => {
    const a_props = this.props;
    const {qqMusic, netEase, local} = a_props;
    const checkedList = this.state.checkedList;
    const length = checkedList.netEase.length;
    const length_1 = checkedList.qqMusic.length;
    const length_2 = checkedList.local.length;
    const c = {
      data: null,
      api: null,
    };
    if (length > length_1 && length > length_2) {
      c.data = netEase.filter((e, t) => checkedList.netEase.includes(t));
      c.api = providers.netEase;
    }
    if (length_1 > length && length_1 > length_2) {
      c.data = qqMusic.filter((e, t) => checkedList.qqMusic.includes(t));
      c.api = providers.qqMusic;
    }
    if (length_2 > length && length_2 > length_1) {
      c.data = local.filter((e, t) => checkedList.local.includes(t));
      c.api = providers.local;
    }
    return c;
  };
  selectAll = () => {
    const a_props = this.props;
    const {qqMusic, netEase, local} = a_props;
    netEase.map((e, t) => {
      this.checkedAll(t, providers.netEase);
    });
    qqMusic.map((e, t) => {
      this.checkedAll(t, providers.qqMusic);
    });
    local.map((e, t) => {
      this.checkedAll(t, providers.local);
    });
  };
  checkedAll = (e, t) => {
    const selectedAll = this.state.selectedAll;
    const checkedList = this.state.checkedList;
    const r = checkedList[t];
    if (selectedAll) {
      checkedList[t] = [];
    } else {
      r.push(e);
      checkedList[t] = r;
    }
    this.setState({
      checkedList,
      selectedAll: !selectedAll,
    });
  };
  onDelete = () => {
    const checkedList = this.state.checkedList;
    this.props.onDelete(checkedList);
    this.clean();
  };
  pickedNum = () => {
    const checkedList = this.state.checkedList;
    let t = 0;
    for (let n = Object.keys(checkedList), l = 0; l < n.length; l++) {
      t += checkedList[n[l]].length;
    }
    return t;
  };
  onChecked = (e, t) => {
    const checkedList = this.state.checkedList;
    let l = checkedList[t];
    if (this.isCheck(e, t)) {
      l = l.filter((t) => t !== e);
    } else {
      l.push(e);
    }
    checkedList[t] = l;
    this.setState({
      checkedList,
    });
  };
  isCheck = (e, t) => {
    return this.state.checkedList[t].some((t) => t === e);
  };
  componentDidMount() {
    this.loadSetting();
  }
  render() {
    const props = this.props;
    const {isOpen, onClosed} = props;
    const state = this.state;
    const {selectedAll, needBottomPadding} = state;
    const data = this.getData();
    return (
      <ReactNative.Modal
        ref={(instance) => (this.modal = instance)}
        style={{
          flex: 1,
        }}
        animationType={'fade'}
        visible={isOpen}
        onRequestClose={() => {
          this.clean();
          onClosed();
        }}
      >
        <ReactNative.View
          style={[
            _.container,
            {
              paddingBottom: needBottomPadding ? 5 + L : 5,
            },
          ]}
        >
          <components.Background />
          <components.HeaderBar
            headerStyle={_.header}
            title={`${this.pickedNum()} ${locales.SELECTED}`}
            goBack={onClosed}
            onTop={this.onTop}
            backIcon={{
              name: icons.WINDOW_CLOSE,
            }}
          />
          <FadingEdge top={30} bottom={30}>
            <reactNativeLargelist.LargeList
              ref={(t) => {
                return (this._list = t);
              }}
              data={data}
              heightForIndexPath={this._heightForIndexPath}
              heightForSection={this._heightForSection}
              renderIndexPath={this._renderIndexPath}
              renderSection={this._renderSection}
            />
          </FadingEdge>
          <ReactNative.View style={_.btns}>
            {React.createElement(q, {
              text: locales.PLAY,
              name: icons.PLUS,
              onPress: this.addToPlay,
            })}
            {React.createElement(q, {
              text: selectedAll ? locales.CANCEL : locales.SELECT_ALL,
              name: selectedAll ? icons.CANCEL : icons.CHECK_ALL,
              onPress: this.selectAll,
            })}
            {React.createElement(q, {
              text: locales.DELETE,
              name: icons.DELETE,
              onPress: this.onDelete,
            })}
          </ReactNative.View>
        </ReactNative.View>
      </ReactNative.Modal>
    );
  }
}
var q = function ({onPress, name, text, style}) {
  return (
    <ReactNative.TouchableOpacity onPress={onPress}>
      <ReactNative.View style={[_.btn, style]}>
        <components.Icon name={name || icons.FORMAT_LIST_BULLETED} />
        <Text>{text || locales.MULT_SELECT}</Text>
      </ReactNative.View>
    </ReactNative.TouchableOpacity>
  );
};
var _ = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40 + constants.STATUS_BAR_HEIGHT,
  },
  header: {
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },
  btns: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
export default HistorySelection;
