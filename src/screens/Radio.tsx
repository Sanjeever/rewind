import React from 'react';
import {StyleSheet} from 'react-native';
import {PageContainer, ListItem, Spinkit} from '../components';
import {SpringScrollView} from '../components/Scrolling';
import icons from '../theme/icons';
import locales from '../locales';
import {Netease} from '../services';
import {toast} from '../native/toast';
import {errorMessage} from '../utils/types';
import type {ScreenProps} from '../navigation/types';
import type * as z from 'zod/mini';
import type {radio} from '../services/schemas';

type RadioItem = z.output<typeof radio>;
interface State {
  loaded: boolean;
  radios: RadioItem[];
  type: 0 | 1;
  page: number;
}
export default class Radio extends React.PureComponent<
  {navigation: Pick<ScreenProps<'Radio'>['navigation'], 'goBack' | 'navigate'>},
  State
> {
  state: State = {loaded: false, radios: [], type: 0, page: 0};
  list: SpringScrollView | null = null;
  requestId = 0;
  pending = false;
  componentDidMount() {
    this.load(0);
  }
  componentWillUnmount() {
    this.requestId++;
  }
  load = async (type: 0 | 1) => {
    const request = ++this.requestId;
    this.pending = false;
    this.setState({type, page: 0, loaded: false, radios: []});
    try {
      const response = await (type === 1 ? Netease.radio_hot() : Netease.radio_sublist());
      if (request !== this.requestId) return;
      if (response.code === 301) {
        toast(locales.NETEASE_NOT_LOGIN);
        this.props.navigation.navigate('NeteaseLogin');
      } else {
        if (response.code !== 200 || !response.djRadios)
          throw new Error(response.message || locales.ERROR);
        this.setState({radios: response.djRadios});
      }
    } catch (error) {
      if (request === this.requestId) toast(errorMessage(error));
    } finally {
      if (request === this.requestId) this.setState({loaded: true});
    }
  };
  getHotRadio = () => this.load(this.state.type === 0 ? 1 : 0);
  getMore = async () => {
    if (this.state.type !== 1 || this.pending) return;
    const request = this.requestId;
    const page = this.state.page + 1;
    this.pending = true;
    try {
      const response = await Netease.radio_hot(page * 30);
      if (request !== this.requestId) return;
      if (response.code !== 200 || !response.djRadios)
        throw new Error(response.message || locales.ERROR);
      const radios = response.djRadios;
      this.setState((state) => ({radios: [...state.radios, ...radios], page}));
      this.list?.endLoading(radios.length === 0);
    } catch (error) {
      if (request === this.requestId) {
        this.list?.endLoading();
        toast(errorMessage(error));
      }
    } finally {
      if (request === this.requestId) this.pending = false;
    }
  };
  render() {
    return (
      <PageContainer
        title={locales.RADIOS}
        goBack={this.props.navigation.goBack}
        onTop={() => this.list?.scrollToBegin()}
        rightIcon={{name: icons.FILTER_VARIANT, onPress: this.getHotRadio}}
      >
        {!this.state.loaded && <Spinkit style={styles.loading} />}
        <SpringScrollView
          key={this.state.type}
          ref={(view) => {
            this.list = view;
          }}
          onLoading={this.getMore}
        >
          {this.state.radios.map((item, index) => (
            <ListItem
              key={index}
              img={`${item.picUrl}?param=200y200`}
              title={item.name}
              subtitle={`${item.rcmdtext} | ${item.category}`}
              onPress={() => this.props.navigation.navigate('RadioDetail', {item})}
            />
          ))}
        </SpringScrollView>
      </PageContainer>
    );
  }
}
const styles = StyleSheet.create({
  loading: {position: 'absolute', top: 0, bottom: 0, left: 0, right: 0},
});
