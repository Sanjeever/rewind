import React from 'react';
import {BackHandler, StyleSheet, View} from 'react-native';
import type {NativeEventSubscription} from 'react-native';
import {PageContainer, Icon} from '../components';
import {SpringScrollView} from '../components/Scrolling';
import TabbedViewPager from '../native/TabbedViewPager';
import ProviderSelector from '../modules/ProviderSelector';
import pagesModule from '../settings/pages';
import {storage} from '../storage';
import keys from '../storage/keys';
import icons from '../theme/icons';
import locales from '../locales';
import restart from '../native/restart';
import {toast} from '../native/toast';
import {errorMessage} from '../utils/types';
import {Alert} from 'react-native';
import type {Navigation} from '../navigation/types';

type Page = (typeof pagesModule.pages)[number];
interface State {
  pages: Page[];
  apis: string[];
  changed: boolean;
}
export default class OrderPage extends React.PureComponent<
  {navigation: Pick<Navigation, 'goBack'>},
  State
> {
  state: State = {pages: pagesModule.pages, apis: pagesModule.apis, changed: false};
  backSubscription?: NativeEventSubscription;

  async componentDidMount() {
    this.backSubscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!this.state.changed) return false;
      this.alertChange();
      return true;
    });
    try {
      const read = async <T,>(key: string, defaults: T): Promise<T> => {
        try {
          return await storage.load<T>({key});
        } catch (error) {
          if (error instanceof Error && error.name === 'NotFoundError') return defaults;
          throw error;
        }
      };
      const [pages, apis] = await Promise.all([
        read(keys.pagesOrder, pagesModule.pages),
        read(keys.apisOrder, pagesModule.apis),
      ]);
      this.setState({pages, apis});
    } catch (error) {
      toast('读取排序失败：' + errorMessage(error));
    }
  }
  componentWillUnmount() {
    this.backSubscription?.remove();
  }
  move = (field: 'pages' | 'apis', index: number, delta: -1 | 1) => {
    this.setState((state) => {
      const reorder = <T,>(items: T[]) => {
        const next = [...items];
        [next[index], next[index + delta]] = [next[index + delta], next[index]];
        return next;
      };
      return field === 'pages'
        ? {...state, pages: reorder(state.pages), changed: true}
        : {...state, apis: reorder(state.apis), changed: true};
    });
  };
  confirmChange = async () => {
    try {
      await Promise.all([
        storage.save({key: keys.pagesOrder, data: this.state.pages}),
        storage.save({key: keys.apisOrder, data: this.state.apis}),
      ]);
      restart.restart();
    } catch (error) {
      toast('保存排序失败：' + errorMessage(error));
    }
  };
  removeStorage = async () => {
    try {
      await Promise.all([
        storage.remove({key: keys.pagesOrder}),
        storage.remove({key: keys.apisOrder}),
      ]);
      this.setState({pages: pagesModule.pages, apis: pagesModule.apis, changed: false});
      toast(locales.CACHE_CLEARED);
    } catch (error) {
      toast('重置排序失败：' + errorMessage(error));
    }
  };
  alertChange = () =>
    Alert.alert(locales.WARN, locales.NEED_RELOAD_APP, [
      {text: locales.CANCEL, onPress: () => this.props.navigation.goBack(), style: 'cancel'},
      {text: locales.CONFIRM, onPress: this.confirmChange},
    ]);
  renderList = (field: 'pages' | 'apis') => (
    <SpringScrollView contentStyle={styles.list}>
      {this.state[field].map((item, index, items) => (
        <View key={index} style={styles.row}>
          <View style={styles.label}>
            {typeof item === 'string' ? (
              <ProviderSelector type="apis" data={item} />
            ) : (
              <ProviderSelector type="pages" data={item} />
            )}
          </View>
          <Icon
            name={icons.ARROW_UP}
            size={20}
            disabled={index === 0}
            accessibilityLabel="上移"
            onPress={() => this.move(field, index, -1)}
            style={styles.button}
          />
          <Icon
            name={icons.ARROW_DOWN}
            size={20}
            disabled={index === items.length - 1}
            accessibilityLabel="下移"
            onPress={() => this.move(field, index, 1)}
            style={styles.button}
          />
        </View>
      ))}
    </SpringScrollView>
  );
  render() {
    return (
      <PageContainer
        title={locales.ORDER}
        goBack={this.props.navigation.goBack}
        rightIcon={[
          {name: icons.CHECK, onPress: this.alertChange},
          {name: icons.WINDOW_CLOSE, onPress: this.removeStorage},
        ]}
      >
        <TabbedViewPager tabNames={['Up', 'Down']}>
          {this.renderList('pages')}
          {this.renderList('apis')}
        </TabbedViewPager>
      </PageContainer>
    );
  }
}
const styles = StyleSheet.create({
  list: {padding: 10, paddingHorizontal: 15},
  row: {flexDirection: 'row', alignItems: 'center'},
  label: {flex: 1},
  button: {padding: 12},
});
