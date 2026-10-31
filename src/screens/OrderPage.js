import {toast} from '../native/toast';
import * as _appStorage from './../storage/index';
import * as immer from 'immer';
import * as React from 'react';
import * as ReactNative from 'react-native';
import SegmentedControl from '../components/SegmentedControl';
import * as components from '../components/index';
import TabbedViewPager from '../native/TabbedViewPager';
import pagesModule from '../settings/pages';
import icons from '../theme/icons';
import keys from '../storage/keys';
import locales from '../locales/index';
import restartModule from '../native/restart';
import ProviderSelector from './../modules/ProviderSelector.js';
class OrderPage extends React.PureComponent {
  _TAB_NAMES = ['Up', 'Down'];
  state = {
    pages: pagesModule.pages,
    apis: pagesModule.apis,
    pagesOrder: null,
    apisOrder: null,
    changed: false,
  };
  onBackPress = () => {
    return !!this.state.changed && (this.alertChange(), true);
  };
  confirmChange = () => {
    this.saveOrder();
    setTimeout(() => {
      restartModule.restart();
    }, 99);
  };
  saveOrder = () => {
    const r_state = this.state;
    const {pages, apis, changed, pagesOrder, apisOrder} = r_state;
    if (changed) {
      const i = immer.produce(pages, function (e) {
        pagesOrder?.forEach(function (t, r) {
          e[r] = pages[t];
        });
      });
      const u = immer.produce(apis, function (e) {
        apisOrder?.forEach(function (a, r) {
          e[r] = apis[a];
        });
      });
      _appStorage.storage.save({
        key: keys.apisOrder,
        data: u,
      });
      _appStorage.storage.save({
        key: keys.pagesOrder,
        data: i,
      });
    }
  };
  loadOrder = () => {
    _appStorage.storage
      .load({
        key: keys.pagesOrder,
      })
      .then((pages) => {
        if (pages) {
          this.setState({
            pages,
          });
        }
      })
      .catch(() => null);
    _appStorage.storage
      .load({
        key: keys.apisOrder,
      })
      .then((apis) => {
        if (apis) {
          this.setState({
            apis,
          });
        }
      })
      .catch(() => null);
  };
  removeStorage = function () {
    _appStorage.storage.remove({
      key: keys.apisOrder,
    });
    _appStorage.storage.remove({
      key: keys.pagesOrder,
    });
    toast(locales.CACHE_CLEARED);
  };
  renderPageRow = function ({data, active}) {
    return <ProviderSelector data={data} active={active} type={'pages'} />;
  };
  onReleaseRow = (e, a, t) => {
    this.setState({
      [`${t}Order`]: a,
      changed: true,
    });
  };
  renderApiRow = function ({data, active}) {
    return <ProviderSelector data={data} active={active} type={'apis'} />;
  };
  componentDidMount() {
    this.loadOrder();
    this.backSubscription = ReactNative.BackHandler.addEventListener(
      'hardwareBackPress',
      this.onBackPress,
    );
  }
  componentWillUnmount() {
    this.backSubscription?.remove();
  }
  alertChange() {
    ReactNative.Alert.alert(locales.WARN, locales.NEED_RELOAD_APP, [
      {
        text: locales.CANCEL,
        onPress: () => {
          this.props.navigation.goBack();
        },
        style: 'cancel',
      },
      {
        text: locales.CONFIRM,
        onPress: this.confirmChange,
      },
    ]);
  }
  render() {
    const state = this.state;
    const {pages, apis} = state;
    return (
      <components.PageContainer
        title={locales.ORDER}
        goBack={this.props.navigation.goBack}
        rightIcon={[
          {
            name: icons.CHECK,
            onPress: () => {
              return this.alertChange();
            },
          },
          {
            name: icons.WINDOW_CLOSE,
            onPress: () => {
              return this.removeStorage();
            },
          },
        ]}
        disabledTopFadingEdge={true}
      >
        <TabbedViewPager tabNames={this._TAB_NAMES}>
          <SegmentedControl
            style={{
              padding: 10,
              paddingHorizontal: 15,
            }}
            data={pages}
            renderRow={this.renderPageRow}
            onReleaseRow={(a, t) => {
              return this.onReleaseRow(a, t, 'pages');
            }}
          />
          <SegmentedControl
            style={{
              padding: 10,
              paddingHorizontal: 15,
            }}
            data={apis}
            renderRow={this.renderApiRow}
            onReleaseRow={(a, t) => {
              return this.onReleaseRow(a, t, 'apis');
            }}
          />
        </TabbedViewPager>
      </components.PageContainer>
    );
  }
}
export default OrderPage;
