import SongRow from '../tracks/SongRow';
import React from 'react';
import {Modal, StyleSheet, TouchableOpacity, View} from 'react-native';
import type {StyleProp, ViewStyle} from 'react-native';
import Text from '../../components/Text';
import FadingEdge from '../../components/FadingEdge';
import {LargeList} from '../../components/Scrolling';
import {Background, HeaderBar, Icon, Title} from '../../components';
import {storage} from '../../storage';
import keys from '../../storage/keys';
import {ITEM_HEIGHT, STATUS_BAR_HEIGHT} from '../../theme/constants';
import dimensions from '../../native/dimensions';
import icons from '../../theme/icons';
import locales from '../../locales';
import {insertTracks} from '../../player/commands';
import {extractFullInfo} from '../../services/trackInfo';
import {sections, sectionTitleMap, sectionStyle, SECTION_HEIGHT} from './sections';
import type {Provider} from '../../services/providers';
import type {TrackFields} from '../../services/track';

export type ProviderTracks = Record<Provider, TrackFields[]>;
export type SelectedIndices = Record<Provider, number[]>;
type Props = ProviderTracks & {
  isOpen: boolean;
  onClosed(): void;
  onDelete(indices: SelectedIndices): void;
};
interface State {
  checkedList: SelectedIndices;
  selectedAll: boolean;
  needBottomPadding: boolean;
}
const empty = (): SelectedIndices => ({netEase: [], qqMusic: [], local: []});
export default class HistorySelection extends React.Component<Props, State> {
  state: State = {checkedList: empty(), selectedAll: false, needBottomPadding: false};
  list: LargeList<TrackFields> | null = null;
  async componentDidMount() {
    const settings = await storage.load<{navbarPadding: {on: boolean}}>({key: keys.settings});
    this.setState({needBottomPadding: settings.navbarPadding.on});
  }
  clean = () => this.setState({checkedList: empty(), selectedAll: false});
  onChecked = (index: number, api: Provider) =>
    this.setState((state) => ({
      checkedList: {
        ...state.checkedList,
        [api]: state.checkedList[api].includes(index)
          ? state.checkedList[api].filter((value) => value !== index)
          : [...state.checkedList[api], index],
      },
    }));
  selectAll = () =>
    this.setState((state) => ({
      selectedAll: !state.selectedAll,
      checkedList: state.selectedAll
        ? empty()
        : {
            netEase: this.props.netEase.map((_, index) => index),
            qqMusic: this.props.qqMusic.map((_, index) => index),
            local: this.props.local.map((_, index) => index),
          },
    }));
  mostChecked() {
    let api: Provider | undefined;
    let count = 0;
    for (const provider of sections) {
      const length = this.state.checkedList[provider].length;
      if (length > count) {
        count = length;
        api = provider;
      }
    }
    return api
      ? {
          api,
          data: this.props[api].filter((_, index) => this.state.checkedList[api].includes(index)),
        }
      : undefined;
  }
  addToPlay = () => {
    const selected = this.mostChecked();
    if (selected) {
      insertTracks({tracks: selected.data, api: selected.api});
      this.clean();
    }
  };
  onDelete = () => {
    this.props.onDelete(this.state.checkedList);
    this.clean();
  };
  onTop = () => this.list?.scrollToBegin();
  renderRow = ({section, row}: {section: number; row: number}) => {
    const api = sections[section],
      item = this.props[api][row],
      info = extractFullInfo(item);
    return (
      <View>
        <SongRow
          song={info.song}
          singer={info.singer}
          album={info.album}
          index={row}
          isChecked={this.state.checkedList[api].includes(row)}
          onPress={() => this.onChecked(row, api)}
        />
      </View>
    );
  };
  render() {
    const {checkedList, selectedAll, needBottomPadding} = this.state;
    const count = sections.reduce((count, api) => count + checkedList[api].length, 0);
    return (
      <Modal
        animationType="fade"
        visible={this.props.isOpen}
        onRequestClose={() => {
          this.clean();
          this.props.onClosed();
        }}
      >
        <View
          style={[
            styles.container,
            {paddingBottom: needBottomPadding ? 5 + dimensions.get('SOFT_MENU_BAR_HEIGHT') : 5},
          ]}
        >
          <Background />
          <HeaderBar
            headerStyle={styles.header}
            title={`${count} ${locales.SELECTED}`}
            goBack={this.props.onClosed}
            onTop={this.onTop}
            backIcon={{name: icons.WINDOW_CLOSE}}
          />
          <FadingEdge top={30} bottom={30}>
            <LargeList
              ref={(list) => {
                this.list = list;
              }}
              data={sections.map((api) => ({items: this.props[api]}))}
              heightForIndexPath={() => ITEM_HEIGHT}
              heightForSection={(index) =>
                this.props[sections[index]].length ? SECTION_HEIGHT : 0
              }
              renderIndexPath={this.renderRow}
              renderSection={(index) => (
                <View style={sectionStyle.container}>
                  <Title style={sectionStyle.numbers}>{this.props[sections[index]].length}</Title>
                  <Title>{sectionTitleMap[sections[index]]}</Title>
                </View>
              )}
            />
          </FadingEdge>
          <View style={styles.buttons}>
            <Action text={locales.PLAY} name={icons.PLUS} onPress={this.addToPlay} />
            <Action
              text={selectedAll ? locales.CANCEL : locales.SELECT_ALL}
              name={selectedAll ? icons.CANCEL : icons.CHECK_ALL}
              onPress={this.selectAll}
            />
            <Action text={locales.DELETE} name={icons.DELETE} onPress={this.onDelete} />
          </View>
        </View>
      </Modal>
    );
  }
}
function Action({
  onPress,
  name,
  text,
  style,
}: {
  onPress(): void;
  name: string;
  text: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={style}>
        <Icon name={name} />
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {flex: 1, paddingTop: 40 + STATUS_BAR_HEIGHT},
  header: {position: 'absolute', top: 0, zIndex: 10},
  buttons: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
