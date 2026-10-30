Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var immer = require("immer"),
  React = babelHelpers.interopRequireWildcard(require("react")),
  ReactNative = require("react-native"),
  reactNativeSpringScrollview = require("react-native-spring-scrollview"),
  components = require("../components/index"),
  modals = require("../modals/index"),
  providers = babelHelpers.interopRequireDefault(require("../services/providers")),
  names = babelHelpers.interopRequireDefault(require("../events/names")),
  icons = babelHelpers.interopRequireDefault(require("../theme/icons")),
  locales = babelHelpers.interopRequireDefault(require("../locales/index")),
  events = require("../events/index"),
  utils = require("../utils/index"),
  types = babelHelpers.interopRequireWildcard(require("../utils/types")),
  usersModule = babelHelpers.interopRequireDefault(require("../storage/users")),
  U = function (e) {
    function t() {
      var e, r, n;
      babelHelpers.classCallCheck(this, t);
      for (var s = arguments.length, l = new Array(s), i = 0; i < s; i++) l[i] = arguments[i];
      return babelHelpers.possibleConstructorReturn(n, (r = n = babelHelpers.possibleConstructorReturn(this, (e = babelHelpers.getPrototypeOf(t)).call.apply(e, [this].concat(l))), n.state = {
        users: [],
        showSearchUser: false,
        activeUserId: null,
        deleting: false
      }, n.onBackPress = function () {
        var e = n.state.deleting;
        return !!e && (n.setState({
          deleting: !e
        }), true);
      }, n.saveUsers = function () {
        var e = n.state.users;
        types.isArray(e) && e.length > 0 && usersModule.default.saveRestUsers(e.slice(1));
      }, n.getInfo = function () {
        var e, t, r, s;
        return regeneratorRuntime.async(function (a) {
          for (;;) switch (a.prev = a.next) {
            case 0:
              a.next = 2;
              return regeneratorRuntime.awrap(usersModule.default.getUserInfo());
            case 2:
              e = a.sent;
              a.next = 5;
              return regeneratorRuntime.awrap(usersModule.default.getRestUsers());
            case 5:
              t = a.sent;
              types.isObject(e) && (r = e.netEase, s = [], types.isObject(r) && types.isString(r.avatarUrl) && (s.push(r), types.isArray(t) && t.length > 0 && (s = babelHelpers.toConsumableArray(s).concat(babelHelpers.toConsumableArray(t))), n.setState({
                users: s,
                activeUserId: r.userId
              })));
            case 7:
            case "end":
              return a.stop();
          }
        }, null, this);
      }, n.onClosed = function () {
        n.props.navigation.goBack();
      }, n.onSearchUser = function () {
        n.setState({
          showSearchUser: true
        });
      }, n.onDelete = function () {
        n.setState({
          deleting: !n.state.deleting
        });
      }, n.onPress = function (e, t) {
        var r = n.state,
          s = r.deleting,
          o = r.users;
        if (true === s) {
          if (0 === t) return void toast(locales.default.CAN_NOT_REMOVE_CURRENT_USER);
          var l = (0, immer.produce)(o, function (e) {
            e.splice(t, 1);
          });
          n.setState({
            users: l
          });
        } else n.onUserInfo(e.userId);
      }, n.onUserInfo = function (e) {
        n.props.navigation.navigate('UserInfo', {
          userId: e
        });
      }, n.onSelected = function (e) {
        var t = n.state.users,
          r = false;
        if (t.map(function (t) {
          t.userId === e.userId && (r = true);
        }), true !== r) {
          if (types.isObject(e)) {
            toast(locales.default.ADDED_TO_TOGGLE_LIST);
            var s = (0, immer.produce)(t, function (t) {
              return t.filter(function (t) {
                return t.userId !== e.userId;
              });
            });
            n.setState({
              users: babelHelpers.toConsumableArray(s).concat([e])
            });
          }
        } else toast(locales.default.ALREADY_IN_TOGGLE_LIST);
      }, n.onChangeUser = function (e, t) {
        var r = (0, immer.produce)(n.state.users, function (e) {
          (0, utils.swap)(e, t, 0);
        });
        n.setState({
          users: r
        });
        usersModule.default.saveUserStorage(e, providers.default.netEase);
        events.emitter.emit(names.default.UserLogined);
        toast("\u5df2\u5207\u6362\u5230 " + e.nickname);
      }, n.renderItem = function (e) {
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
          }
        });
      }, r));
    }
    babelHelpers.createClass(t, [{
      key: "componentDidMount",
      value: function () {
        var e = this;
        this.getInfo();
        this.onSelectedUser = events.emitter.addListener(names.default.SelectedUser, function (t) {
          e.onSelected(t);
        });
        ReactNative.BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
      }
    }, {
      key: "componentWillUnmount",
      value: function () {
        this.saveUsers();
        this.onSelectedUser.remove();
        ReactNative.BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
      }
    }, {
      key: "render",
      value: function () {
        var e = this,
          t = this.state,
          r = t.users,
          n = t.showSearchUser,
          s = t.deleting;
        return React.default.createElement(components.PageContainer, {
          title: true === s ? locales.default.REMOVE : locales.default.TOGGLE,
          goBack: this.onClosed,
          backIcon: {
            name: icons.default.WINDOW_CLOSE
          },
          rightIcon: [{
            name: icons.default.ACCOUNT_PLUS,
            onPress: this.onSearchUser
          }, {
            name: true === s ? icons.default.DELETE_OUTLINE : icons.default.DELETE,
            onPress: this.onDelete
          }],
          blur: true
        }, React.default.createElement(reactNativeSpringScrollview.SpringScrollView, null, r.map(function (t, r) {
          return e.renderItem({
            item: t,
            index: r
          });
        })), React.default.createElement(modals.SearchUser, {
          isOpen: n,
          onModalClose: function () {
            return e.setState({
              showSearchUser: false
            });
          },
          onSelected: this.onSelected
        }));
      }
    }]);
    babelHelpers.inherits(t, e);
    return t;
  }(React.PureComponent);
exports.default = U;
