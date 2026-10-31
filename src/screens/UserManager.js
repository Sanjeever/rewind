import * as immer from 'immer';
import * as React from 'react';
import * as ReactNative from 'react-native';
import * as reactNativeSpringScrollview from './../components/Scrolling.js';
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
class UserManager extends React.PureComponent {
  state = {
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
      usersModule.saveRestUsers(users.slice(1));
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
  onPress = (e, t) => {
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
      this.onUserInfo(e.userId);
    }
  };
  onUserInfo = (userId) => {
    this.props.navigation.navigate('UserInfo', {
      userId,
    });
  };
  onSelected = (e) => {
    const users = this.state.users;
    let r = false;
    users.map((t) => {
      if (t.userId === e.userId) {
        r = true;
      }
    });
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
  onChangeUser = (e, t) => {
    const r = immer.produce(this.state.users, function (e) {
      utils.swap(e, t, 0);
    });
    this.setState({
      users: r,
    });
    usersModule.saveUserStorage(e, providers.netEase);
    events.emitter.emit(names.UserLogined);
    toast(`已切换到 ${e.nickname}`);
  };
  renderItem = ({item, index}) => {
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
    const e = this;
    this.getInfo();
    this.onSelectedUser = events.emitter.addListener(names.SelectedUser, function (t) {
      e.onSelected(t);
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
    const e = this;
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
            e.renderItem({
              item,
              index,
            }),
          )}
        </reactNativeSpringScrollview.SpringScrollView>
        <modals.SearchUser
          isOpen={showSearchUser}
          onModalClose={function () {
            return e.setState({
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
