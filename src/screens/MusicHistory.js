import * as _appStorage from './../storage/index.js';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeLargelist from './../components/Scrolling.js';
import * as components from '../components/index';
import providers from '../services/providers';
import * as constants from '../theme/constants';
import icons from '../theme/icons';
import keys from '../storage/keys';
import locales from '../locales/index';
import * as events from '../events/index';
import * as types from '../utils/types';
import * as trackInfo from '../services/trackInfo';
import mediaStore from '../native/mediaStore';
import * as history from '../storage/history';
import * as sectionsModule from './history/sections';
import HistorySelection from './../modules/HistorySelection.js';
class MusicHistory extends React.Component {
  state = {
    qqMusic: [],
    netEase: [],
    local: [],
    showModal: false,
  };
  loadHistory = () => {
    _appStorage.storage
      .load({
        key: keys.musicHistory,
      })
      .then((e) => {
        if (e) {
          if (!types.isObject(e)) {
            return;
          }
          this.setState(
            {
              qqMusic: e.qqMusic,
              netEase: e.netEase,
              local: e.local,
            },
            () => {
              this.attachLocalPath(e.netEase, providers.netEase);
              this.attachLocalPath(e.qqMusic, providers.qqMusic);
            },
          );
        }
      })
      .catch(() => false);
  };
  attachLocalPath = (e, t) => {
    if (!(e.length < 1)) {
      mediaStore.attachLocalPath(e).then((e) => {
        this.setState({
          [t]: e,
        });
      });
    }
  };
  listPick = () => {
    this.setState({
      showModal: true,
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
      items: this.state[e].length > 0 ? this.state[e] : [],
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
    const a = sectionsModule.sectionTitleMap[t];
    const l = this.sectionDataLength(t);
    return (
      <ReactNative.View style={sectionsModule.sectionStyle.container}>
        <components.Title style={[sectionsModule.sectionStyle.numbers]}>{l}</components.Title>
        <components.Title>{a}</components.Title>
      </ReactNative.View>
    );
  };
  _renderIndexPath = ({section, row}) => {
    const l = sectionsModule.sections[section];
    const index = row;
    const c = this.state[l][index];
    const u = trackInfo.extractFullInfo(c);
    return (
      <ReactNative.View>
        <components.SongRow
          song={u.song}
          singer={u.singer}
          album={u.album}
          index={index}
          alias={u.alias}
          onPress={() => {
            return this.playMusic(c, index, l);
          }}
          detail={function () {
            return events.toDetailModal({
              item: c,
              index,
              api: l,
            });
          }}
          addToQueue={function () {
            return events.toInsertToList({
              data: c,
              api: l,
            });
          }}
          isExist={c?.localPath}
          songItem={c}
        />
      </ReactNative.View>
    );
  };
  onPickDelete = (e) => {
    if (e.netEase.length > 0) {
      this.changeList(providers.netEase, e.netEase);
    }
    if (e.qqMusic.length > 0) {
      this.changeList(providers.qqMusic, e.qqMusic);
    }
    if (e.local.length > 0) {
      this.changeList(providers.local, e.local);
    }
  };
  changeList = (e, t) => {
    const a = this.state[e].filter((e, a) => !t.includes(a));
    this.setState({
      [e]: a,
    });
  };
  sectionDataLength = (e) => {
    let t;
    const n_state = this.state;
    const {netEase, qqMusic, local} = n_state;
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
  playMusic = (item, t, a) => {
    this.refreshList(item, a);
    let l;
    const n_state = this.state;
    const {netEase, qqMusic, local} = n_state;
    switch (a) {
      case providers.qqMusic:
        l = qqMusic;
        break;
      case providers.netEase:
        l = netEase;
        break;
      case providers.local:
        l = local;
    }
    events.toPlayer({
      item,
      data: l,
      index: 0,
      api: a,
      localPath: item.localPath,
    });
  };
  refreshList = (e, t) => {
    let a;
    const n_state = this.state;
    const {qqMusic, netEase, local} = n_state;
    switch (t) {
      case providers.qqMusic:
        a = qqMusic;
        break;
      case providers.netEase:
        a = netEase;
        break;
      case providers.local:
        a = local;
    }
    this.setState({
      [t]: history.cleanedData(a, e, t),
    });
  };
  componentWillUnmount() {
    const state = this.state;
    const t = {
      qqMusic: state.qqMusic,
      netEase: state.netEase,
      local: state.local,
    };
    _appStorage.storage.save({
      key: keys.musicHistory,
      data: t,
    });
  }
  componentDidMount() {
    this.loadHistory();
  }
  render() {
    const e = this;
    const state = this.state;
    const {showModal, netEase, qqMusic, local} = state;
    const c = this.getData();
    return (
      <components.PageContainer
        title={locales.RECENT_PLAY}
        goBack={function () {
          return e.props.navigation.goBack();
        }}
        rightIcon={{
          name: icons.CHECKBOX_MULTIPLE_MARKED_CIRCLE_OUTLINE,
          onPress: this.listPick,
        }}
        onTop={this.onTop}
      >
        <reactNativeLargelist.LargeList
          ref={function (t) {
            return (e._list = t);
          }}
          data={c}
          heightForIndexPath={this._heightForIndexPath}
          heightForSection={this._heightForSection}
          renderIndexPath={this._renderIndexPath}
          renderSection={this._renderSection}
        />
        <HistorySelection
          isOpen={showModal}
          onClosed={function () {
            e.setState({
              showModal: false,
            });
          }}
          netEase={netEase}
          qqMusic={qqMusic}
          local={local}
          onDelete={this.onPickDelete}
        />
      </components.PageContainer>
    );
  }
}
export default MusicHistory;
