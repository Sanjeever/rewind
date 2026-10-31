const _interopRequireWildcard = require('@babel/runtime/helpers/interopRequireWildcard');
const _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');
const _toConsumableArray = require('@babel/runtime/helpers/toConsumableArray');
Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;
var immer = require('immer'),
  React = _interopRequireWildcard(require('react')),
  ReactNative = require('react-native'),
  reactNativeSpringScrollview = require('./../components/Scrolling.js'),
  components = require('../components/index'),
  modals = require('../modals/index'),
  providers = _interopRequireDefault(require('../services/providers')),
  names = _interopRequireDefault(require('../events/names')),
  icons = _interopRequireDefault(require('../theme/icons')),
  locales = _interopRequireDefault(require('../locales/index')),
  events = require('../events/index'),
  utils = require('../utils/index'),
  types = _interopRequireWildcard(require('../utils/types')),
  usersModule = _interopRequireDefault(require('../storage/users')),
  U = class t extends React.PureComponent {
    constructor() {
      var e, r, n;
      for (var s = arguments.length, l = new Array(s), i = 0; i < s; i++) l[i] = arguments[i];
      return (
        (r = n = super(...l)),
        (n.state = {
          users: [],
          showSearchUser: false,
          activeUserId: null,
          deleting: false,
        }),
        (n.onBackPress = function () {
          var e = n.state.deleting;
          return (
            !!e &&
            (n.setState({
              deleting: !e,
            }),
            true)
          );
        }),
        (n.saveUsers = function () {
          var e = n.state.users;
          types.isArray(e) && e.length > 0 && usersModule.default.saveRestUsers(e.slice(1));
        }),
        (n.getInfo = async function () {
          const accounts = await usersModule.default.getUserInfo();
          const rest = await usersModule.default.getRestUsers();
          const active = accounts?.netEase;
          n.setState({
            users: [...(active?.avatarUrl ? [active] : []), ...(Array.isArray(rest) ? rest : [])],
            activeUserId: active?.userId,
          });
        }),
        (n.onClosed = function () {
          n.props.navigation.goBack();
        }),
        (n.onSearchUser = function () {
          n.setState({
            showSearchUser: true,
          });
        }),
        (n.onDelete = function () {
          n.setState({
            deleting: !n.state.deleting,
          });
        }),
        (n.onPress = function (e, t) {
          var r = n.state,
            s = r.deleting,
            o = r.users;
          if (true === s) {
            if (0 === t) return void toast(locales.default.CAN_NOT_REMOVE_CURRENT_USER);
            var l = (0, immer.produce)(o, function (e) {
              e.splice(t, 1);
            });
            n.setState({
              users: l,
            });
          } else n.onUserInfo(e.userId);
        }),
        (n.onUserInfo = function (e) {
          n.props.navigation.navigate('UserInfo', {
            userId: e,
          });
        }),
        (n.onSelected = function (e) {
          var t = n.state.users,
            r = false;
          if (
            (t.map(function (t) {
              t.userId === e.userId && (r = true);
            }),
            true !== r)
          ) {
            if (types.isObject(e)) {
              toast(locales.default.ADDED_TO_TOGGLE_LIST);
              var s = (0, immer.produce)(t, function (t) {
                return t.filter(function (t) {
                  return t.userId !== e.userId;
                });
              });
              n.setState({
                users: _toConsumableArray(s).concat([e]),
              });
            }
          } else toast(locales.default.ALREADY_IN_TOGGLE_LIST);
        }),
        (n.onChangeUser = function (e, t) {
          var r = (0, immer.produce)(n.state.users, function (e) {
            (0, utils.swap)(e, t, 0);
          });
          n.setState({
            users: r,
          });
          usersModule.default.saveUserStorage(e, providers.default.netEase);
          events.emitter.emit(names.default.UserLogined);
          toast('\u5df2\u5207\u6362\u5230 ' + e.nickname);
        }),
        (n.renderItem = function (e) {
          var t = e.item,
            r = e.index;
          return React.default.createElement(components.ListItem, {
            key: r,
            title: t.nickname,
            subtitle: t.signature,
            img: t.avatarUrl + '?param=200y200',
            onPress: function () {
              return n.onPress(t, r);
            },
            onLongPress: function () {
              return n.onChangeUser(t, r);
            },
          });
        }),
        r
      );
    }
    componentDidMount() {
      var e = this;
      this.getInfo();
      this.onSelectedUser = events.emitter.addListener(names.default.SelectedUser, function (t) {
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
      var e = this,
        t = this.state,
        r = t.users,
        n = t.showSearchUser,
        s = t.deleting;
      return React.default.createElement(
        components.PageContainer,
        {
          title: true === s ? locales.default.REMOVE : locales.default.TOGGLE,
          goBack: this.onClosed,
          backIcon: {
            name: icons.default.WINDOW_CLOSE,
          },
          rightIcon: [
            {
              name: icons.default.ACCOUNT_PLUS,
              onPress: this.onSearchUser,
            },
            {
              name: true === s ? icons.default.DELETE_OUTLINE : icons.default.DELETE,
              onPress: this.onDelete,
            },
          ],
          blur: true,
        },
        React.default.createElement(
          reactNativeSpringScrollview.SpringScrollView,
          null,
          r.map(function (t, r) {
            return e.renderItem({
              item: t,
              index: r,
            });
          }),
        ),
        React.default.createElement(modals.SearchUser, {
          isOpen: n,
          onModalClose: function () {
            return e.setState({
              showSearchUser: false,
            });
          },
          onSelected: this.onSelected,
        }),
      );
    }
  };
exports.default = U;
