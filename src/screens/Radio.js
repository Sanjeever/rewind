import {toast} from '../native/toast';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeSpringScrollview from './../components/Scrolling';
import * as components from '../components/index';
import icons from '../theme/icons';
import locales from '../locales/index';
import * as services from '../services/index';
class Radio extends React.PureComponent {
  state = {
    loaded: false,
    radios: [],
    type: 0,
    page: 0,
  };
  unLogin = () => {
    toast(locales.NETEASE_NOT_LOGIN);
    this.props.navigation.navigate('NeteaseLogin');
  };
  getHotRadio = () => {
    const type = this.state.type;
    if (type === 1) {
      this.getUserRadio();
    } else {
      services.Netease.radio_hot().then((e) => {
        const e_djRadios = e.djRadios;
        if (e.code === 200 && e_djRadios.length > 0) {
          this.setState({
            radios: e_djRadios,
            loaded: true,
          });
        }
      });
    }
    this.setState({
      type: type === 0 ? 1 : 0,
      page: 0,
    });
  };
  getUserRadio = () => {
    services.Netease.radio_sublist().then(({code, djRadios}) => {
      if (code === 200 && djRadios.length > 0) {
        this.setState({
          radios: djRadios,
          loaded: true,
        });
      } else {
        this.unLogin();
      }
    });
  };
  getMore = () => {
    this.setState(
      {
        page: this.state.page + 1,
      },
      () => {
        const o_state = this.state;
        const {page, type, radios} = o_state;
        if (type === 1) {
          services.Netease.radio_hot(30 * page)
            .then((e) => {
              const e_djRadios = e.djRadios;
              if (e.code === 200 && e_djRadios.length > 0) {
                this.setState({
                  radios: radios.concat(e_djRadios),
                  loaded: true,
                });
              }
              throw new Error('END');
            })
            .catch(() => {
              this._scrollView.endLoading?.();
            });
        }
      },
    );
  };
  onTop = () => {
    this._scrollView.scrollToBegin?.();
  };
  _renderItem = ({item, index}) => {
    return (
      <components.ListItem
        key={index}
        img={`${item.picUrl}?param=200y200`}
        title={item.name}
        subtitle={`${item.rcmdtext} | ${item.category}`}
        onPress={() => {
          return this.radioDetail(item);
        }}
      />
    );
  };
  radioDetail = (e) => {
    this.props.navigation.navigate('RadioDetail', {
      item: e,
    });
  };
  componentDidMount() {
    this.getUserRadio();
  }
  render() {
    const state = this.state;
    const {loaded, radios} = state;
    return (
      <components.PageContainer
        title={locales.RADIOS}
        goBack={() => {
          return this.props.navigation.goBack();
        }}
        onTop={this.onTop}
        rightIcon={{
          name: icons.FILTER_VARIANT,
          onPress: this.getHotRadio,
        }}
      >
        {loaded === false ? <components.Spinkit style={g.loading} /> : null}
        <reactNativeSpringScrollview.SpringScrollView
          ref={(t) => {
            return (this._scrollView = t);
          }}
          onLoading={this.getMore}
        >
          {radios.map((t, index) =>
            this._renderItem({
              item: t,
              index,
            }),
          )}
        </reactNativeSpringScrollview.SpringScrollView>
      </components.PageContainer>
    );
  }
}
var g = ReactNative.StyleSheet.create({
  loading: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
export default Radio;
