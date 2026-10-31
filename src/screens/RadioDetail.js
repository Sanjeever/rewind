import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeSpringScrollview from './../components/Scrolling.js';
import * as components from '../components/index';
import ParallaxList from '../components/ParallaxList';
import providers from '../services/providers';
import * as constants from '../theme/constants';
import names from '../events/names';
import icons from '../theme/icons';
import * as services from '../services/index';
import * as events from '../events/index';
class RadioDetail extends React.PureComponent {
  state = {
    title: '',
    loaded: false,
    data: [],
    page: 0,
    asc: false,
  };
  onTop = () => {
    this._scrollView.scrollToBegin?.();
  };
  getData = (id, asc = false) => {
    services.Netease.radio_detail({
      id,
      asc,
    }).then((e) => {
      const e_programs = e.programs;
      if (e.code === 200 && e_programs.length > 0) {
        this.setState({
          data: e_programs,
          loaded: true,
        });
      }
    });
  };
  getMore = () => {
    this.setState(
      {
        page: this.state.page + 1,
      },
      () => {
        const n_state = this.state;
        const {page, data, id, asc} = n_state;
        services.Netease.radio_detail({
          id,
          offset: 30 * page,
          asc,
        }).then((e) => {
          const e_programs = e.programs;
          if (e.code === 200 && e_programs.length > 0) {
            this.setState({
              data: data.concat(e_programs),
              loaded: true,
            });
          }
          this._scrollView.endLoading?.();
        });
      },
    );
  };
  onChangeOrder = () => {
    const n_state = this.state;
    const {asc, id} = n_state;
    this.getData(id, !asc);
    this.setState({
      asc: !asc,
      loaded: false,
    });
    this.onTop();
  };
  _renderItem = ({item, index}) => {
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
  playRadio = (song, t) => {
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
  render() {
    const e = this;
    const state = this.state;
    const {loaded, data, title, asc} = state;
    return (
      <ReactNative.View style={m.container}>
        <components.Background />
        {loaded === false ? <components.Spinkit style={m.loading} /> : null}
        <reactNativeSpringScrollview.SpringScrollView
          ref={function (t) {
            return (e._scrollView = t);
          }}
          onLoading={this.getMore}
          loadingFooter={ParallaxList}
        >
          {data.map((item, a) =>
            e._renderItem({
              item,
              index: a,
            }),
          )}
        </reactNativeSpringScrollview.SpringScrollView>
        <components.HeaderBar
          headerStyle={m.header}
          title={title}
          goBack={function () {
            return e.props.navigation.goBack();
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
var m = ReactNative.StyleSheet.create({
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
