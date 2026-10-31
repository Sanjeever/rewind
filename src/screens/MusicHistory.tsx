import type {Navigation} from '../navigation/types';
import type {TrackFields} from '../services/track';
import type {Provider} from '../services/providers';
import type {ProviderTracks, SelectedIndices} from '../modules/HistorySelection';
import {toast} from '../native/toast';
import {errorMessage} from '../utils/types';
import * as z from 'zod/mini';
import {track} from '../services/schemas';
import * as _appStorage from './../storage/index';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeLargelist from './../components/Scrolling';
import * as components from '../components/index';
import providers from '../services/providers';
import * as constants from '../theme/constants';
import icons from '../theme/icons';
import keys from '../storage/keys';
import locales from '../locales/index';
import * as events from '../events/index';
import * as trackInfo from '../services/trackInfo';
import mediaStore from '../native/mediaStore';
import * as history from '../storage/history';
import * as sectionsModule from './history/sections';
import HistorySelection from './../modules/HistorySelection';
const historySchema = z.looseObject({
  netEase: z.optional(z.array(track)),
  qqMusic: z.optional(z.array(track)),
  local: z.optional(z.array(track)),
});
class MusicHistory extends React.Component<
  {navigation: Pick<Navigation, 'goBack'>},
  ProviderTracks & {showModal: boolean}
> {
  _list: reactNativeLargelist.LargeList<TrackFields> | null = null;
  historyLoaded = false;
  requestVersion = 0;
  documentExtra: Record<string, unknown> = {};
  state: ProviderTracks & {showModal: boolean} = {
    qqMusic: [],
    netEase: [],
    local: [],
    showModal: false,
  };
  loadHistory = async () => {
    const request = ++this.requestVersion;
    try {
      const raw = await _appStorage.storage.load<unknown>({key: keys.musicHistory});
      const {netEase = [], qqMusic = [], local = [], ...extra} = historySchema.parse(raw);
      if (request !== this.requestVersion) return;
      this.historyLoaded = true;
      this.documentExtra = extra;
      this.setState({netEase, qqMusic, local}, () => {
        this.attachLocalPath(netEase, 'netEase');
        this.attachLocalPath(qqMusic, 'qqMusic');
      });
    } catch (error) {
      if (request !== this.requestVersion) return;
      if (error instanceof Error && error.name === 'NotFoundError') this.historyLoaded = true;
      else toast('读取历史失败：' + errorMessage(error));
    }
  };
  attachLocalPath = (e: TrackFields[], t: Provider) => {
    const request = this.requestVersion;
    if (!(e.length < 1)) {
      mediaStore
        .attachLocalPath(e)
        .then((e) => {
          if (request !== this.requestVersion) return;
          this.setState((state) => ({...state, [t]: e}));
        })
        .catch((error) => toast('匹配本地歌曲失败：' + errorMessage(error)));
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
  _heightForSection = (e: number) => {
    const t = sectionsModule.sections[e];
    if (this.sectionDataLength(t) === 0) {
      return 0;
    }
    return sectionsModule.SECTION_HEIGHT;
  };
  _renderSection = (e: number) => {
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
  _renderIndexPath = ({section, row}: {section: number; row: number}) => {
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
          isExist={!!c?.localPath}
          songItem={c}
        />
      </ReactNative.View>
    );
  };
  onPickDelete = (e: SelectedIndices) => {
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
  changeList = (e: Provider, t: number[]) => {
    const a = this.state[e].filter((e, a) => !t.includes(a));
    this.setState((state) => ({...state, [e]: a}));
  };
  sectionDataLength = (e: Provider) => {
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
  playMusic = (item: TrackFields, _index: number, a: Provider) => {
    const l = history.cleanedData(this.state[a], item, a);
    this.setState((state) => ({...state, [a]: l}));
    events.toPlayer({
      item,
      data: l,
      index: 0,
      api: a,
    });
  };
  refreshList = (e: TrackFields, t: Provider) => {
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
    this.setState((state) => ({...state, [t]: history.cleanedData(a, e, t)}));
  };
  componentWillUnmount() {
    this.requestVersion++;
    if (!this.historyLoaded) return;
    const state = this.state;
    const t = {
      ...this.documentExtra,
      qqMusic: state.qqMusic,
      netEase: state.netEase,
      local: state.local,
    };
    _appStorage.storage
      .save({
        key: keys.musicHistory,
        data: t,
      })
      .catch((error) => toast('保存历史失败：' + errorMessage(error)));
  }
  componentDidMount() {
    this.loadHistory();
  }
  render() {
    const state = this.state;
    const {showModal, netEase, qqMusic, local} = state;
    const c = this.getData();
    return (
      <components.PageContainer
        title={locales.RECENT_PLAY}
        goBack={() => {
          return this.props.navigation.goBack();
        }}
        rightIcon={{
          name: icons.CHECKBOX_MULTIPLE_MARKED_CIRCLE_OUTLINE,
          onPress: this.listPick,
        }}
        onTop={this.onTop}
      >
        <reactNativeLargelist.LargeList
          ref={(t) => {
            this._list = t;
          }}
          data={c}
          heightForIndexPath={this._heightForIndexPath}
          heightForSection={this._heightForSection}
          renderIndexPath={this._renderIndexPath}
          renderSection={this._renderSection}
        />
        <HistorySelection
          isOpen={showModal}
          onClosed={() => {
            this.setState({
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
