import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeSpringScrollview from './../components/Scrolling';
import * as components from '../components/index';
import ParallaxList from '../components/ParallaxList';
import providers from '../services/providers';
import * as constants from '../theme/constants';
import names from '../events/names';
import icons from '../theme/icons';
import * as services from '../services/index';
import * as events from '../events/index';
import type {ScreenProps} from '../navigation/types';
import type {TrackId} from '../services/track';
import type * as z from 'zod/mini';
import type {program} from '../services/schemas';
import {toast} from '../native/toast';
import {errorMessage} from '../utils/types';
type Program = z.output<typeof program>;
interface State {
  title?: string;
  loaded: boolean;
  data: Program[];
  page: number;
  asc: boolean;
  id?: TrackId;
}
class RadioDetail extends React.PureComponent<
  Pick<ScreenProps<'RadioDetail'>, 'route'> & {
    navigation: Pick<ScreenProps<'RadioDetail'>['navigation'], 'goBack'>;
  },
  State
> {
  requestId = 0;
  pending = false;
  _scrollView: reactNativeSpringScrollview.SpringScrollView | null = null;
  state: State = {
    title: '',
    loaded: false,
    data: [],
    page: 0,
    asc: false,
  };
  onTop = () => {
    this._scrollView?.scrollToBegin();
  };
  getData = async (id: TrackId, asc = false) => {
    const request = ++this.requestId;
    this.pending = false;
    this.setState({id, asc, page: 0, data: [], loaded: false});
    try {
      const e = await services.Netease.radio_detail({
        id,
        asc,
      });
      if (request !== this.requestId) return;
      const e_programs = e.programs;
      if (e.code !== 200 || !e_programs) throw new Error(e.message || '电台节目读取失败');
      if (e.code === 200 && e_programs) {
        this.setState({
          data: e_programs,
          loaded: true,
        });
      }
    } catch (error) {
      if (request === this.requestId) {
        this.setState({loaded: true});
        toast(errorMessage(error));
      }
    }
  };
  getMore = async () => {
    if (this.pending || this.state.id == null) return;
    const request = this.requestId;
    const {id, asc} = this.state;
    const page = this.state.page + 1;
    this.pending = true;
    try {
      const result = await services.Netease.radio_detail({id, asc, offset: 30 * page});
      if (request !== this.requestId) return;
      const programs = result.programs;
      if (result.code !== 200 || !programs) throw new Error(result.message || '电台节目读取失败');
      this.setState((state) => ({data: [...state.data, ...programs], page, loaded: true}));
      this._scrollView?.endLoading(programs.length === 0);
    } catch (error) {
      if (request === this.requestId) {
        this._scrollView?.endLoading();
        toast(errorMessage(error));
      }
    } finally {
      if (request === this.requestId) this.pending = false;
    }
  };
  onChangeOrder = () => {
    const n_state = this.state;
    const {asc, id} = n_state;
    this.getData(id!, !asc);
    this.setState({
      asc: !asc,
      loaded: false,
    });
    this.onTop();
  };
  _renderItem = ({item, index}: {item: Program; index: number}) => {
    return (
      <components.SongRow
        key={index}
        img={`${item.coverUrl}?param=200y200`}
        song={item.name}
        singer={item.description}
        onPress={() => {
          return this.playRadio(item, index);
        }}
      />
    );
  };
  playRadio = (song: Program, t: number) => {
    const data = this.state.data;
    events.emitter.emit(names.Player, {
      song,
      data,
      index: t,
      api: providers.netEase,
    });
  };
  componentDidMount() {
    const params = this.props.route.params;
    if (params) {
      const t = params.item;
      if (t) {
        this.setState({
          title: t.name,
          id: t.id,
        });
        this.getData(t.id);
      }
    }
  }
  componentWillUnmount() {
    this.requestId++;
  }
  render() {
    const state = this.state;
    const {loaded, data, title, asc} = state;
    return (
      <ReactNative.View style={m.container}>
        <components.Background />
        {loaded === false ? <components.Spinkit style={m.loading} /> : null}
        <reactNativeSpringScrollview.SpringScrollView
          ref={(t) => {
            this._scrollView = t;
          }}
          onLoading={this.getMore}
          loadingFooter={ParallaxList}
        >
          {data.map((item, a) =>
            this._renderItem({
              item,
              index: a,
            }),
          )}
        </reactNativeSpringScrollview.SpringScrollView>
        <components.HeaderBar
          headerStyle={m.header}
          title={title}
          goBack={() => {
            return this.props.navigation.goBack();
          }}
          onTop={this.onTop}
          rightIcon={{
            name: asc === false ? icons.ARROW_DOWN : icons.ARROW_UP,
            onPress: this.onChangeOrder,
          }}
        />
      </ReactNative.View>
    );
  }
}
const m = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40 + constants.STATUS_BAR_HEIGHT,
  },
  header: {
    position: 'absolute',
    top: 0,
    zIndex: 10,
  },
  loading: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
export default RadioDetail;
