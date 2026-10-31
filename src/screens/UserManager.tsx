import {toast} from '../native/toast';
import * as immer from 'immer';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeSpringScrollview from './../components/Scrolling';
import * as components from '../components/index';
import * as modals from '../modals/index';
import providers from '../services/providers';
import names from '../events/names';
import icons from '../theme/icons';
import locales from '../locales/index';
import * as events from '../events/index';
import * as utils from '../utils/index';
import * as types from '../utils/types';
import usersModule from '../storage/users';
import type {ScreenProps} from '../navigation/types';
import type {NeteaseAccount} from '../storage/models';
import type {TrackId} from '../services/track';
import type {Subscription} from '../events/Emitter';
import {errorMessage} from '../utils/types';
interface State {
  users: NeteaseAccount[];
  showSearchUser: boolean;
  activeUserId?: TrackId | null;
  deleting: boolean;
}
class UserManager extends React.PureComponent<ScreenProps<'UserManager'>, State> {
  onSelectedUser!: Subscription;
  backSubscription?: ReactNative.NativeEventSubscription;
  state: State = {
    users: [],
    showSearchUser: false,
    activeUserId: null,
    deleting: false,
  };
  onBackPress = () => {
    const deleting = this.state.deleting;
    return (
      !!deleting &&
      (this.setState({
        deleting: !deleting,
      }),
      true)
    );
  };
  saveUsers = () => {
    const users = this.state.users;
    if (types.isArray(users) && users.length > 0) {
      return usersModule
        .saveRestUsers(users.slice(1))
        .catch((error) => toast('保存账号失败：' + errorMessage(error)));
    }
  };
  getInfo = async () => {
    const accounts = await usersModule.getUserInfo();
    const rest = await usersModule.getRestUsers();
    const active = accounts?.netEase;
    this.setState({
      users: [...(active?.avatarUrl ? [active] : []), ...(Array.isArray(rest) ? rest : [])],
      activeUserId: active?.userId,
    });
  };
  onClosed = () => {
    this.props.navigation.goBack();
  };
  onSearchUser = () => {
    this.setState({
      showSearchUser: true,
    });
  };
  onDelete = () => {
    this.setState({
      deleting: !this.state.deleting,
    });
  };
  onPress = (e: NeteaseAccount, t: number) => {
    const n_state = this.state;
    const {deleting, users} = n_state;
    if (deleting === true) {
      if (t === 0) {
        return void toast(locales.CAN_NOT_REMOVE_CURRENT_USER);
      }
      const l = immer.produce(users, function (e) {
        e.splice(t, 1);
      });
      this.setState({
        users: l,
      });
    } else {
      if (e.userId != null) this.onUserInfo(e.userId);
    }
  };
  onUserInfo = (userId: TrackId) => {
    this.props.navigation.navigate('UserInfo', {
      userId,
    });
  };
  onSelected = (e: NeteaseAccount) => {
    const users = this.state.users;
    const r = users.some((user) => user.userId === e.userId);
    if (r !== true) {
      if (types.isObject(e)) {
        toast(locales.ADDED_TO_TOGGLE_LIST);
        const s = immer.produce(users, function (t) {
          return t.filter((t) => t.userId !== e.userId);
        });
        this.setState({
          users: [...s, e],
        });
      }
    } else {
      toast(locales.ALREADY_IN_TOGGLE_LIST);
    }
  };
  onChangeUser = async (e: NeteaseAccount, t: number) => {
    const r = immer.produce(this.state.users, function (e) {
      utils.swap(e, t, 0);
    });
    try {
      await usersModule.saveUserStorage(e, providers.netEase);
      this.setState({
        users: r,
      });
      events.emitter.emit(names.UserLogined);
      toast(`已切换到 ${e.nickname}`);
    } catch (error) {
      toast('切换账号失败：' + errorMessage(error));
    }
  };
  renderItem = ({item, index}: {item: NeteaseAccount; index: number}) => {
    return (
      <components.ListItem
        key={index}
        title={item.nickname}
        subtitle={item.signature}
        img={`${item.avatarUrl}?param=200y200`}
        onPress={() => {
          return this.onPress(item, index);
        }}
        onLongPress={() => {
          return this.onChangeUser(item, index);
        }}
      />
    );
  };
  componentDidMount() {
    this.getInfo();
    this.onSelectedUser = events.emitter.addListener(names.SelectedUser, (t) => {
      this.onSelected(t);
    });
    this.backSubscription = ReactNative.BackHandler.addEventListener(
      'hardwareBackPress',
      this.onBackPress,
    );
  }
  componentWillUnmount() {
    this.saveUsers();
    this.onSelectedUser.remove();
    this.backSubscription?.remove();
  }
  render() {
    const state = this.state;
    const {users, showSearchUser, deleting} = state;
    return (
      <components.PageContainer
        title={deleting === true ? locales.REMOVE : locales.TOGGLE}
        goBack={this.onClosed}
        backIcon={{
          name: icons.WINDOW_CLOSE,
        }}
        rightIcon={[
          {
            name: icons.ACCOUNT_PLUS,
            onPress: this.onSearchUser,
          },
          {
            name: deleting === true ? icons.DELETE_OUTLINE : icons.DELETE,
            onPress: this.onDelete,
          },
        ]}
        blur={true}
      >
        <reactNativeSpringScrollview.SpringScrollView>
          {users.map((item, index) =>
            this.renderItem({
              item,
              index,
            }),
          )}
        </reactNativeSpringScrollview.SpringScrollView>
        <modals.SearchUser
          isOpen={showSearchUser}
          onModalClose={() => {
            return this.setState({
              showSearchUser: false,
            });
          }}
          onSelected={this.onSelected}
        />
      </components.PageContainer>
    );
  }
}
export default UserManager;
